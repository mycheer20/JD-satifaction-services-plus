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
import { listUsers } from "@/features/admin/queries";
import { updateUserRole } from "@/features/admin/actions/catalog";
import { formatDate } from "@/lib/utils";
import { Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/types/database";

const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Client",
  staff: "Équipe",
  admin: "Administrateur",
};

export default async function AdminUsersPage({
  searchParams,
}: AdminListPageProps) {
  await requireAdmin();
  const params = await searchParams;
  const users = await listUsers();

  return (
    <>
      <AdminFlash searchParams={params} />
      <AdminPageHeader
        title="Utilisateurs"
        description="Comptes inscrits et rôles d'accès (client, équipe, administrateur)."
      />

      <AdminTable>
        <AdminTableElement>
          <thead>
            <tr>
              <AdminTh>Utilisateur</AdminTh>
              <AdminTh>Rôle</AdminTh>
              <AdminTh>Inscription</AdminTh>
              <AdminTh>Changer le rôle</AdminTh>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <AdminTr key={user.id}>
                <AdminTd>
                  <p className="font-semibold">{user.full_name ?? "—"}</p>
                  <p className="text-xs text-muted">{user.id}</p>
                </AdminTd>
                <AdminTd>
                  <Badge tone={user.role === "admin" ? "warning" : user.role === "staff" ? "info" : "neutral"}>
                    {ROLE_LABELS[user.role as UserRole]}
                  </Badge>
                </AdminTd>
                <AdminTd className="text-muted">{formatDate(user.created_at)}</AdminTd>
                <AdminTd>
                  <form action={updateUserRole} className="flex items-center gap-2">
                    <input type="hidden" name="user_id" value={user.id} />
                    <Select name="role" defaultValue={user.role} className="h-9 py-1 text-xs">
                      <option value="customer">Client</option>
                      <option value="staff">Équipe</option>
                      <option value="admin">Administrateur</option>
                    </Select>
                    <Button type="submit" size="sm" variant="soft">
                      OK
                    </Button>
                  </form>
                </AdminTd>
              </AdminTr>
            ))}
          </tbody>
        </AdminTableElement>
      </AdminTable>
    </>
  );
}
