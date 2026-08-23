import type { AdminListPageProps } from "@/lib/admin/page-types";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import {
  AdminTable,
  AdminTableElement,
  AdminTd,
  AdminTh,
  AdminTr,
  StatusBadge,
} from "@/components/admin/admin-table";
import { listAdminServiceRequests } from "@/features/admin/queries";
import {
  SERVICE_REQUEST_STATUS_LABELS,
  SERVICE_STATUS_TONE,
} from "@/lib/admin/labels";
import { formatDate, formatPrice } from "@/lib/utils";
import type { ServiceRequestStatus } from "@/types/database";

export default async function AdminRequestsPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const status = typeof params.statut === "string" ? params.statut : undefined;
  const requests = await listAdminServiceRequests(status);

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Demandes design"
        description="Briefs clients pour les services créatifs — devis, suivi et livraison."
      />

      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Référence</AdminTh>
              <AdminTh>Service</AdminTh>
              <AdminTh>Client</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Devis</AdminTh>
              <AdminTh />
            </tr>
          </thead>
          <tbody>
            {requests.map((row) => {
              const service = row.service as unknown as { name: string } | null;
              return (
                <AdminTr key={row.id}>
                  <AdminTd className="font-mono font-semibold">{row.reference}</AdminTd>
                  <AdminTd>{service?.name ?? "—"}</AdminTd>
                  <AdminTd>
                    <p>{row.contact_name}</p>
                    <p className="text-xs text-muted">{row.contact_email}</p>
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge
                      label={SERVICE_REQUEST_STATUS_LABELS[row.status as ServiceRequestStatus]}
                      tone={SERVICE_STATUS_TONE[row.status as ServiceRequestStatus]}
                    />
                  </AdminTd>
                  <AdminTd>
                    {row.quoted_amount != null
                      ? formatPrice(Number(row.quoted_amount), row.currency)
                      : "—"}
                  </AdminTd>
                  <AdminTd>
                    <Link
                      href={`/admin/demandes/${row.id}`}
                      className="font-semibold text-[color:var(--accent)] hover:underline"
                    >
                      Traiter →
                    </Link>
                  </AdminTd>
                </AdminTr>
              );
            })}
          </tbody>
        </AdminTableElement>
      </AdminTable>
    </>
  );
}
