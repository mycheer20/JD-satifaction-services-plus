import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/features/auth/guards";
import {
  listMyServiceRequests,
  SERVICE_STATUS_LABELS,
} from "@/features/orders/queries";
import { Badge, EmptyState, PageTitle, SectionLabel } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceDisplay } from "@/components/storefront/price-display";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Mes demandes de design",
  robots: { index: false },
};

export default async function ServiceRequestsPage() {
  const user = await requireUser();
  const requests = await listMyServiceRequests(user.id);

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Services créatifs</SectionLabel>
        <PageTitle
          title="Mes demandes de design"
          description="Suivez l'avancement de vos briefs logo, affiches et visuels."
          className="mb-0"
        />
      </div>

      {requests.length === 0 ? (
        <EmptyState
          title="Aucune demande pour le moment"
          description="Découvrez nos services de création graphique et soumettez un brief."
          action={<ButtonLink href="/services">Voir les services</ButtonLink>}
        />
      ) : (
        <ul className="space-y-3">
          {requests.map((request) => (
            <li key={request.id}>
              <Link href={`/demande/${request.id}`} className="group block">
                <Card
                  padding="md"
                  className="transition group-hover:border-[color:var(--accent)]/40 group-hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[color:var(--color-foreground)] group-hover:text-[color:var(--accent)]">
                        {request.service?.name ?? "Service design"}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {request.reference} · {formatDate(request.created_at)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge tone="info">
                        {SERVICE_STATUS_LABELS[request.status] ?? request.status}
                      </Badge>
                      {request.quoted_amount != null ? (
                        <span className="text-sm font-bold text-[color:var(--accent)]">
                          <PriceDisplay
                            amount={request.quoted_amount}
                            currency={request.currency}
                            layout="stack"
                          />
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
