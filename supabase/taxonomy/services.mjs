import { field } from "./helpers.mjs";

/**
 * Design services and their brief forms.
 *
 * Every service has its own questionnaire. A short shared block collects who is
 * asking and how to reach them; everything after it is written for that service
 * specifically, because a logo brief and a photo retouching brief have almost
 * nothing in common.
 */

const clientBlock = [
  field("client_nom", "Votre nom", "text", { group: "Vos informations", required: true }),
  field("client_entreprise", "Nom de l'entreprise ou du projet", "text", { group: "Vos informations" }),
  field("client_secteur", "Secteur d'activité", "text", { group: "Vos informations", placeholder: "Restauration, informatique, mode…" }),
  field("client_description", "Décrivez votre activité", "textarea", { group: "Vos informations", required: true, helpText: "Quelques phrases suffisent : ce que vous faites, pour qui, ce qui vous distingue." }),
];

const deliveryBlock = (extraFormats = []) => [
  field("formats_souhaites", "Formats de fichiers souhaités", "multiselect", {
    group: "Livraison",
    options: ["PDF", "PNG", "JPG", "SVG", "AI", "PSD", "EPS", ...extraFormats],
  }),
  field("delai", "Délai souhaité", "select", {
    group: "Livraison",
    options: ["Urgent (24-48 h)", "Sous une semaine", "Sous deux semaines", "Pas de contrainte"],
    required: true,
  }),
  field("budget", "Budget indicatif", "text", { group: "Livraison" }),
  field("instructions", "Instructions supplémentaires", "textarea", { group: "Livraison" }),
];

const referenceFiles = [
  field("fichiers_references", "Références et inspirations", "files", {
    group: "Fichiers",
    helpText: "Images, captures ou liens exportés qui illustrent ce que vous aimez.",
  }),
  field("fichiers_documents", "Documents utiles", "files", {
    group: "Fichiers",
    helpText: "Textes, tarifs, plans, tout contenu à intégrer.",
  }),
];

