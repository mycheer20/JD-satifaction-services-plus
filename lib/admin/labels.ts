import type {
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  ReviewStatus,
  ServiceRequestStatus,
} from "@/types/database";

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  draft: "Brouillon",
  active: "Actif",
  archived: "Archivé",
};

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Refusé",
};

export const SERVICE_REQUEST_STATUS_LABELS: Record<ServiceRequestStatus, string> = {
  submitted: "Reçue",
  in_review: "En analyse",
  quoted: "Devis envoyé",
  in_progress: "En création",
  delivered: "Livrée",
  completed: "Terminée",
  cancelled: "Annulée",
};

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

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

export const PRODUCT_STATUS_TONE: Record<ProductStatus, StatusTone> = {
  draft: "neutral",
  active: "success",
  archived: "warning",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, StatusTone> = {
  pending: "warning",
  confirmed: "info",
  processing: "accent",
  shipped: "info",
  delivered: "success",
  cancelled: "neutral",
  refunded: "danger",
};

export const PAYMENT_STATUS_TONE: Record<PaymentStatus, StatusTone> = {
  pending: "warning",
  authorized: "info",
  paid: "success",
  failed: "danger",
  refunded: "neutral",
  cancelled: "neutral",
};

export const REVIEW_STATUS_TONE: Record<ReviewStatus, StatusTone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export const SERVICE_STATUS_TONE: Record<ServiceRequestStatus, StatusTone> = {
  submitted: "warning",
  in_review: "info",
  quoted: "accent",
  in_progress: "accent",
  delivered: "info",
  completed: "success",
  cancelled: "neutral",
};
