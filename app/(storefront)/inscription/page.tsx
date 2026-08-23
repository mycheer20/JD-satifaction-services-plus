import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";
import { SignUpForm } from "@/components/auth/auth-forms";
import { PageTitle, SectionLabel } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Créer un compte",
  robots: { index: false },
};

export default async function SignUpPage() {
  if (await getSessionUser()) redirect("/compte");

  return (
    <div className="page-container flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <SectionLabel>Nouveau client</SectionLabel>
      <PageTitle
        title="Créer un compte"
        description="Suivez vos commandes et retrouvez vos briefs de design."
        className="mb-6"
      />
      <SignUpForm />
    </div>
  );
}
