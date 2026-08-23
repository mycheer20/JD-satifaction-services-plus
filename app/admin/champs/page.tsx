import type { AdminListPageProps } from "@/lib/admin/page-types";
import { requireAdmin } from "@/features/auth/guards";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import {
  AdminTable,
  AdminTableElement,
  AdminTd,
  AdminTh,
  AdminTr,
} from "@/components/admin/admin-table";
import { listFieldSets, getFieldSetWithDefinitions } from "@/features/admin/queries";
import { Card } from "@/components/ui/card";

export default async function AdminFieldSetsPage({
  searchParams,
}: AdminListPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const fieldSets = await listFieldSets();

  const detailed = await Promise.all(
    fieldSets.map(async (set) => {
      const full = await getFieldSetWithDefinitions(set.id);
      return full;
    }),
  );

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Jeux de champs"
        description="Définitions des caractéristiques produits (RAM, année, stockage…). Modifiables via les seeds SQL ou Supabase."
      />

      <div className="space-y-6">
        {detailed.map((set) =>
          set ? (
            <Card key={set.id} padding="md" className="space-y-4">
              <div>
                <h2 className="text-lg font-bold">{set.name}</h2>
                <p className="text-sm text-muted">
                  Clé <code className="rounded bg-slate-100 px-1">{set.key}</code>
                  {set.description ? ` — ${set.description}` : ""}
                </p>
              </div>
              <AdminTable>
                <AdminTableElement>
                  <thead>
                    <tr>
                      <AdminTh>Clé</AdminTh>
                      <AdminTh>Label</AdminTh>
                      <AdminTh>Type</AdminTh>
                      <AdminTh>Filtre</AdminTh>
                      <AdminTh>Fiche</AdminTh>
                    </tr>
                  </thead>
                  <tbody>
                    {(set.definitions ?? []).map(
                      (def: {
                        id: string;
                        key: string;
                        label: string;
                        type: string;
                        is_filterable: boolean;
                        is_key_spec: boolean;
                      }) => (
                        <AdminTr key={def.id}>
                          <AdminTd className="font-mono text-xs">{def.key}</AdminTd>
                          <AdminTd>{def.label}</AdminTd>
                          <AdminTd className="text-muted">{def.type}</AdminTd>
                          <AdminTd>{def.is_filterable ? "Oui" : "—"}</AdminTd>
                          <AdminTd>{def.is_key_spec ? "Oui" : "—"}</AdminTd>
                        </AdminTr>
                      ),
                    )}
                  </tbody>
                </AdminTableElement>
              </AdminTable>
            </Card>
          ) : null,
        )}
      </div>
    </>
  );
}
