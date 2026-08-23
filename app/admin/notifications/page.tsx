import type { AdminListPageProps } from "@/lib/admin/page-types";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { listAdminNotifications } from "@/features/admin/queries";
import {
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "@/features/admin/actions/notifications";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export default async function AdminNotificationsPage({
  searchParams,
}: AdminListPageProps) {
  const notifications = await listAdminNotifications();
  const unread = notifications.filter((n) => !n.read_at).length;

  return (
    <>
      <AdminPageHeader
        title="Notifications"
        description="Alertes boutique — preuves de paiement MonCash/NatCash et autres événements."
        actions={
          unread > 0 ? (
            <form action={markAllAdminNotificationsRead}>
              <Button type="submit" variant="outline" size="sm">
                Tout marquer comme lu
              </Button>
            </form>
          ) : null
        }
      />

      {notifications.length === 0 ? (
        <Card padding="md" className="text-sm text-muted">
          Aucune notification pour le moment.
        </Card>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => {
            const isUnread = !notification.read_at;
            const payload = notification.payload as Record<string, unknown> | null;
            const txnId =
              typeof payload?.customer_txn_id === "string"
                ? payload.customer_txn_id
                : null;

            return (
              <li key={notification.id}>
                <Card
                  padding="md"
                  className={
                    isUnread
                      ? "border-2 border-[color:var(--accent)]/40 bg-[color:var(--accent-soft)]/30"
                      : undefined
                  }
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-[color:var(--color-foreground)]">
                          {notification.title}
                        </p>
                        {isUnread ? <Badge tone="warning">Nouveau</Badge> : null}
                      </div>
                      <p className="mt-1 text-sm text-muted">{notification.message}</p>
                      {txnId ? (
                        <p className="mt-2 font-mono text-sm">
                          TXN : <strong>{txnId}</strong>
                        </p>
                      ) : null}
                      <p className="mt-2 text-xs text-muted">
                        {formatDate(notification.created_at)}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <Link
                        href={notification.link_href}
                        className="rounded-xl bg-[color:var(--accent)] px-4 py-2 text-center text-sm font-semibold text-[color:var(--accent-foreground)] hover:brightness-110"
                      >
                        Voir la commande
                      </Link>
                      {isUnread ? (
                        <form action={markAdminNotificationRead}>
                          <input type="hidden" name="notification_id" value={notification.id} />
                          <input type="hidden" name="return_to" value="/admin/notifications" />
                          <Button type="submit" variant="ghost" size="sm" className="w-full">
                            Marquer lu
                          </Button>
                        </form>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
