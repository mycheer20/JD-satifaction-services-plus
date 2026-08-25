"use client";

import { useEffect, useState } from "react";
import type { DeliveryLocationOption } from "@/features/delivery/types";
import { FormField, Select, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { saveDeliveryZone } from "@/features/admin/actions/delivery";

async function fetchOptions(type: string, parentId?: string): Promise<DeliveryLocationOption[]> {
  const params = new URLSearchParams({ type });
  if (parentId) params.set("parentId", parentId);
  const res = await fetch(`/api/admin/delivery/locations?${params}`);
  if (!res.ok) return [];
  const data = (await res.json()) as Array<{ id: string; name: string; is_active?: boolean }>;
  return data.map((row) => ({ id: row.id, name: row.name }));
}

/** Admin peut voir toutes les localisations via endpoints staff — utilise API publique active seulement en checkout; ici on charge via pages server props instead */

export function DeliveryZoneForm({
  zone,
  countries,
  departments,
  communes,
  cities,
}: {
  zone?: {
    id: string;
    name: string;
    delivery_fee: number;
    currency: string;
    is_active: boolean;
    city_id: string;
    department_id: string;
    commune_id: string;
    country_id: string;
  };
  countries: DeliveryLocationOption[];
  departments: DeliveryLocationOption[];
  communes: DeliveryLocationOption[];
  cities: DeliveryLocationOption[];
}) {
  const [countryId, setCountryId] = useState(zone?.country_id ?? "");
  const [departmentId, setDepartmentId] = useState(zone?.department_id ?? "");
  const [communeId, setCommuneId] = useState(zone?.commune_id ?? "");
  const [cityId, setCityId] = useState(zone?.city_id ?? "");
  const [deptList, setDeptList] = useState(departments);
  const [communeList, setCommuneList] = useState(communes);
  const [cityList, setCityList] = useState(cities);

  useEffect(() => {
    if (!zone) return;
    setDeptList(departments);
    setCommuneList(communes);
    setCityList(cities);
  }, [zone, departments, communes, cities]);

  return (
    <Card padding="md" className="max-w-xl space-y-4">
      <form action={saveDeliveryZone} className="space-y-4">
        {zone ? <input type="hidden" name="id" value={zone.id} /> : null}

        <FormField label="Pays" htmlFor="country" required>
          <Select
            id="country"
            required
            value={countryId}
            onChange={async (e) => {
              const id = e.target.value;
              setCountryId(id);
              setDepartmentId("");
              setCommuneId("");
              setCityId("");
              setDeptList(id ? await fetchOptions("departments", id) : []);
              setCommuneList([]);
              setCityList([]);
            }}
          >
            <option value="">Sélectionner…</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Département" htmlFor="department" required>
          <Select
            id="department"
            required
            value={departmentId}
            disabled={!countryId}
            onChange={async (e) => {
              const id = e.target.value;
              setDepartmentId(id);
              setCommuneId("");
              setCityId("");
              setCommuneList(id ? await fetchOptions("communes", id) : []);
              setCityList([]);
            }}
          >
            <option value="">Sélectionner…</option>
            {deptList.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Commune" htmlFor="commune" required>
          <Select
            id="commune"
            required
            value={communeId}
            disabled={!departmentId}
            onChange={async (e) => {
              const id = e.target.value;
              setCommuneId(id);
              setCityId("");
              setCityList(id ? await fetchOptions("cities", id) : []);
            }}
          >
            <option value="">Sélectionner…</option>
            {communeList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Ville" htmlFor="city_id" required>
          <Select
            id="city_id"
            name="city_id"
            required
            value={cityId}
            disabled={!communeId}
            onChange={(e) => setCityId(e.target.value)}
          >
            <option value="">Sélectionner…</option>
            {cityList.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Nom de la zone" htmlFor="name" required>
          <TextInput id="name" name="name" required defaultValue={zone?.name ?? ""} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField label="Tarif de livraison" htmlFor="delivery_fee" required>
            <TextInput
              id="delivery_fee"
              name="delivery_fee"
              type="number"
              min={0}
              step={1}
              required
              defaultValue={zone?.delivery_fee ?? 0}
            />
          </FormField>
          <FormField label="Devise" htmlFor="currency" required>
            <TextInput id="currency" name="currency" required defaultValue={zone?.currency ?? "HTG"} />
          </FormField>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={zone?.is_active ?? true}
            className="size-4"
          />
          Zone active (visible au checkout)
        </label>

        <Button type="submit">{zone ? "Enregistrer" : "Créer la zone"}</Button>
      </form>
    </Card>
  );
}
