import { publicEnv } from "@/lib/public-env";
import { familyVisuals } from "@/lib/theme/families";
import type { AboutHighlightItem, AboutSectionContent } from "@/types/design";
import type { AboutSectionId } from "@/lib/design/about-sections";

const familyList = Object.values(familyVisuals)
  .map((family) => `${family.icon} ${family.tagline}`)
  .join(" · ");

const defaultValues: AboutHighlightItem[] = [
  {
    icon: "🤝",
    title: "Proximité",
    description: "Une équipe accessible, à l'écoute des besoins réels de nos clients en Haïti.",
  },
  {
    icon: "✅",
    title: "Fiabilité",
    description: "Des produits sélectionnés, un suivi clair des commandes et des délais annoncés.",
  },
  {
    icon: "🎨",
    title: "Créativité",
    description: "Un studio de design intégré pour vos visuels, print et identité de marque.",
  },
  {
    icon: "⚡",
    title: "Réactivité",
    description: "Catalogue en ligne, briefs de design en ligne et réponses rapides par WhatsApp.",
  },
];

const defaultWhyUs: AboutHighlightItem[] = [
  {
    icon: "🛍️",
    title: "Tout sous un même toit",
    description: "Informatique, gaming, fournitures, maison, sport, cosmétiques et services créatifs.",
  },
  {
    icon: "📦",
    title: "Commande simple",
    description: "Parcours clair du catalogue au paiement, avec retrait en boutique ou livraison.",
  },
  {
    icon: "🇭🇹",
    title: "Entreprise haïtienne",
    description: "Une structure locale qui comprend le marché, les contraintes et les attentes du terrain.",
  },
  {
    icon: "💬",
    title: "Accompagnement humain",
    description: "Conseil produit et suivi de projet design — pas seulement une vitrine en ligne.",
  },
];

export const DEFAULT_ABOUT_CONTENT: Record<AboutSectionId, AboutSectionContent> = {
  hero: {
    title: publicEnv.storeName,
    subtitle: "Commerce multi-univers & studio de design",
    body: "Une entreprise haïtienne qui réunit le meilleur du retail et de la création visuelle, avec un service client exigeant.",
  },
  presentation: {
    title: "Qui sommes-nous ?",
    body: `${publicEnv.storeName} est une boutique en ligne et un studio créatif au service des particuliers, des écoles, des entreprises et des créateurs.\n\nNous proposons un catalogue structuré par familles — de l'informatique aux fournitures scolaires, du gaming aux cosmétiques — complété par des prestations de design sur mesure.\n\nNotre ambition : rendre le commerce et la création graphique accessibles, professionnels et fiables.`,
  },
  history: {
    title: "Notre histoire",
    body: "Née d'une volonté de centraliser des univers produits souvent dispersés, l'entreprise a construit une offre cohérente autour d'un principe simple : un seul magasin, plusieurs expertises.\n\nAu fil du temps, le studio de design s'est imposé comme un prolongement naturel de la relation client — logo, print, packaging, retouche photo — avec un brief en ligne adapté à chaque prestation.\n\nAujourd'hui, nous continuons d'investir dans l'expérience digitale pour servir nos clients avec la même exigence qu'en boutique.",
  },
  mission: {
    title: "Notre mission",
    body: "Faciliter l'accès à des produits utiles et à des services visuels de qualité, avec transparence sur les délais, les tarifs et le suivi.\n\nNous voulons que chaque client — particulier ou professionnel — trouve rapidement ce dont il a besoin, et soit accompagné lorsque le visuel devient stratégique.",
  },
  values: {
    title: "Nos valeurs",
    items: defaultValues,
  },
  activities: {
    title: "Nos activités",
    body: `Sept univers produits : ${familyList}.\n\nCôté services, notre studio prend en charge l'identité visuelle, le print, le packaging, la retouche photo et bien d'autres prestations — avec un questionnaire de brief adapté à chaque projet.`,
  },
  "why-us": {
    title: "Pourquoi nous choisir ?",
    items: defaultWhyUs,
  },
  presence: {
    title: "Notre présence",
    body: "Nous servons une clientèle en Haïti avec retrait en boutique et options de livraison selon les zones couvertes.\n\nNotre équipe reste joignable par téléphone et WhatsApp pour les conseils produits, le suivi de commande et les demandes de devis design.",
  },
  cta: {
    title: "Prêt à découvrir notre univers ?",
    subtitle: "Explorez le catalogue ou démarrez un projet créatif.",
    body: "Des milliers de références et un studio à votre écoute — en quelques clics.",
  },
};
