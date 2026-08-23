import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  OrderItemRow,
  OrderRow,
  OrderStatus,
  PaymentProofFileRow,
  PaymentRow,
  PaymentStatus,
} from "@/types/database";

export interface OrderWithDetails extends OrderRow {
  items: OrderItemRow[];
  payments: PaymentRow[];
}

export interface PaymentWithProofFiles extends PaymentRow {
  proof_files: PaymentProofFileRow[];
}

export interface OrderWithPaymentProofs extends OrderWithDetails {
  payments: PaymentWithProofFiles[];
}

/**
 * Row level security already restricts this to the customer who placed the
 * order and to staff, so no ownership check is repeated here.
 */
export async function getOrder(id: string): Promise<OrderWithDetails | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`*, items:order_items ( * ), payments:payments ( * )`)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Chargement de la commande : ${error.message}`);
  return (data as unknown as OrderWithDetails) ?? null;
}

/**
 * Page de confirmation après checkout — accessible via le lien commande (UUID).
 * Inclut les preuves MonCash / NatCash pour les paiements en attente.
 */
export async function getOrderForConfirmation(id: string): Promise<OrderWithPaymentProofs | null> {
  const admin = createSupabaseAdminClient();

  const { data, error } = await admin
    .from("orders")
    .select(
      `*, items:order_items ( * ), payments:payments ( *, proof_files:payment_proof_files ( * ) )`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Chargement de la commande : ${error.message}`);
  return (data as unknown as OrderWithPaymentProofs) ?? null;
}

export async function listMyOrdersWithPayments(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `id, reference, status, total, currency, created_at, payments:payments ( id, provider, payment_method, status, amount, currency, transaction_reference, customer_txn_id, proof_submitted_at, provider_payload, proof_files:payment_proof_files ( id, file_name, created_at ) )`,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Chargement des commandes : ${error.message}`);
  return (data ?? []) as unknown as {
    id: string;
    reference: string;
    status: OrderStatus;
    total: number;
    currency: string;
    created_at: string;
    payments: PaymentRow[];
  }[];
}

export async function listMyOrders(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id, reference, status, total, currency, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Chargement des commandes : ${error.message}`);
  return data ?? [];
}

export async function listMyServiceRequests(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("service_requests")
    .select(`id, reference, status, created_at, quoted_amount, currency, service:services ( name, slug )`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Chargement des demandes : ${error.message}`);
  return (data ?? []) as unknown as {
    id: string;
    reference: string;
    status: string;
    created_at: string;
    quoted_amount: number | null;
    currency: string;
    service: { name: string; slug: string } | null;
  }[];
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  processing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
  refunded: "Remboursée",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "En attente",
  authorized: "Autorisé",
  paid: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
  cancelled: "Annulé",
};

export const SERVICE_STATUS_LABELS: Record<string, string> = {
  submitted: "Reçue",
  in_review: "En cours d'analyse",
  quoted: "Devis envoyé",
  in_progress: "En création",
  delivered: "Livrée",
  completed: "Terminée",
  cancelled: "Annulée",
};