export const services = [
  {
    name: "Création de logo",
    tagline: "Une identité graphique qui vous ressemble",
    description:
      "Conception d'un logo original, décliné dans les formats nécessaires à tous vos supports.",
    deliveryTime: "5 à 7 jours",
    featured: true,
    form: {
      name: "Brief de création de logo",
      description:
        "Plus votre brief est précis, plus la première proposition sera proche de ce que vous imaginez.",
      fields: [
        ...clientBlock,
        field("slogan", "Slogan ou baseline", "text", { group: "Vos informations" }),
        field("public_cible", "Public cible", "textarea", { group: "Vos informations", required: true, helpText: "Âge, localisation, habitudes, ce qui compte pour eux." }),
        field("concurrents", "Concurrents ou marques comparables", "textarea", { group: "Vos informations" }),

        field("style_souhaite", "Style souhaité", "multiselect", {
          group: "Direction artistique",
          options: ["Minimaliste", "Moderne", "Classique", "Luxe", "Ludique", "Artisanal", "Technologique", "Naturel", "Vintage", "Corporate"],
          required: true,
        }),
        field("type_logo", "Type de logo", "select", {
          group: "Direction artistique",
          options: ["Typographique (texte seul)", "Icône seule", "Icône + texte", "Emblème / écusson", "À votre appréciation"],
        }),
        field("couleurs_souhaitees", "Couleurs souhaitées", "text", { group: "Direction artistique", placeholder: "Bleu nuit, doré…" }),
        field("couleurs_a_eviter", "Couleurs à éviter", "text", { group: "Direction artistique" }),
        field("symboles_souhaites", "Symboles ou éléments souhaités", "textarea", { group: "Direction artistique" }),
        field("symboles_a_eviter", "Symboles ou éléments à éviter", "textarea", { group: "Direction artistique" }),
        field("typographie_souhaitee", "Typographie souhaitée", "select", {
          group: "Direction artistique",
          options: ["Sans serif (moderne)", "Serif (classique)", "Script (manuscrite)", "Display (originale)", "À votre appréciation"],
        }),
        field("inspirations", "Inspirations", "textarea", { group: "Direction artistique", helpText: "Décrivez ou listez des logos que vous appréciez, et pourquoi." }),

        field("logo_existant", "Logo existant", "files", { group: "Fichiers", helpText: "Si vous souhaitez une refonte." }),
        ...referenceFiles,

        field("supports_utilisation", "Supports d'utilisation prévus", "multiselect", {
          group: "Livraison",
          options: ["Enseigne", "Cartes de visite", "Réseaux sociaux", "Site web", "Véhicule", "Textile", "Emballage", "Documents administratifs"],
        }),
        field("declinaisons", "Déclinaisons attendues", "multiselect", {
          group: "Livraison",
          options: ["Version couleur", "Version monochrome", "Version noir et blanc", "Version fond sombre", "Favicon", "Version horizontale", "Version verticale"],
        }),
        ...deliveryBlock(["Fichiers sources vectoriels"]),
      ],
    },
  },

  {
    name: "Flyer",
    tagline: "Un support percutant pour vos campagnes",
    description: "Flyer recto ou recto-verso prêt à imprimer ou à diffuser en ligne.",
    deliveryTime: "2 à 4 jours",
    featured: true,
    form: {
      name: "Brief flyer",
      fields: [
        ...clientBlock,
        field("objectif", "Objectif du flyer", "select", {
          group: "Le projet",
          options: ["Promotion / soldes", "Ouverture", "Événement", "Présentation de services", "Recrutement", "Information"],
          required: true,
        }),
        field("format_flyer", "Format", "select", {
          group: "Le projet",
          options: ["A6 (10.5 x 14.8 cm)", "A5 (14.8 x 21 cm)", "A4 (21 x 29.7 cm)", "DL (10 x 21 cm)", "Carré", "Format personnalisé"],
          required: true,
        }),
        field("recto_verso", "Recto-verso", "select", { group: "Le projet", options: ["Recto seul", "Recto-verso"], required: true }),
        field("titre_principal", "Titre principal", "text", { group: "Contenu", required: true }),
        field("texte_recto", "Texte du recto", "textarea", { group: "Contenu", required: true }),
        field("texte_verso", "Texte du verso", "textarea", { group: "Contenu" }),
        field("offre", "Offre ou promotion à mettre en avant", "textarea", { group: "Contenu" }),
        field("coordonnees", "Coordonnées à afficher", "textarea", { group: "Contenu", helpText: "Téléphone, adresse, réseaux sociaux, site web." }),
        field("appel_action", "Appel à l'action", "text", { group: "Contenu", placeholder: "Appelez-nous, Visitez la boutique…" }),
        field("style_souhaite", "Style souhaité", "multiselect", {
          group: "Direction artistique",
          options: ["Épuré", "Coloré", "Élégant", "Percutant", "Festif", "Professionnel"],
        }),
        field("couleurs_souhaitees", "Couleurs souhaitées", "text", { group: "Direction artistique" }),
        field("charte_existante", "Charte graphique existante", "files", { group: "Fichiers" }),
        field("photos_a_utiliser", "Photos ou visuels à utiliser", "files", { group: "Fichiers" }),
        ...referenceFiles,
        field("usage_final", "Usage final", "select", { group: "Livraison", options: ["Impression", "Diffusion numérique", "Les deux"], required: true }),
        field("quantite_impression", "Quantité à imprimer", "text", { group: "Livraison" }),
        ...deliveryBlock(["PDF prêt à imprimer (fond perdu)"]),
      ],
    },
  },

  {
    name: "Carte de visite",
    tagline: "La première impression, soignée",
    description: "Carte de visite recto-verso alignée sur votre identité visuelle.",
    deliveryTime: "2 à 3 jours",
    form: {
      name: "Brief carte de visite",
      fields: [
        ...clientBlock,
        field("nom_titulaire", "Nom figurant sur la carte", "text", { group: "Contenu", required: true }),
        field("fonction", "Fonction / titre", "text", { group: "Contenu" }),
        field("telephone", "Téléphone", "text", { group: "Contenu" }),
        field("email_carte", "E-mail", "email", { group: "Contenu" }),
        field("adresse", "Adresse", "textarea", { group: "Contenu" }),
        field("site_web", "Site web", "url", { group: "Contenu" }),
        field("reseaux", "Comptes à afficher", "textarea", { group: "Contenu" }),
        field("qr_code", "Inclure un QR code", "boolean", { group: "Contenu" }),
        field("qr_destination", "Destination du QR code", "text", { group: "Contenu" }),
        field("format_carte", "Format", "select", { group: "Direction artistique", options: ["85 x 55 mm (standard)", "90 x 50 mm", "Carré 55 x 55 mm", "Format personnalisé"] }),
        field("orientation", "Orientation", "select", { group: "Direction artistique", options: ["Paysage", "Portrait"] }),
        field("style_souhaite", "Style souhaité", "multiselect", { group: "Direction artistique", options: ["Minimaliste", "Élégant", "Créatif", "Corporate", "Luxe"] }),
        field("finitions", "Finitions envisagées", "multiselect", { group: "Direction artistique", options: ["Mat", "Brillant", "Soft touch", "Dorure", "Vernis sélectif", "Bords arrondis"] }),
        field("logo_existant", "Votre logo", "files", { group: "Fichiers", helpText: "De préférence en fichier vectoriel." }),
        ...referenceFiles,
        ...deliveryBlock(["PDF prêt à imprimer (fond perdu)"]),
      ],
    },
  },

  {
    name: "Affiche",
    tagline: "Un visuel qui se voit de loin",
    description: "Affiche grand format pour vos événements, promotions ou communications.",
    deliveryTime: "3 à 5 jours",
    form: {
      name: "Brief affiche",
      fields: [
        ...clientBlock,
        field("sujet", "Sujet de l'affiche", "text", { group: "Le projet", required: true }),
        field("format_affiche", "Format", "select", { group: "Le projet", options: ["A3", "A2", "A1", "A0", "40 x 60 cm", "Format personnalisé"], required: true }),
        field("lieu_affichage", "Lieu d'affichage", "text", { group: "Le projet", helpText: "Intérieur, vitrine, panneau extérieur… cela influence la lisibilité." }),
        field("distance_lecture", "Distance de lecture", "select", { group: "Le projet", options: ["Moins d'un mètre", "1 à 3 mètres", "Plus de 3 mètres"] }),
        field("titre_principal", "Titre principal", "text", { group: "Contenu", required: true }),
        field("sous_titre", "Sous-titre", "text", { group: "Contenu" }),
        field("informations_pratiques", "Informations pratiques", "textarea", { group: "Contenu", helpText: "Date, heure, lieu, tarif, contact." }),
        field("mentions_legales", "Mentions obligatoires", "textarea", { group: "Contenu" }),
        field("style_souhaite", "Style souhaité", "multiselect", { group: "Direction artistique", options: ["Typographique", "Photographique", "Illustré", "Minimaliste", "Rétro", "Audacieux"] }),
        field("couleurs_souhaitees", "Couleurs souhaitées", "text", { group: "Direction artistique" }),
        field("photos_a_utiliser", "Visuels à intégrer", "files", { group: "Fichiers" }),
        field("logos_partenaires", "Logos partenaires ou sponsors", "files", { group: "Fichiers" }),
        ...referenceFiles,
        ...deliveryBlock(["PDF haute résolution"]),
      ],
    },
  },

  {
    name: "Invitation",
    tagline: "Donnez le ton dès l'invitation",
    description: "Carton d'invitation imprimé ou numérique pour tout type d'événement.",
    deliveryTime: "2 à 4 jours",
    form: {
      name: "Brief invitation",
      fields: [
        ...clientBlock,
        field("type_evenement", "Type d'événement", "select", {
          group: "L'événement",
          options: ["Mariage", "Anniversaire", "Baptême", "Inauguration", "Séminaire", "Soirée d'entreprise", "Remise de diplôme", "Autre"],
          required: true,
        }),
        field("nom_hotes", "Nom des hôtes", "text", { group: "L'événement", required: true }),
        field("date_evenement", "Date de l'événement", "date", { group: "L'événement", required: true }),
        field("heure_evenement", "Heure", "text", { group: "L'événement" }),
        field("lieu_evenement", "Lieu", "textarea", { group: "L'événement", required: true }),
        field("programme", "Programme", "textarea", { group: "L'événement" }),
        field("code_vestimentaire", "Code vestimentaire", "text", { group: "L'événement" }),
        field("rsvp", "Modalités de réponse (RSVP)", "textarea", { group: "L'événement" }),
        field("texte_personnel", "Texte personnel ou citation", "textarea", { group: "Contenu" }),
        field("format_invitation", "Format", "select", { group: "Direction artistique", options: ["A6", "A5", "Carré 15 x 15 cm", "DL", "Numérique (réseaux sociaux)", "Format personnalisé"] }),
        field("style_souhaite", "Style souhaité", "multiselect", { group: "Direction artistique", options: ["Élégant", "Romantique", "Moderne", "Festif", "Traditionnel", "Minimaliste", "Floral"] }),
        field("couleurs_souhaitees", "Palette de couleurs", "text", { group: "Direction artistique" }),
        field("photos_a_utiliser", "Photos à intégrer", "files", { group: "Fichiers" }),
        ...referenceFiles,
        field("nombre_exemplaires", "Nombre d'exemplaires", "integer", { group: "Livraison" }),
        ...deliveryBlock(),
      ],
    },
  },

  {
    name: "Bannière",
    tagline: "Pour le web comme pour la rue",
    description:
      "Bannière web, couverture de réseau social ou bâche grand format, aux bonnes dimensions.",
    deliveryTime: "1 à 3 jours",
    form: {
      name: "Brief bannière",
      fields: [
        ...clientBlock,
        field("destination", "Destination de la bannière", "select", {
          group: "Le projet",
          options: ["Site web", "Réseaux sociaux", "Publicité en ligne", "Bâche extérieure", "Kakemono / roll-up", "Enseigne"],
          required: true,
        }),
        field("dimensions_souhaitees", "Dimensions", "text", { group: "Le projet", required: true, placeholder: "1200 x 400 px, ou 3 x 1 m" }),
        field("declinaisons_tailles", "Déclinaisons de taille nécessaires", "textarea", { group: "Le projet", helpText: "Listez chaque emplacement et sa taille si plusieurs versions sont attendues." }),
        field("message_principal", "Message principal", "text", { group: "Contenu", required: true }),
        field("message_secondaire", "Message secondaire", "text", { group: "Contenu" }),
        field("appel_action", "Bouton / appel à l'action", "text", { group: "Contenu" }),
        field("animee", "Version animée souhaitée", "boolean", { group: "Contenu" }),
        field("style_souhaite", "Style souhaité", "multiselect", { group: "Direction artistique", options: ["Épuré", "Impactant", "Photographique", "Illustré", "Dégradé", "Corporate"] }),
        field("couleurs_souhaitees", "Couleurs souhaitées", "text", { group: "Direction artistique" }),
        field("charte_existante", "Charte graphique", "files", { group: "Fichiers" }),
        field("photos_a_utiliser", "Visuels à intégrer", "files", { group: "Fichiers" }),
        ...referenceFiles,
        ...deliveryBlock(["GIF", "MP4"]),
      ],
    },
  },

  {
    name: "Brochure",
    tagline: "Présentez votre offre en détail",
    description: "Brochure multipage mise en page pour l'impression et la lecture à l'écran.",
    deliveryTime: "5 à 10 jours",
    form: {
      name: "Brief brochure",
      fields: [
        ...clientBlock,
        field("objectif", "Objectif de la brochure", "select", {
          group: "Le projet",
          options: ["Présentation d'entreprise", "Catalogue d'offres", "Rapport annuel", "Support commercial", "Document institutionnel"],
          required: true,
        }),
        field("nombre_pages", "Nombre de pages", "select", { group: "Le projet", options: ["4 pages", "8 pages", "12 pages", "16 pages", "24 pages", "Plus de 24 pages"], required: true }),
        field("format_brochure", "Format", "select", { group: "Le projet", options: ["A4 portrait", "A4 paysage", "A5", "Carré 21 x 21 cm", "Format personnalisé"], required: true }),
        field("reliure", "Reliure", "select", { group: "Le projet", options: ["Piqûre à cheval", "Dos carré collé", "Spirale", "Sans reliure"] }),
        field("sommaire", "Structure envisagée", "textarea", { group: "Contenu", required: true, helpText: "Listez les sections ou chapitres, une par ligne." }),
        field("textes_fournis", "Les textes sont-ils prêts ?", "select", { group: "Contenu", options: ["Oui, tous", "Partiellement", "Non, à rédiger"], required: true }),
        field("contenu_redactionnel", "Contenu à intégrer", "textarea", { group: "Contenu" }),
        field("style_souhaite", "Style de mise en page", "multiselect", { group: "Direction artistique", options: ["Éditorial", "Corporate", "Magazine", "Minimaliste", "Illustré", "Photographique"] }),
        field("charte_existante", "Charte graphique", "files", { group: "Fichiers" }),
        field("photos_a_utiliser", "Photos et illustrations", "files", { group: "Fichiers" }),
        field("textes_documents", "Documents texte", "files", { group: "Fichiers" }),
        ...referenceFiles,
        ...deliveryBlock(["PDF interactif", "InDesign"]),
      ],
    },
  },

  {
    name: "Dépliant",
    tagline: "Une information claire, bien pliée",
    description: "Dépliant deux ou trois volets, structuré pour être lu dans le bon ordre.",
    deliveryTime: "3 à 5 jours",
    form: {
      name: "Brief dépliant",
      fields: [
        ...clientBlock,
        field("type_pliage", "Type de pliage", "select", {
          group: "Le projet",
          options: ["2 volets (simple)", "3 volets roulé", "3 volets accordéon", "4 volets portefeuille", "Pliage croisé"],
          required: true,
        }),
        field("format_ferme", "Format fermé", "select", { group: "Le projet", options: ["DL (10 x 21 cm)", "A5", "A6", "Carré", "Format personnalisé"], required: true }),
        field("contenu_par_volet", "Contenu volet par volet", "textarea", { group: "Contenu", required: true, helpText: "Décrivez ce qui doit figurer sur chaque face, dans l'ordre de lecture." }),
        field("titre_couverture", "Titre de couverture", "text", { group: "Contenu", required: true }),
        field("coordonnees", "Coordonnées", "textarea", { group: "Contenu" }),
        field("tarifs", "Tarifs ou grille de prix", "textarea", { group: "Contenu" }),
        field("style_souhaite", "Style souhaité", "multiselect", { group: "Direction artistique", options: ["Épuré", "Informatif", "Coloré", "Professionnel", "Touristique"] }),
        field("couleurs_souhaitees", "Couleurs souhaitées", "text", { group: "Direction artistique" }),
        field("charte_existante", "Charte graphique", "files", { group: "Fichiers" }),
        field("photos_a_utiliser", "Visuels à intégrer", "files", { group: "Fichiers" }),
        ...referenceFiles,
        ...deliveryBlock(["PDF prêt à imprimer (fond perdu)"]),
      ],
    },
  },

  {
    name: "Menu",
    tagline: "Une carte qui donne envie",
    description: "Carte de restaurant, bar ou traiteur, lisible et appétissante.",
    deliveryTime: "3 à 5 jours",
    form: {
      name: "Brief menu",
      fields: [
        ...clientBlock,
        field("type_etablissement", "Type d'établissement", "select", {
          group: "L'établissement",
          options: ["Restaurant", "Fast-food", "Bar", "Café", "Pâtisserie", "Traiteur", "Food truck"],
          required: true,
        }),
        field("type_cuisine", "Type de cuisine", "text", { group: "L'établissement" }),
        field("format_menu", "Format", "select", {
          group: "Le projet",
          options: ["A4 recto-verso", "A5", "Format long (10 x 30 cm)", "Dépliant 3 volets", "Set de table", "Ardoise / affiche", "Menu numérique (QR code)"],
          required: true,
        }),
        field("nombre_sections", "Sections du menu", "textarea", { group: "Contenu", required: true, helpText: "Entrées, plats, desserts, boissons… une par ligne." }),
        field("liste_plats", "Liste des plats et prix", "textarea", { group: "Contenu", required: true, helpText: "Nom du plat, description courte, prix." }),
        field("mentions_allergenes", "Mentions allergènes à afficher", "textarea", { group: "Contenu" }),
        field("langues", "Langues du menu", "multiselect", { group: "Contenu", options: ["Français", "Anglais", "Arabe", "Espagnol", "Autre"] }),
        field("photos_plats", "Photos des plats", "select", { group: "Direction artistique", options: ["Avec photos", "Sans photos", "Quelques photos seulement"] }),
        field("style_souhaite", "Ambiance souhaitée", "multiselect", { group: "Direction artistique", options: ["Chic", "Convivial", "Rustique", "Moderne", "Street food", "Traditionnel"] }),
        field("couleurs_souhaitees", "Couleurs souhaitées", "text", { group: "Direction artistique" }),
        field("photos_a_utiliser", "Photos à utiliser", "files", { group: "Fichiers" }),
        field("menu_actuel", "Menu actuel", "files", { group: "Fichiers" }),
        ...referenceFiles,
        field("plastification", "Plastification prévue", "boolean", { group: "Livraison" }),
        ...deliveryBlock(["PDF prêt à imprimer (fond perdu)"]),
      ],
    },
  },

  {
    name: "Catalogue",
    tagline: "Votre offre complète, bien présentée",
    description:
      "Catalogue produits multipage avec fiches structurées, prix et références.",
    deliveryTime: "7 à 14 jours",
    form: {
      name: "Brief catalogue",
      fields: [
        ...clientBlock,
        field("nombre_produits", "Nombre de produits à présenter", "integer", { group: "Le projet", required: true }),
        field("nombre_pages", "Nombre de pages estimé", "text", { group: "Le projet" }),
        field("format_catalogue", "Format", "select", { group: "Le projet", options: ["A4 portrait", "A5", "Carré 21 x 21 cm", "Format personnalisé"], required: true }),
        field("organisation", "Organisation du catalogue", "textarea", { group: "Contenu", required: true, helpText: "Par gamme, par catégorie, par usage…" }),
        field("elements_fiche", "Éléments par fiche produit", "multiselect", {
          group: "Contenu",
          options: ["Photo", "Nom", "Référence", "Description", "Caractéristiques", "Prix", "Code-barres", "QR code"],
          required: true,
        }),
        field("affichage_prix", "Affichage des prix", "select", { group: "Contenu", options: ["Prix visibles", "Prix sur demande", "Grille tarifaire séparée"] }),
        field("donnees_produits", "Fichier de données produits", "files", { group: "Fichiers", helpText: "Tableur listant vos produits, si vous en avez un." }),
        field("photos_produits", "Photos produits", "files", { group: "Fichiers" }),
        field("charte_existante", "Charte graphique", "files", { group: "Fichiers" }),
        field("style_souhaite", "Style de mise en page", "multiselect", { group: "Direction artistique", options: ["Épuré", "Dense", "Magazine", "Technique", "Luxe"] }),
        ...referenceFiles,
        field("version_numerique", "Version numérique interactive", "boolean", { group: "Livraison" }),
        ...deliveryBlock(["PDF interactif", "InDesign"]),
      ],
    },
  },

  {
    name: "Packaging",
    tagline: "L'emballage qui fait vendre",
    description:
      "Conception d'emballage et d'étiquette, avec gabarit technique prêt pour l'imprimeur.",
    deliveryTime: "7 à 14 jours",
    form: {
      name: "Brief packaging",
      fields: [
        ...clientBlock,
        field("nom_produit", "Nom du produit", "text", { group: "Le produit", required: true }),
        field("type_emballage", "Type d'emballage", "select", {
          group: "Le produit",
          options: ["Boîte carton", "Étiquette", "Sachet souple", "Pot / bocal", "Bouteille", "Tube", "Blister", "Sac"],
          required: true,
        }),
        field("dimensions_produit", "Dimensions de l'emballage", "text", { group: "Le produit", required: true }),
        field("contenance", "Contenance", "text", { group: "Le produit" }),
        field("gabarit_disponible", "Gabarit technique fourni par l'imprimeur", "files", { group: "Fichiers", helpText: "Le fichier de découpe, s'il vous a déjà été communiqué." }),
        field("mentions_obligatoires", "Mentions obligatoires", "textarea", { group: "Contenu", required: true, helpText: "Composition, poids net, code-barres, DLC, coordonnées du fabricant…" }),
        field("argumentaire", "Arguments à mettre en avant", "textarea", { group: "Contenu" }),
        field("code_barres", "Code-barres à intégrer", "text", { group: "Contenu" }),
        field("gamme", "Nombre de déclinaisons / parfums", "text", { group: "Contenu", helpText: "Si le packaging doit exister en plusieurs variantes." }),
        field("style_souhaite", "Style souhaité", "multiselect", { group: "Direction artistique", options: ["Premium", "Naturel", "Ludique", "Épuré", "Coloré", "Artisanal", "Industriel"] }),
        field("couleurs_souhaitees", "Couleurs souhaitées", "text", { group: "Direction artistique" }),
        field("finitions", "Finitions envisagées", "multiselect", { group: "Direction artistique", options: ["Mat", "Brillant", "Vernis sélectif", "Dorure à chaud", "Gaufrage", "Kraft"] }),
        field("concurrents_rayon", "Produits concurrents en rayon", "textarea", { group: "Direction artistique" }),
        ...referenceFiles,
        ...deliveryBlock(["Fichier de découpe", "Illustrator"]),
      ],
    },
  },

  {
    name: "Retouche photo",
    tagline: "Des visuels prêts à publier",
    description:
      "Détourage, correction colorimétrique et nettoyage de vos photos produit ou portrait.",
    deliveryTime: "1 à 3 jours",
    form: {
      name: "Brief retouche photo",
      fields: [
        ...clientBlock,
        field("nombre_photos", "Nombre de photos à retoucher", "integer", { group: "Le projet", required: true }),
        field("type_photos", "Type de photos", "select", {
          group: "Le projet",
          options: ["Photos produit", "Portraits", "Photos d'événement", "Photos immobilières", "Photos culinaires", "Autre"],
          required: true,
        }),
        field("retouches_demandees", "Retouches demandées", "multiselect", {
          group: "Le projet",
          options: ["Détourage / fond blanc", "Correction des couleurs", "Correction de l'exposition", "Suppression d'éléments", "Retouche de peau", "Redressement / recadrage", "Ajout d'ombre portée", "Montage / composition", "Agrandissement"],
          required: true,
        }),
        field("fond_souhaite", "Fond souhaité", "select", { group: "Le projet", options: ["Blanc", "Transparent", "Couleur unie", "Fond d'origine conservé", "Nouveau décor"] }),
        field("consignes_precises", "Consignes précises", "textarea", { group: "Le projet", required: true, helpText: "Indiquez photo par photo ce qui doit être modifié." }),
        field("photos_originales", "Photos à retoucher", "files", { group: "Fichiers", required: true, helpText: "Fichiers d'origine, à la meilleure résolution disponible." }),
        field("exemples_rendu", "Exemples du rendu attendu", "files", { group: "Fichiers" }),
        field("dimensions_sortie", "Dimensions de sortie", "text", { group: "Livraison", placeholder: "1500 x 1500 px" }),
        field("usage_final", "Usage final", "select", { group: "Livraison", options: ["Site e-commerce", "Réseaux sociaux", "Impression", "Marketplace", "Usage mixte"] }),
        ...deliveryBlock(["TIFF"]),
      ],
    },
  },

  {
    name: "Autres créations",
    tagline: "Un projet qui n'entre dans aucune case",
    description:
      "Décrivez votre besoin : nous revenons vers vous avec une proposition et un devis.",
    deliveryTime: "Sur devis",
    form: {
      name: "Brief création sur mesure",
      fields: [
        ...clientBlock,
        field("type_creation", "Type de création souhaitée", "text", { group: "Le projet", required: true }),
        field("description_projet", "Décrivez votre projet", "textarea", { group: "Le projet", required: true, helpText: "Le plus précisément possible : à quoi cela sert, où cela sera utilisé, ce que cela doit provoquer." }),
        field("dimensions_souhaitees", "Dimensions ou format", "text", { group: "Le projet" }),
        field("quantite", "Quantité ou nombre de déclinaisons", "text", { group: "Le projet" }),
        field("contenu_a_integrer", "Contenu à intégrer", "textarea", { group: "Contenu" }),
        field("style_souhaite", "Style souhaité", "textarea", { group: "Direction artistique" }),
        field("couleurs_souhaitees", "Couleurs souhaitées", "text", { group: "Direction artistique" }),
        field("charte_existante", "Charte graphique existante", "files", { group: "Fichiers" }),
        ...referenceFiles,
        ...deliveryBlock(),
      ],
    },
  },
];
