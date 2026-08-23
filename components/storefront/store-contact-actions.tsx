import {
  getStoreContactSnapshot,
  storeContact,
  storePhoneHref,
  storeWhatsAppHref,
  type StoreContactSnapshot,
} from "@/lib/store/contact";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StoreContactActions({
  className,
  compact,
  whatsAppMessage,
  subject,
  contact,
}: {
  className?: string;
  compact?: boolean;
  whatsAppMessage?: string;
  subject?: string;
  /** Obligatoire dans les Client Components (vars lues côté serveur au runtime). */
  contact?: StoreContactSnapshot;
}) {
  const info = contact ?? getStoreContactSnapshot();
  const defaultMessage =
    whatsAppMessage ??
    `Bonjour ${info.name}, j'ai une question${subject ? ` concernant ${subject}` : ""}.`;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <ButtonLink
        href={storePhoneHref(info)}
        variant="outline"
        size={compact ? "sm" : "md"}
        className="gap-2"
      >
        <span aria-hidden>📞</span>
        Appeler
      </ButtonLink>
      <ButtonLink
        href={storeWhatsAppHref(defaultMessage, info)}
        variant="soft"
        size={compact ? "sm" : "md"}
        className="gap-2"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span aria-hidden>💬</span>
        WhatsApp
      </ButtonLink>
    </div>
  );
}

export function StoreContactBar({
  subject,
  className,
}: {
  subject?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]/60 p-4",
        className,
      )}
    >
      <p className="text-sm font-bold text-[color:var(--color-foreground)]">
        Besoin d&apos;aide ? Contactez {storeContact.name}
      </p>
      <p className="mt-1 text-sm text-muted">{storeContact.phone}</p>
      <StoreContactActions className="mt-3" subject={subject} compact />
    </div>
  );
}
