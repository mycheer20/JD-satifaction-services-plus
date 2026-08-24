"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/features/auth/session";
import { buildGuestWhatsAppMessage } from "@/features/checkout/guest-whatsapp";
import { getPaymentProvider, isCheckoutPaymentProvider } from "@/features/payments/provider";
import { storeWhatsAppHref } from "@/lib/store/contact";
import { publicEnv } from "@/lib/public-env";

/**
 * Checkout.
 *
 * The browser submits *what* is being bought and where to ship it. It never
 * submits a price: `place_order` re-reads every price and stock level inside a
 * single transaction. A tampered cart therefore produces either the correct
 * total or an error, never a discount.
 */

const lineSchema = z.object({
  productId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional(),
  serviceId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(99),
});

const cartLineDisplaySchema = z.object({
  name: z.string().trim().min(1).max(200),
  variantLabel: z.string().trim().max(120).optional(),
  quantity: z.number().int().min(1).max(99),
  unitPrice: z.number().min(0),
  currency: z.string().trim().min(3).max(3),
});

const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis.").max(120),
  email: z.string().trim().email("Adresse e-mail invalide."),
  phone: z.string().trim().min(6, "Le téléphone est requis.").max(40),
  address: z.string().trim().min(5, "L'adresse est requise.").max(400),
  city: z.string().trim().min(2, "La ville est requise.").max(120),
  region: z.string().trim().max(120).optional().default(""),
  postalCode: z.string().trim().max(20).optional().default(""),
  note: z.string().trim().max(1000).optional().default(""),
  couponCode: z.string().trim().max(60).optional().default(""),
  paymentMethod: z.string().trim().min(1, "Choisissez un moyen de paiement."),
  items: z.array(lineSchema).min(1, "Votre panier est vide."),
});

export interface CheckoutState {
  status: "idle" | "error" | "whatsapp";
  message?: string;
  fieldErrors?: Record<string, string>;
  whatsAppUrl?: string;
}

export async function submitOrder(
  _previous: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  let rawItems: unknown;
  let rawCartLines: unknown;
  try {
    rawItems = JSON.parse(String(formData.get("items") ?? "[]"));
    rawCartLines = JSON.parse(String(formData.get("cartLines") ?? "[]"));
  } catch {
    return { status: "error", message: "Panier illisible." };
  }

  const parsed = checkoutSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    region: formData.get("region") ?? "",
    postalCode: formData.get("postalCode") ?? "",
    note: formData.get("note") ?? "",
    couponCode: formData.get("couponCode") ?? "",
    paymentMethod: formData.get("paymentMethod"),
    items: rawItems,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Merci de corriger les informations signalées.",
      fieldErrors,
    };
  }

  const input = parsed.data;

  const provider = getPaymentProvider(input.paymentMethod);
  if (!provider || !isCheckoutPaymentProvider(input.paymentMethod)) {
    return { status: "error", message: "Moyen de paiement indisponible." };
  }

  // Reject a line that names neither a product nor a service before touching
  // the database.
  const items = input.items.map((line) => {
    if (!line.productId && !line.serviceId) {
      throw new Error("Ligne de commande invalide.");
    }
    return {
      product_id: line.productId ?? null,
      variant_id: line.variantId ?? null,
      service_id: line.serviceId ?? null,
      quantity: line.quantity,
    };
  });

  const user = await getSessionUser();

  if (!user) {
    const cartLinesParsed = z.array(cartLineDisplaySchema).safeParse(rawCartLines);
    if (!cartLinesParsed.success || cartLinesParsed.data.length === 0) {
      return { status: "error", message: "Panier illisible." };
    }

    const message = buildGuestWhatsAppMessage({
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      city: input.city,
      region: input.region,
      postalCode: input.postalCode,
      note: input.note,
      couponCode: input.couponCode,
      paymentMethodLabel: provider.label,
      lines: cartLinesParsed.data,
    });

    return {
      status: "whatsapp",
      whatsAppUrl: storeWhatsAppHref(message),
    };
  }

  const supabase = createSupabaseAdminClient();

  const shippingAddress = {
    line1: input.address,
    city: input.city,
    region: input.region,
    postal_code: input.postalCode,
  };

  const { data, error } = await supabase.rpc("place_order", {
    p_user_id: user?.id ?? null,
    p_customer: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      note: input.note,
    },
    p_items: items,
    p_coupon_code: input.couponCode || null,
    p_shipping_total: 0,
  });

  if (error) {
    // The database raises a readable French message for the cases a shopper can
    // actually hit (empty cart, unavailable product, insufficient stock).
    return { status: "error", message: error.message };
  }

  const order = data as unknown as {
    order_id: string;
    reference: string;
    total: number;
    currency: string;
  };

  const intent = await provider.createIntent({
    orderId: order.order_id,
    reference: order.reference,
    amount: order.total,
    currency: order.currency,
    customerEmail: input.email,
    customerName: input.name,
    customerPhone: input.phone,
    returnUrl: `${publicEnv.siteUrl}/commande/${order.order_id}`,
  });

  await supabase.from("payments").insert({
    order_id: order.order_id,
    provider: provider.id,
    payment_method: provider.label,
    status: intent.status,
    amount: order.total,
    currency: order.currency,
    transaction_reference: intent.transactionReference ?? null,
    provider_payload: (intent.payload ?? {}) as never,
    failure_reason: intent.failureReason ?? null,
    processed_at: intent.status === "paid" ? new Date().toISOString() : null,
  });

  // An offline method leaves the order pending until an administrator confirms
  // the funds; an online one may hand back a hosted payment page.
  if (intent.redirectUrl) redirect(intent.redirectUrl);

  redirect(`/commande/${order.order_id}?nouvelle=1`);
}
