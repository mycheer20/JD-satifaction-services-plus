import type { AdminListPageProps } from "@/lib/admin/page-types";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import {
  listCitiesForAdmin,
  listCommunesForAdmin,
  listCountriesForAdmin,
  listDepartmentsForAdmin,
} from "@/features/delivery/queries";
import {
  saveDeliveryCity,
  saveDeliveryCommune,
  saveDeliveryCountry,
  saveDeliveryDepartment,
  toggleGeoActive,
} from "@/features/admin/actions/delivery";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField, Select, TextInput } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";

export default async function AdminDeliveryLocationsPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const [countries, departments, communes, cities] = await Promise.all([
    listCountriesForAdmin(),
    listDepartmentsForAdmin(),
    listCommunesForAdmin(),
    listCitiesForAdmin(),
  ]);

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Localisations"
        description="Hiérarchie Pays → Département → Commune → Ville. Aucune donnée codée en dur — tout est administré ici."
      />

      <div className="grid gap-8 xl:grid-cols-2">
        <GeoPanel
          title="Pays"
          table="delivery_countries"
          rows={countries.map((c) => ({ id: c.id, name: c.name, is_active: c.is_active }))}
          saveAction={saveDeliveryCountry}
          fields={[]}
        />

        <GeoPanel
          title="Départements"
          table="delivery_departments"
          rows={departments.map((d) => ({
            id: d.id,
            name: d.name,
            is_active: d.is_active,
            parent: countries.find((c) => c.id === d.country_id)?.name,
          }))}
          saveAction={saveDeliveryDepartment}
          fields={[
            {
              name: "country_id",
              label: "Pays",
              options: countries.map((c) => ({ value: c.id, label: c.name })),
            },
          ]}
        />

        <GeoPanel
          title="Communes"
          table="delivery_communes"
          rows={communes.map((c) => ({
            id: c.id,
            name: c.name,
            is_active: c.is_active,
            parent: departments.find((d) => d.id === c.department_id)?.name,
          }))}
          saveAction={saveDeliveryCommune}
          fields={[
            {
              name: "department_id",
              label: "Département",
              options: departments.map((d) => ({ value: d.id, label: d.name })),
            },
          ]}
        />

        <GeoPanel
          title="Villes"
          table="delivery_cities"
          rows={cities.map((c) => ({
            id: c.id,
            name: c.name,
            is_active: c.is_active,
            parent: communes.find((m) => m.id === c.commune_id)?.name,
          }))}
          saveAction={saveDeliveryCity}
          fields={[
            {
              name: "commune_id",
              label: "Commune",
              options: communes.map((m) => ({ value: m.id, label: m.name })),
            },
          ]}
        />
      </div>
    </>
  );
}

function GeoPanel({
  title,
  table,
  rows,
  saveAction,
  fields,
}: {
  title: string;
  table: string;
  rows: Array<{ id: string; name: string; is_active: boolean; parent?: string }>;
  saveAction: (formData: FormData) => Promise<void>;
  fields: Array<{
    name: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
}) {
  return (
    <Card padding="md" className="space-y-4">
      <h2 className="font-bold">{title}</h2>

      <form action={saveAction} className="space-y-3 rounded-xl border border-[color:var(--color-border)] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">Ajouter</p>
        {fields.map((field) => (
          <FormField key={field.name} label={field.label} htmlFor={field.name} required>
            <Select id={field.name} name={field.name} required defaultValue="">
              <option value="">Sélectionner…</option>
              {field.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </FormField>
        ))}
        <FormField label="Nom" htmlFor={`${table}-name`} required>
          <TextInput id={`${table}-name`} name="name" required />
        </FormField>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked className="size-4" />
          Actif
        </label>
        <Button type="submit" size="sm">
          Ajouter
        </Button>
      </form>

      <ul className="divide-y divide-[color:var(--color-border)] text-sm">
        {rows.length === 0 ? (
          <li className="py-4 text-muted">Aucune entrée.</li>
        ) : (
          rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">{row.name}</p>
                {row.parent ? <p className="text-xs text-muted">{row.parent}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={row.is_active ? "success" : "neutral"}>
                  {row.is_active ? "Actif" : "Inactif"}
                </Badge>
                <form action={toggleGeoActive}>
                  <input type="hidden" name="table" value={table} />
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="is_active" value={row.is_active ? "0" : "1"} />
                  <Button type="submit" variant="ghost" size="sm">
                    {row.is_active ? "Off" : "On"}
                  </Button>
                </form>
              </div>
            </li>
          ))
        )}
      </ul>
    </Card>
  );
}
