"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { assertStaff } from "@/features/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  isFulfillmentOrderStatus,
  orderHasConfirmedPayment,
} from "@/features/orders/payment-rules";
import type { OrderStatus, PaymentStatus, ReviewStatus, ServiceRequestStatus } from "@/types/database";

const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export async function updateOrderStatus(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("order_id") ?? "");
  const status = orderStatusSchema.parse(formData.get("status"));
  const adminNote = String(formData.get("admin_note") ?? "").trim() || null;

  const supabase = await createSupabaseServerClient();

  if (isFulfillmentOrderStatus(status)) {
    const { data: payments } = await supabase
      .from("payments")
      .select("status")
      .eq("order_id", id);

    if (!orderHasConfirmedPayment(payments ?? [])) {
      redirect("/admin/commandes/" + id + "?erreur=paiement-requis-livraison");
    }
  }

  if (status === "cancelled") {
    const admin = createSupabaseAdminClient();
    await admin.rpc("restock_order", { p_order_id: id });
  }

  const { error } = await supabase
    .from("orders")
    .update({ status, admin_note: adminNote })
    .eq("id", id);

  if (error) {
    const message = error.message.includes("paiement")
      ? "paiement-requis-livraison"
      : encodeURIComponent(error.message);
    redirect(`/admin/commandes/${id}?erreur=${message}`);
  }

  revalidatePath(`/admin/commandes/${id}`);
  revalidatePath("/admin/commandes");
  redirect(`/admin/commandes/${id}?ok=statut`);
}

export async function confirmPayment(formData: FormData) {
  await assertStaff();
  const paymentId = String(formData.get("payment_id") ?? "");
  const orderId = String(formData.get("order_id") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("payments")
    .update({ status: "paid" as PaymentStatus, processed_at: new Date().toISOString() })
    .eq("id", paymentId);

  if (error) redirect(`/admin/commandes/${orderId}?erreur=${encodeURIComponent(error.message)}`);

  await supabase
    .from("orders")
    .update({ status: "confirmed" as OrderStatus })
    .eq("id", orderId)
    .eq("status", "pending");

  revalidatePath(`/admin/commandes/${orderId}`);
  redirect(`/admin/commandes/${orderId}?ok=paiement`);
}

const reviewStatusSchema = z.enum(["approved", "rejected", "pending"]);

export async function moderateReview(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("review_id") ?? "");
  const status = reviewStatusSchema.parse(formData.get("status")) as ReviewStatus;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("reviews").update({ status }).eq("id", id);
  if (error) redirect(`/admin/avis?erreur=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/avis");
  revalidatePath("/admin");
  redirect("/admin/avis?ok=avis");
}

const serviceStatusSchema = z.enum([
  "submitted",
  "in_review",
  "quoted",
  "in_progress",
  "delivered",
  "completed",
  "cancelled",
]);

export async function updateServiceRequest(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("request_id") ?? "");
  const status = serviceStatusSchema.parse(formData.get("status")) as ServiceRequestStatus;
  const quotedAmountRaw = String(formData.get("quoted_amount") ?? "").trim();
  const quotedAmount = quotedAmountRaw ? Number(quotedAmountRaw) : null;
  const adminNotes = String(formData.get("admin_notes") ?? "").trim() || null;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("service_requests")
    .update({
      status,
      quoted_amount: Number.isFinite(quotedAmount) ? quotedAmount : null,
      admin_notes: adminNotes,
    })
    .eq("id", id);

  if (error) redirect(`/admin/demandes/${id}?erreur=${encodeURIComponent(error.message)}`);

  revalidatePath(`/admin/demandes/${id}`);
  revalidatePath("/admin/demandes");
  redirect(`/admin/demandes/${id}?ok=statut`);
}

export async function deleteServiceRequest(formData: FormData) {
  await assertStaff();
  const id = String(formData.get("request_id") ?? "");

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("service_requests").delete().eq("id", id);
  if (error) redirect(`/admin/demandes?erreur=${encodeURIComponent(error.message)}`);

  revalidatePath("/admin/demandes");
  redirect("/admin/demandes?ok=supprime");
}
