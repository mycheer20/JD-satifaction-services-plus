import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  DeliveryLocationOption,
  DeliveryZoneOption,
  DeliveryZoneAdminRow,
} from "@/features/delivery/types";

export async function listActiveCountries(): Promise<DeliveryLocationOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("delivery_countries")
    .select("id, name")
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}

export async function listActiveDepartments(
  countryId: string,
): Promise<DeliveryLocationOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("delivery_departments")
    .select("id, name")
    .eq("country_id", countryId)
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}

export async function listActiveCommunes(
  departmentId: string,
): Promise<DeliveryLocationOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("delivery_communes")
    .select("id, name")
    .eq("department_id", departmentId)
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}

export async function listActiveCities(communeId: string): Promise<DeliveryLocationOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("delivery_cities")
    .select("id, name")
    .eq("commune_id", communeId)
    .eq("is_active", true)
    .order("name");
  return data ?? [];
}

export async function listActiveZones(cityId: string): Promise<DeliveryZoneOption[]> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("delivery_zones")
    .select("id, name, delivery_fee, currency")
    .eq("city_id", cityId)
    .eq("is_active", true)
    .order("name");
  return (data ?? []) as DeliveryZoneOption[];
}

export async function listAdminDeliveryZones(filters?: {
  search?: string;
  activeOnly?: boolean;
}): Promise<DeliveryZoneAdminRow[]> {
  const supabase = await createSupabaseServerClient();
  let query = supabase
    .from("delivery_zones")
    .select(
      `
      id, name, delivery_fee, currency, is_active, created_at, city_id,
      city:delivery_cities!inner (
        id, name, commune_id,
        commune:delivery_communes!inner (
          id, name, department_id,
          department:delivery_departments!inner (
            id, name, country_id,
            country:delivery_countries!inner ( id, name )
          )
        )
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (filters?.activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw new Error(`Zones livraison : ${error.message}`);

  const rows = (data ?? []) as Array<Record<string, unknown>>;

  return rows
    .map((row) => {
      const city = row.city as Record<string, unknown>;
      const commune = city.commune as Record<string, unknown>;
      const department = commune.department as Record<string, unknown>;
      const country = department.country as Record<string, unknown>;
      const zone: DeliveryZoneAdminRow = {
        id: String(row.id),
        name: String(row.name),
        delivery_fee: Number(row.delivery_fee),
        currency: String(row.currency),
        is_active: Boolean(row.is_active),
        created_at: String(row.created_at),
        city_id: String(city.id),
        city_name: String(city.name),
        commune_id: String(commune.id),
        commune_name: String(commune.name),
        department_id: String(department.id),
        department_name: String(department.name),
        country_id: String(country.id),
        country_name: String(country.name),
      };
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        const haystack = [
          zone.name,
          zone.city_name,
          zone.commune_name,
          zone.department_name,
          zone.country_name,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return null;
      }
      return zone;
    })
    .filter((row): row is DeliveryZoneAdminRow => row !== null);
}

export async function getDeliveryZoneForAdmin(id: string) {
  const zones = await listAdminDeliveryZones();
  return zones.find((z) => z.id === id) ?? null;
}

export async function listCountriesForAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("delivery_countries").select("*").order("name");
  return data ?? [];
}

export async function listDepartmentsForAdmin(countryId?: string) {
  const supabase = await createSupabaseServerClient();
  let q = supabase.from("delivery_departments").select("*").order("name");
  if (countryId) q = q.eq("country_id", countryId);
  const { data } = await q;
  return data ?? [];
}

export async function listCommunesForAdmin(departmentId?: string) {
  const supabase = await createSupabaseServerClient();
  let q = supabase.from("delivery_communes").select("*").order("name");
  if (departmentId) q = q.eq("department_id", departmentId);
  const { data } = await q;
  return data ?? [];
}

export async function listCitiesForAdmin(communeId?: string) {
  const supabase = await createSupabaseServerClient();
  let q = supabase.from("delivery_cities").select("*").order("name");
  if (communeId) q = q.eq("commune_id", communeId);
  const { data } = await q;
  return data ?? [];
}
