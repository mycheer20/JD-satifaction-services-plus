"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSessionUser } from "@/features/auth/session";
import { buildGuestWhatsAppMessage } from "@/features/checkout/guest-whatsapp";
import { validateDeliverySelection } from "@/features/delivery/validate";
import { getPaymentProvider, isCheckoutPaymentProvider } from "@/features/payments/provider";
import { storeWhatsAppHref } from "@/lib/store/contact";
import { publicEnv } from "@/lib/public-env";
import type { Json } from "@/types/database";

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
  fulfillmentMode: z.enum(["delivery", "pickup"]),
  countryId: z.string().uuid().optional().or(z.literal("")),
  departmentId: z.string().uuid().optional().or(z.literal("")),
  communeId: z.string().uuid().optional().or(z.literal("")),
  cityId: z.string().uuid().optional().or(z.literal("")),
  zoneId: z.string().uuid().optional().or(z.literal("")),
  address: z.string().trim().max(400).optional().default(""),
  landmark: z.string().trim().max(200).optional().default(""),
  deliveryPhone: z.string().trim().max(40).optional().default(""),
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
    fulfillmentMode: formData.get("fulfillmentMode") ?? "delivery",
    countryId: formData.get("countryId") ?? "",
    departmentId: formData.get("departmentId") ?? "",
    communeId: formData.get("communeId") ?? "",
    cityId: formData.get("cityId") ?? "",
    zoneId: formData.get("zoneId") ?? "",
    address: formData.get("address") ?? "",
    landmark: formData.get("landmark") ?? "",
    deliveryPhone: formData.get("deliveryPhone") ?? "",
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

  const deliveryResult = await validateDeliverySelection({
    fulfillmentMode: input.fulfillmentMode,
    countryId: input.countryId || undefined,
    departmentId: input.departmentId || undefined,
    communeId: input.communeId || undefined,
    cityId: input.cityId || undefined,
    zoneId: input.zoneId || undefined,
    address: input.address,
    landmark: input.landmark,
    deliveryPhone: input.deliveryPhone,
    note: input.note,
  });

  if (!deliveryResult.ok) {
    return { status: "error", message: deliveryResult.message };
  }

  const delivery = deliveryResult.data;

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
      delivery: delivery.snapshot,
      shippingTotal: delivery.shippingTotal,
      shippingCurrency: delivery.currency,
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

  const shippingAddress = delivery.snapshot as unknown as Json;

  const { data, error } = await supabase.rpc("place_order", {
    p_user_id: user.id,
    p_customer: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      note: input.note,
      fulfillment_mode: delivery.mode,
      delivery_zone_id: delivery.zoneId,
    } as Json,
    p_items: items,
    p_coupon_code: input.couponCode || null,
    p_shipping_total: delivery.shippingTotal,
  });

  if (error) {
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

  if (intent.redirectUrl) redirect(intent.redirectUrl);

  redirect(`/commande/${order.order_id}?nouvelle=1`);
}
