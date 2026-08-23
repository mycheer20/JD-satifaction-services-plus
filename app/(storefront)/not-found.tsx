import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageTitle, SectionLabel } from "@/components/ui/badge";

export default function StorefrontNotFound() {
  return (
    <div className="page-container flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <Card padding="lg" tone="elevated" className="max-w-md">
        <SectionLabel>Erreur 404</SectionLabel>
        <PageTitle
          title="Page introuvable"
          description="Cette adresse n'existe pas ou le contenu a été déplacé."
          className="mb-8"
        />
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="primary">
            Retour à l&apos;accueil
          </ButtonLink>
          <ButtonLink href="/catalogue" variant="outline">
            Voir le catalogue
          </ButtonLink>
        </div>
        <p className="mt-6 text-sm text-muted">
          Besoin d&apos;aide ?{" "}
          <Link
            href="/services"
            className="font-semibold text-[color:var(--accent)] hover:underline"
          >
            Consultez nos services de design
          </Link>
        </p>
      </Card>
    </div>
  );
}
