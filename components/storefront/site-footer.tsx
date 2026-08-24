import Link from "next/link";
import { getFamilyTree } from "@/features/catalog/queries";
import { publicEnv, storeLogoInitial } from "@/lib/public-env";
import { storeContact, storePhoneHref, storeWhatsAppHref } from "@/lib/store/contact";
import { getFamilyVisual, isFamilySlug } from "@/lib/theme/families";
import { ButtonLink } from "@/components/ui/button";
import { TextLink } from "@/components/ui/link";

export async function SiteFooter() {
  const families = await getFamilyTree();

  return (
    <footer className="mt-24 border-t border-[color:var(--color-border)] bg-[color:var(--color-brand-900)] text-white">
      <div className="page-container grid gap-12 py-16 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-[color:var(--accent)] text-sm font-black text-[color:var(--accent-foreground)]">
              {storeLogoInitial()}
            </span>
            <p className="max-w-xs text-lg font-bold leading-tight tracking-tight">{publicEnv.storeName}</p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
            Informatique, fournitures scolaires, gaming, bureau, maison, cosmétiques
            et sport — ainsi qu&apos;un studio de création graphique sur mesure.
          </p>
          <p className="mt-4 text-sm font-semibold text-slate-200">{storeContact.phone}</p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <a href={storePhoneHref()} className="text-slate-300 underline-offset-2 hover:text-white hover:underline">
              Appeler
            </a>
            <a
              href={storeWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 underline-offset-2 hover:text-white hover:underline"
            >
              WhatsApp
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <ButtonLink href="/catalogue" variant="primary" size="sm">
              Tout le catalogue
            </ButtonLink>
            <ButtonLink
              href="/services"
              variant="outline"
              size="sm"
              className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
            >
              Services design
            </ButtonLink>
          </div>
        </div>

        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--accent)]">
            Nos familles
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
            {families.map((family) => {
              const visual = isFamilySlug(family.slug) ? getFamilyVisual(family.slug) : null;
              return (
                <li key={family.id}>
                  <Link
                    href={`/famille/${family.slug}`}
                    className="flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
                  >
                    {visual ? (
                      <span className="text-base" aria-hidden>
                        {visual.icon}
                      </span>
                    ) : null}
                    {family.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[color:var(--accent)]">
            Votre compte
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              { href: "/a-propos", label: "À propos" },
              { href: "/galerie", label: "Galerie" },
              { href: "/compte", label: "Mon compte" },
              { href: "/compte/notifications", label: "Notifications" },
              { href: "/compte/commandes", label: "Mes commandes" },
              { href: "/compte/demandes", label: "Mes demandes de design" },
              { href: "/panier", label: "Mon panier" },
            ].map((link) => (
              <li key={link.href}>
                <TextLink
                  href={link.href}
                  variant="footer"
                  className="text-slate-300 hover:text-white"
                >
                  {link.label}
                </TextLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-container flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-slate-400">
          <span>
            © {new Date().getFullYear()} {publicEnv.storeName}. Tous droits réservés.
          </span>
          <span className="font-medium text-slate-500">Bleu · Noir · Blanc</span>
        </div>
      </div>
    </footer>
  );
}
