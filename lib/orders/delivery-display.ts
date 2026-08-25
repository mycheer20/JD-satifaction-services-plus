import type { OrderDeliverySnapshot } from "@/features/delivery/types";

/** Affiche les lignes de livraison/retrait pour admin et confirmation commande. */
export function formatOrderDeliveryLines(snapshot: OrderDeliverySnapshot): string[] {
  if (snapshot.fulfillment_mode === "pickup") {
    const lines = ["Retrait en boutique"];
    if (snapshot.pickup_label) lines.push(snapshot.pickup_label);
    if (snapshot.pickup_address) lines.push(snapshot.pickup_address);
    return lines;
  }

  const lines: string[] = [];
  if (snapshot.country_name) lines.push(`Pays : ${snapshot.country_name}`);
  if (snapshot.department_name) lines.push(`Département : ${snapshot.department_name}`);
  if (snapshot.commune_name) lines.push(`Commune : ${snapshot.commune_name}`);
  if (snapshot.city_name) lines.push(`Ville : ${snapshot.city_name}`);
  if (snapshot.zone_name) lines.push(`Zone : ${snapshot.zone_name}`);
  if (snapshot.line1) lines.push(`Adresse : ${snapshot.line1}`);
  if (snapshot.landmark) lines.push(`Point de repère : ${snapshot.landmark}`);
  if (snapshot.delivery_phone) lines.push(`Tél. livraison : ${snapshot.delivery_phone}`);
  return lines;
}

export function parseOrderDeliverySnapshot(raw: unknown): OrderDeliverySnapshot {
  if (!raw || typeof raw !== "object") return { fulfillment_mode: "delivery" };
  const value = raw as Record<string, unknown>;

  if (value.fulfillment_mode === "pickup") {
    return {
      fulfillment_mode: "pickup",
      pickup_label: typeof value.pickup_label === "string" ? value.pickup_label : undefined,
      pickup_address:
        typeof value.pickup_address === "string" ? value.pickup_address : undefined,
    };
  }

  if (value.fulfillment_mode === "delivery" || value.zone_id || value.country_name) {
    return {
      fulfillment_mode: "delivery",
      country_id: typeof value.country_id === "string" ? value.country_id : undefined,
      country_name: typeof value.country_name === "string" ? value.country_name : undefined,
      department_id: typeof value.department_id === "string" ? value.department_id : undefined,
      department_name:
        typeof value.department_name === "string" ? value.department_name : undefined,
      commune_id: typeof value.commune_id === "string" ? value.commune_id : undefined,
      commune_name: typeof value.commune_name === "string" ? value.commune_name : undefined,
      city_id: typeof value.city_id === "string" ? value.city_id : undefined,
      city_name: typeof value.city_name === "string" ? value.city_name : undefined,
      zone_id: typeof value.zone_id === "string" ? value.zone_id : undefined,
      zone_name: typeof value.zone_name === "string" ? value.zone_name : undefined,
      delivery_fee_applied:
        typeof value.delivery_fee_applied === "number"
          ? value.delivery_fee_applied
          : undefined,
      currency: typeof value.currency === "string" ? value.currency : undefined,
      line1: typeof value.line1 === "string" ? value.line1 : undefined,
      landmark: typeof value.landmark === "string" ? value.landmark : undefined,
      delivery_phone:
        typeof value.delivery_phone === "string" ? value.delivery_phone : undefined,
    };
  }

  // Anciennes commandes (adresse libre avant zones dynamiques)
  const legacyCity = typeof value.city === "string" ? value.city : undefined;
  const legacyRegion = typeof value.region === "string" ? value.region : undefined;
  const legacyPostal = typeof value.postal_code === "string" ? value.postal_code : undefined;
  const lines: string[] = [];
  if (typeof value.line1 === "string") lines.push(`Adresse : ${value.line1}`);
  if (legacyCity) lines.push(`Ville : ${legacyCity}`);
  if (legacyRegion) lines.push(`Région : ${legacyRegion}`);
  if (legacyPostal) lines.push(`Code postal : ${legacyPostal}`);

  return {
    fulfillment_mode: "delivery",
    line1: typeof value.line1 === "string" ? value.line1 : undefined,
    city_name: legacyCity,
    department_name: legacyRegion,
  };
}
