import type { Metadata } from "next";
import { PasswordResetForm } from "@/components/auth/auth-forms";
import { PageTitle, SectionLabel } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <div className="page-container flex min-h-[70vh] max-w-md flex-col justify-center py-16">
      <SectionLabel>Récupération</SectionLabel>
      <PageTitle
        title="Mot de passe oublié"
        description="Indiquez votre adresse e-mail, nous vous enverrons un lien de réinitialisation."
        className="mb-6"
      />
      <PasswordResetForm />
    </div>
  );
}
