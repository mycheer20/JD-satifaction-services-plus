import type { AdminLayoutProps } from "@/lib/admin/page-types";
import type { Metadata } from "next";
import { requireStaff } from "@/features/auth/guards";
import { getAdminBadgeCounts } from "@/features/admin/queries";
import { filterAdminNav } from "@/lib/admin/nav";
import { AdminShell } from "@/components/admin/admin-shell";
import { signOut } from "@/features/auth/actions";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await requireStaff();
  const badges = await getAdminBadgeCounts();
  const sections = filterAdminNav(user.role, badges);

  return (
    <div data-admin="true">
      <AdminShell user={user} sections={sections}>
        {children}
      </AdminShell>
      <form id="admin-signout" action={signOut} className="hidden" />
    </div>
  );
}
