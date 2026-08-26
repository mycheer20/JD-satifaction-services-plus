"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSessionUser } from "@/features/auth/session";
import {
  isMobileMoneyProvider,
  PAYMENT_PROOF_MAX_BYTES,
  PAYMENT_PROOF_MAX_FILES,
} from "@/features/payments/mobile-money";
import { notifyAdminPaymentProofSubmitted } from "@/features/admin/notifications";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { resolveImageMime } from "@/lib/uploads/resolve-image-mime";

export interface PaymentProofState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

const proofSchema = z.object({
  paymentId: z.string().uuid(),
  orderId: z.string().uuid(),
  customerTxnId: z
    .string()
    .trim()
    .min(4, "Indiquez le code / ID de transaction.")
    .max(80, "ID de transaction trop long."),
});

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "capture";
}

async function assertCanSubmitProof(orderId: string, userId: string | null) {
  const admin = createSupabaseAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .select("id, user_id")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) {
    throw new Error("Commande introuvable.");
  }

  if (order.user_id && order.user_id !== userId) {
    throw new Error("Vous ne pouvez pas modifier cette commande.");
  }

  return order;
}

export async function submitPaymentProof(
  _previous: PaymentProofState,
  formData: FormData,
): Promise<PaymentProofState> {
  const parsed = proofSchema.safeParse({
    paymentId: formData.get("payment_id"),
    orderId: formData.get("order_id"),
    customerTxnId: formData.get("customer_txn_id"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key =
        issue.path[0] === "customerTxnId"
          ? "customer_txn_id"
          : String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return {
      status: "error",
      message: "Merci de corriger les champs signalés.",
      fieldErrors,
    };
  }

  const { paymentId, orderId, customerTxnId } = parsed.data;
  const user = await getSessionUser();

  try {
    await assertCanSubmitProof(orderId, user?.id ?? null);
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Accès refusé.",
    };
  }

  const admin = createSupabaseAdminClient();

  const files = formData
    .getAll("proofs")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (files.length === 0) {
    const { data: paymentRow } = await admin
      .from("payments")
      .select("proof_submitted_at")
      .eq("id", paymentId)
      .maybeSingle();

    if (!paymentRow?.proof_submitted_at) {
      return {
        status: "error",
        message: "Ajoutez au moins une capture de la transaction.",
        fieldErrors: { proofs: "Au moins une capture est obligatoire." },
      };
    }
  }

  if (files.length > PAYMENT_PROOF_MAX_FILES) {
    return {
      status: "error",
      message: `Maximum ${PAYMENT_PROOF_MAX_FILES} captures par envoi.`,
      fieldErrors: { proofs: `Maximum ${PAYMENT_PROOF_MAX_FILES} fichiers.` },
    };
  }

  const { data: payment, error: paymentError } = await admin
    .from("payments")
    .select("id, order_id, provider, status")
    .eq("id", paymentId)
    .eq("order_id", orderId)
    .maybeSingle();

  if (paymentError || !payment) {
    return { status: "error", message: "Paiement introuvable." };
  }

  if (!isMobileMoneyProvider(payment.provider)) {
    return { status: "error", message: "Ce mode de paiement ne permet pas l'envoi en ligne." };
  }

  if (payment.status !== "pending") {
    return { status: "error", message: "Ce paiement a déjà été traité." };
  }

  const rows: {
    payment_id: string;
    storage_path: string;
    file_name: string;
    mime_type: string | null;
    size_bytes: number;
  }[] = [];

  for (const [index, file] of files.entries()) {
    if (file.size > PAYMENT_PROOF_MAX_BYTES) {
      return {
        status: "error",
        message: `« ${file.name} » dépasse 5 Mo.`,
        fieldErrors: { proofs: "Chaque capture doit faire 5 Mo maximum." },
      };
    }

    const storagePath = `${orderId}/${paymentId}/${Date.now()}-${index}-${sanitizeFileName(file.name)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = resolveImageMime(file, buffer);
    if (!mime) {
      return {
        status: "error",
        message: "Format non accepté. Utilisez JPEG, PNG ou WebP.",
        fieldErrors: { proofs: "Formats acceptés : JPEG, PNG, WebP, GIF." },
      };
    }

    const { error: uploadError } = await admin.storage
      .from("payment-proofs")
      .upload(storagePath, buffer, { contentType: mime, upsert: false });

    if (uploadError) {
      return {
        status: "error",
        message: `Échec de l'envoi de « ${file.name} ».`,
      };
    }

    rows.push({
      payment_id: paymentId,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: mime,
      size_bytes: file.size,
    });
  }

  if (rows.length > 0) {
    const { error: insertError } = await admin.from("payment_proof_files").insert(rows);
    if (insertError) {
      return { status: "error", message: "Enregistrement des captures impossible." };
    }
  }

  const now = new Date().toISOString();
  const { data: existing } = await admin
    .from("payments")
    .select("provider_payload")
    .eq("id", paymentId)
    .maybeSingle();

  const payload =
    existing?.provider_payload && typeof existing.provider_payload === "object"
      ? (existing.provider_payload as Record<string, unknown>)
      : {};

  await admin
    .from("payments")
    .update({
      customer_txn_id: customerTxnId,
      proof_submitted_at: now,
      provider_payload: {
        ...payload,
        proofSubmittedAt: now,
        customerTxnId,
      },
    })
    .eq("id", paymentId);

  const fileCount = rows.length;

  await notifyAdminPaymentProofSubmitted({
    orderId,
    paymentId,
    provider: payment.provider,
    customerTxnId,
    fileCount,
  });

  revalidatePath(`/commande/${orderId}`);
  revalidatePath("/compte/notifications");
  revalidatePath(`/admin/commandes/${orderId}`);
  revalidatePath("/admin/notifications");
  revalidatePath("/admin");
  redirect(`/commande/${orderId}?preuve=1`);
}
