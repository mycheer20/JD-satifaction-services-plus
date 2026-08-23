import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";
import { SignInForm } from "@/components/auth/auth-forms";
import { PageTitle, SectionLabel } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false },
};

export default async function SignInPage({ searchParams }: PageProps<"/connexion">) {
  const user = await getSessionUser();
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;

  if (user) redirect(next && next.startsWith("/") ? next : "/compte");

  return (
    <div className="page-container flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <SectionLabel>Espace client</SectionLabel>
      <PageTitle
        title="Connexion"
        description="Accédez à vos commandes et à vos demandes de design."
        className="mb-6"
      />
      <SignInForm next={next} />
    </div>
  );
}
