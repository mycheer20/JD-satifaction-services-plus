import { storeContact, storePhoneHref, storeWhatsAppHref } from "@/lib/store/contact";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function StoreContactActions({
  className,
  compact,
  whatsAppMessage,
  subject,
}: {
  className?: string;
  compact?: boolean;
  whatsAppMessage?: string;
  subject?: string;
}) {
  const defaultMessage =
    whatsAppMessage ??
    `Bonjour ${storeContact.name}, j'ai une question${subject ? ` concernant ${subject}` : ""}.`;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <ButtonLink
        href={storePhoneHref()}
        variant="outline"
        size={compact ? "sm" : "md"}
        className="gap-2"
      >
        <span aria-hidden>📞</span>
        Appeler
      </ButtonLink>
      <ButtonLink
        href={storeWhatsAppHref(defaultMessage)}
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
