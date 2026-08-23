import { requireUser } from "@/features/auth/guards";
import { signOut } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/badge";
import { AccountNav } from "@/components/storefront/account-nav";

export default async function AccountLayout({ children }: LayoutProps<"/compte">) {
  const user = await requireUser("/connexion?next=/compte");

  return (
    <div className="page-container py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[color:var(--color-border)] pb-6">
        <PageTitle title="Mon compte" description={user.email ?? undefined} className="mb-0" />
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Se déconnecter
          </Button>
        </form>
      </header>

      <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
        <AccountNav />

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
