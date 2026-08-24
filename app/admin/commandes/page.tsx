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
import { listAdminOrders } from "@/features/admin/queries";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/admin/labels";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types/database";

export default async function AdminOrdersPage({
  searchParams,
}: AdminListPageProps) {
  const params = await searchParams;
  const status = typeof params.statut === "string" ? params.statut : undefined;
  const orders = await listAdminOrders(status);

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Commandes"
        description="Suivez et traitez toutes les commandes clients — statuts, paiements et notes."
      />

      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Référence</AdminTh>
              <AdminTh>Client</AdminTh>
              <AdminTh>Statut</AdminTh>
              <AdminTh>Total</AdminTh>
              <AdminTh>Date</AdminTh>
              <AdminTh />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <AdminTr>
                <AdminTd className="py-8 text-center text-muted" colSpan={6}>
                  Aucune commande pour le moment.
                </AdminTd>
              </AdminTr>
            ) : (
              orders.map((order) => (
                <AdminTr key={order.id}>
                  <AdminTd className="font-mono font-semibold">{order.reference}</AdminTd>
                  <AdminTd>
                    <p>{order.customer_name}</p>
                    <p className="text-xs text-muted">{order.customer_email}</p>
                    {order.customer_phone ? (
                      <p className="text-xs text-muted">{order.customer_phone}</p>
                    ) : null}
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge
                      label={ORDER_STATUS_LABELS[order.status as OrderStatus]}
                      tone={ORDER_STATUS_TONE[order.status as OrderStatus]}
                    />
                  </AdminTd>
                  <AdminTd>{formatPrice(Number(order.total))}</AdminTd>
                  <AdminTd className="text-muted">{formatDate(order.created_at)}</AdminTd>
                  <AdminTd>
                    <Link
                      href={`/admin/commandes/${order.id}`}
                      className="font-semibold text-[color:var(--accent)] hover:underline"
                    >
                      Détail →
                    </Link>
                  </AdminTd>
                </AdminTr>
              ))
            )}
          </tbody>
        </AdminTableElement>
      </AdminTable>
    </>
  );
}
