import type { AdminDetailPageProps } from "@/lib/admin/page-types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminFlash } from "@/components/admin/admin-flash";
import { StatusBadge } from "@/components/admin/admin-table";
import { getAdminServiceRequest } from "@/features/admin/queries";
import {
  SERVICE_REQUEST_STATUS_LABELS,
  SERVICE_STATUS_TONE,
} from "@/lib/admin/labels";
import {
  deleteServiceRequest,
  updateServiceRequest,
} from "@/features/admin/actions/orders";
import { formatDate, formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FieldShell, Select, TextArea, TextInput } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { ServiceRequestStatus } from "@/types/database";
import { requireAdmin } from "@/features/auth/guards";

export default async function AdminRequestDetailPage({
  params,
  searchParams,
}: AdminDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const request = await getAdminServiceRequest(id);
  if (!request) notFound();

  const service = request.service as unknown as { name: string; slug: string } | null;
  const files = request.files ?? [];

  return (
    <>
      <AdminFlash searchParams={query} />
      <AdminPageHeader
        title={`Demande ${request.reference}`}
        description={service?.name ?? "Service design"}
        actions={
          <StatusBadge
            label={SERVICE_REQUEST_STATUS_LABELS[request.status as ServiceRequestStatus]}
            tone={SERVICE_STATUS_TONE[request.status as ServiceRequestStatus]}
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Card padding="md" className="space-y-4">
          <h2 className="font-bold">Contact</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted">Nom</dt>
              <dd className="font-semibold">{request.contact_name}</dd>
            </div>
            <div>
              <dt className="text-muted">E-mail</dt>
              <dd>{request.contact_email}</dd>
            </div>
            {request.contact_phone ? (
              <div>
                <dt className="text-muted">Téléphone</dt>
                <dd>{request.contact_phone}</dd>
              </div>
            ) : null}
          </dl>

          <h2 className="pt-4 font-bold">Réponses du brief</h2>
          <pre className="overflow-x-auto rounded-xl bg-[color:var(--color-surface-muted)] p-4 text-xs">
            {JSON.stringify(request.answers, null, 2)}
          </pre>

          {files.length > 0 ? (
            <>
              <h2 className="font-bold">Fichiers joints</h2>
              <ul className="space-y-2 text-sm">
                {files.map((file) => (
                  <li key={file.id}>
                    {file.file_name} ({file.field_key})
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </Card>

        <aside className="space-y-6">
          <Card padding="md" className="space-y-4">
            <h2 className="font-bold">Suivi</h2>
            <form action={updateServiceRequest} className="space-y-4">
              <input type="hidden" name="request_id" value={request.id} />
              <FieldShell label="Statut" htmlFor="status">
                <Select id="status" name="status" defaultValue={request.status}>
                  {Object.entries(SERVICE_REQUEST_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              </FieldShell>
              <FieldShell label="Montant devis" htmlFor="quoted_amount">
                <TextInput
                  id="quoted_amount"
                  name="quoted_amount"
                  type="number"
                  min={0}
                  defaultValue={request.quoted_amount ?? ""}
                />
              </FieldShell>
              <FieldShell label="Notes internes" htmlFor="admin_notes">
                <TextArea
                  id="admin_notes"
                  name="admin_notes"
                  defaultValue={request.admin_notes ?? ""}
                />
              </FieldShell>
              <Button type="submit" className="w-full">
                Enregistrer
              </Button>
            </form>
            {request.quoted_amount != null ? (
              <p className="text-sm">
                Devis :{" "}
                <strong>{formatPrice(Number(request.quoted_amount), request.currency)}</strong>
              </p>
            ) : null}
            <p className="text-xs text-muted">Reçue le {formatDate(request.created_at)}</p>
          </Card>

          <AdminDeleteForm requestId={request.id} />

          <Link href="/admin/demandes" className="block text-center text-sm font-semibold text-[color:var(--accent)]">
            ← Retour aux demandes
          </Link>
        </aside>
      </div>
    </>
  );
}

async function AdminDeleteForm({ requestId }: { requestId: string }) {
  const user = await requireAdmin();
  if (user.role !== "admin") return null;

  return (
    <form action={deleteServiceRequest}>
      <input type="hidden" name="request_id" value={requestId} />
      <Button type="submit" variant="danger" size="sm" className="w-full">
        Supprimer (admin)
      </Button>
    </form>
  );
}
