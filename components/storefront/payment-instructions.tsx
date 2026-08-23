import type { PaymentInstructions } from "@/features/payments/instructions";
import { StoreContactActions } from "@/components/storefront/store-contact-actions";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PaymentInstructionsPanel({
  instructions,
  className,
  showContact = true,
}: {
  instructions: PaymentInstructions;
  className?: string;
  showContact?: boolean;
}) {
  return (
    <Card padding="md" className={cn("space-y-4", className)}>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--accent)]">
          {instructions.title}
        </p>
        <p className="mt-1 text-sm text-muted">{instructions.summary}</p>
      </div>

      {instructions.whatsAppRequired && showContact ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          <p className="font-semibold">Accord WhatsApp requis</p>
          <p className="mt-1 text-xs leading-relaxed opacity-90">
            Pour le virement bancaire, contactez-nous sur WhatsApp avant d&apos;envoyer
            l&apos;argent. Nous confirmons la commande et le montant avec vous.
          </p>
          <StoreContactActions
            className="mt-3"
            subject={`commande ${instructions.reference}`}
            whatsAppMessage={`Bonjour, je souhaite confirmer ma commande ${instructions.reference} (${instructions.amountLabel}) avant virement bancaire.`}
          />
        </div>
      ) : null}

      <dl className="grid gap-2 rounded-xl bg-[color:var(--color-surface-muted)]/80 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Référence</dt>
          <dd className="font-mono font-bold text-[color:var(--color-foreground)]">
            {instructions.reference}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Montant</dt>
          <dd className="font-bold text-[color:var(--accent)]">{instructions.amountLabel}</dd>
        </div>
      </dl>

      <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-slate-700">
        {instructions.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      {instructions.pickup ? (
        <div className="space-y-3 rounded-xl border border-[color:var(--color-border)] p-4">
          <p className="text-sm font-bold">{instructions.pickup.label}</p>
          <address className="text-sm not-italic leading-relaxed text-slate-600">
            {instructions.pickup.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="text-xs text-muted">{instructions.pickup.hours}</p>
          <ButtonLink
            href={instructions.pickup.mapsUrl}
            variant="outline"
            size="sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ouvrir dans Google Maps →
          </ButtonLink>
        </div>
      ) : null}

      {instructions.transfer ? (
        <div className="space-y-1 rounded-xl border border-[color:var(--color-border)] p-4 text-sm">
          <p>
            <span className="text-muted">Banque :</span>{" "}
            <strong>{instructions.transfer.bankName}</strong>
          </p>
          <p>
            <span className="text-muted">Titulaire :</span>{" "}
            <strong>{instructions.transfer.accountName}</strong>
          </p>
          <p>
            <span className="text-muted">Compte :</span>{" "}
            <strong className="font-mono">{instructions.transfer.accountNumber}</strong>
          </p>
        </div>
      ) : null}

      {instructions.mobileMoney ? (
        <div className="rounded-xl border border-[color:var(--color-border)] p-4 text-sm">
          <p className="font-bold">{instructions.mobileMoney.provider}</p>
          <p className="mt-1">
            {instructions.mobileMoney.walletName} —{" "}
            <span className="font-mono font-bold">{instructions.mobileMoney.walletNumber}</span>
          </p>
        </div>
      ) : null}

      {showContact ? (
        <StoreContactActions
          subject={`ma commande ${instructions.reference}`}
          whatsAppMessage={`Bonjour, voici la preuve de paiement pour la commande ${instructions.reference} (${instructions.amountLabel}).`}
        />
      ) : null}
    </Card>
  );
}
