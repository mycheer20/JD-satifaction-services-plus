/** Types et structures pour le système de livraison dynamique. */

export type FulfillmentMode = "delivery" | "pickup";

export interface DeliveryLocationOption {
  id: string;
  name: string;
}

export interface DeliveryZoneOption extends DeliveryLocationOption {
  delivery_fee: number;
  currency: string;
}

/** Snapshot enregistré dans orders.shipping_address à la commande. */
export interface OrderDeliverySnapshot {
  fulfillment_mode: FulfillmentMode;
  country_id?: string;
  country_name?: string;
  department_id?: string;
  department_name?: string;
  commune_id?: string;
  commune_name?: string;
  city_id?: string;
  city_name?: string;
  zone_id?: string;
  zone_name?: string;
  delivery_fee_applied?: number;
  currency?: string;
  line1?: string;
  landmark?: string;
  delivery_phone?: string;
  /** Retrait boutique — libellé et adresse figés au moment de la commande. */
  pickup_label?: string;
  pickup_address?: string;
}

export interface ValidatedDeliverySelection {
  mode: FulfillmentMode;
  shippingTotal: number;
  currency: string;
  zoneId: string | null;
  snapshot: OrderDeliverySnapshot;
}

export interface DeliveryZoneAdminRow {
  id: string;
  name: string;
  delivery_fee: number;
  currency: string;
  is_active: boolean;
  created_at: string;
  city_id: string;
  city_name: string;
  commune_id: string;
  commune_name: string;
  department_id: string;
  department_name: string;
  country_id: string;
  country_name: string;
}
