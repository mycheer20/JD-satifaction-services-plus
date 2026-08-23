import {
  AdminTable,
  AdminTableElement,
  AdminTd,
  AdminTh,
  AdminTr,
} from "@/components/admin/admin-table";
import { FieldShell, TextInput, Select, CheckboxField } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Row = {
  id?: string;
  name: string;
  slug: string;
  position: number;
  is_active: boolean;
  meta?: string;
};

export function TaxonomyTable({
  rows,
  saveAction,
  parentField,
  secondaryField,
}: {
  rows: Row[];
  saveAction: (formData: FormData) => void | Promise<void>;
  parentField?: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  };
  secondaryField?: {
    name: string;
    label: string;
    options: { value: string; label: string }[];
  };
  extraFields?: never;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Nom</AdminTh>
              <AdminTh>Slug</AdminTh>
              {rows.some((r) => r.meta) ? <AdminTh>Contexte</AdminTh> : null}
              <AdminTh>Pos.</AdminTh>
              <AdminTh>Actif</AdminTh>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <AdminTr key={row.id ?? row.slug}>
                <AdminTd className="font-semibold">{row.name}</AdminTd>
                <AdminTd className="text-muted">{row.slug}</AdminTd>
                {rows.some((r) => r.meta) ? (
                  <AdminTd className="text-xs text-muted">{row.meta ?? "—"}</AdminTd>
                ) : null}
                <AdminTd>{row.position}</AdminTd>
                <AdminTd>{row.is_active ? "Oui" : "Non"}</AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </AdminTableElement>
      </AdminTable>

      <Card padding="md">
        <h2 className="mb-4 text-base font-bold">Ajouter / modifier</h2>
        <form action={saveAction} className="space-y-3">
          <FieldShell label="ID (modifier)" htmlFor="tax-id" hint="Laisser vide pour créer">
            <TextInput id="tax-id" name="id" />
          </FieldShell>
          {parentField ? (
            <FieldShell label={parentField.label} htmlFor="tax-parent" required>
              <Select id="tax-parent" name={parentField.name} required defaultValue="">
                <option value="">Choisir…</option>
                {parentField.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FieldShell>
          ) : null}
          {secondaryField ? (
            <FieldShell label={secondaryField.label} htmlFor="tax-secondary">
              <Select id="tax-secondary" name={secondaryField.name} defaultValue="">
                {secondaryField.options.map((o) => (
                  <option key={o.value || "none"} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </FieldShell>
          ) : null}
          <FieldShell label="Nom" htmlFor="tax-name" required>
            <TextInput id="tax-name" name="name" required />
          </FieldShell>
          <FieldShell label="Slug" htmlFor="tax-slug">
            <TextInput id="tax-slug" name="slug" placeholder="auto" />
          </FieldShell>
          <FieldShell label="Position" htmlFor="tax-position">
            <TextInput id="tax-position" name="position" type="number" defaultValue={0} />
          </FieldShell>
          <CheckboxField name="is_active" label="Actif" defaultChecked />
          <Button type="submit" className="w-full">
            Enregistrer
          </Button>
        </form>
      </Card>
    </div>
  );
}
