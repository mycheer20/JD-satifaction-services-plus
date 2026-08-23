import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

export type AdminNotificationKind = "payment_proof_submitted";

export async function createAdminNotification(input: {
  kind: AdminNotificationKind;
  title: string;
  message: string;
  linkHref: string;
  payload?: Record<string, unknown>;
}) {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("admin_notifications").insert({
    kind: input.kind,
    title: input.title,
    message: input.message,
    link_href: input.linkHref,
    payload: (input.payload ?? {}) as Json,
  });

  if (error) {
    console.error("Notification admin non enregistrée :", error.message);
  }
}

export async function notifyAdminPaymentProofSubmitted(input: {
  orderId: string;
  paymentId: string;
  provider: string;
  customerTxnId: string;
  fileCount: number;
}) {
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("reference, customer_name, customer_phone")
    .eq("id", input.orderId)
    .maybeSingle();

  const providerLabel = input.provider === "moncash" ? "MonCash" : "NatCash";
  const reference = order?.reference ?? input.orderId.slice(0, 8);
  const customer = order?.customer_name ?? "Client";

  const captureLabel =
    input.fileCount > 0
      ? `${input.fileCount} capture${input.fileCount > 1 ? "s" : ""}.`
      : "Mise à jour du code transaction (sans nouvelle capture).";

  await createAdminNotification({
    kind: "payment_proof_submitted",
    title: `Preuve ${providerLabel} — commande ${reference}`,
    message: `${customer} a envoyé une preuve de paiement. Code transaction : ${input.customerTxnId}. ${captureLabel}`,
    linkHref: `/admin/commandes/${input.orderId}`,
    payload: {
      order_id: input.orderId,
      payment_id: input.paymentId,
      order_reference: reference,
      customer_name: customer,
      customer_phone: order?.customer_phone ?? null,
      provider: input.provider,
      customer_txn_id: input.customerTxnId,
      file_count: input.fileCount,
    },
  });
}
