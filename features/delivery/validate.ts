import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { pickupAddressLines, storeContact } from "@/lib/store/contact";
import type {
  FulfillmentMode,
  OrderDeliverySnapshot,
  ValidatedDeliverySelection,
} from "@/features/delivery/types";

export interface DeliveryCheckoutInput {
  fulfillmentMode: FulfillmentMode;
  countryId?: string;
  departmentId?: string;
  communeId?: string;
  cityId?: string;
  zoneId?: string;
  address?: string;
  landmark?: string;
  deliveryPhone?: string;
  note?: string;
}

interface ZoneChainRow {
  id: string;
  name: string;
  delivery_fee: number;
  currency: string;
  is_active: boolean;
  city_id: string;
  city: {
    id: string;
    name: string;
    is_active: boolean;
    commune_id: string;
    commune: {
      id: string;
      name: string;
      is_active: boolean;
      department_id: string;
      department: {
        id: string;
        name: string;
        is_active: boolean;
        country_id: string;
        country: { id: string; name: string; is_active: boolean };
      };
    };
  };
}

/**
 * Valide la sélection livraison/retrait et calcule le tarif côté serveur.
 * Ne jamais faire confiance à un montant envoyé par le navigateur.
 */
export async function validateDeliverySelection(
  input: DeliveryCheckoutInput,
): Promise<{ ok: true; data: ValidatedDeliverySelection } | { ok: false; message: string }> {
  if (input.fulfillmentMode === "pickup") {
    const lines = pickupAddressLines();
    const snapshot: OrderDeliverySnapshot = {
      fulfillment_mode: "pickup",
      pickup_label: storeContact.pickup.label,
      pickup_address: lines.join(", "),
    };
    return {
      ok: true,
      data: {
        mode: "pickup",
        shippingTotal: 0,
        currency: "HTG",
        zoneId: null,
        snapshot,
      },
    };
  }

  const { countryId, departmentId, communeId, cityId, zoneId, address } = input;

  if (!countryId || !departmentId || !communeId || !cityId || !zoneId) {
    return { ok: false, message: "Sélectionnez votre zone de livraison complète." };
  }

  if (!address?.trim() || address.trim().length < 5) {
    return { ok: false, message: "L'adresse exacte de livraison est requise." };
  }

  const supabase = createSupabaseAdminClient();
  const { data: zone, error } = await supabase
    .from("delivery_zones")
    .select(
      `
      id, name, delivery_fee, currency, is_active, city_id,
      city:delivery_cities!inner (
        id, name, is_active, commune_id,
        commune:delivery_communes!inner (
          id, name, is_active, department_id,
          department:delivery_departments!inner (
            id, name, is_active, country_id,
            country:delivery_countries!inner ( id, name, is_active )
          )
        )
      )
    `,
    )
    .eq("id", zoneId)
    .maybeSingle();

  if (error || !zone) {
    return { ok: false, message: "Zone de livraison introuvable." };
  }

  const row = zone as unknown as ZoneChainRow;

  if (!row.is_active) {
    return { ok: false, message: "Cette zone de livraison n'est plus disponible." };
  }

  const city = row.city;
  const commune = city.commune;
  const department = commune.department;
  const country = department.country;

  if (
    !city.is_active ||
    !commune.is_active ||
    !department.is_active ||
    !country.is_active
  ) {
    return { ok: false, message: "Cette localisation n'est plus disponible pour la livraison." };
  }

  if (
    city.id !== cityId ||
    commune.id !== communeId ||
    department.id !== departmentId ||
    country.id !== countryId ||
    row.city_id !== cityId
  ) {
    return { ok: false, message: "La zone ne correspond pas à la localisation sélectionnée." };
  }

  const fee = Number(row.delivery_fee);
  if (!Number.isFinite(fee) || fee < 0) {
    return { ok: false, message: "Tarif de livraison invalide." };
  }

  const snapshot: OrderDeliverySnapshot = {
    fulfillment_mode: "delivery",
    country_id: country.id,
    country_name: country.name,
    department_id: department.id,
    department_name: department.name,
    commune_id: commune.id,
    commune_name: commune.name,
    city_id: city.id,
    city_name: city.name,
    zone_id: row.id,
    zone_name: row.name,
    delivery_fee_applied: fee,
    currency: row.currency,
    line1: address.trim(),
    landmark: input.landmark?.trim() || undefined,
    delivery_phone: input.deliveryPhone?.trim() || undefined,
  };

  return {
    ok: true,
    data: {
      mode: "delivery",
      shippingTotal: fee,
      currency: row.currency,
      zoneId: row.id,
      snapshot,
    },
  };
}
