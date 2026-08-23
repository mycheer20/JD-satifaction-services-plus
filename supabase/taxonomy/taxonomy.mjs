/**
 * The commercial tree: Family -> Category -> Subcategory.
 *
 * This is the single source of truth for the seed. Slugs are derived from the
 * names; where the same name appears twice at the same level (there are several
 * "Adaptateurs", "Supports" and "Crochets"), the generator disambiguates by
 * appending the parent slug, so every slug stays globally unique and stable.
 *
 * `set` names the field set that drives the admin form for that subcategory.
 */

const s = (name, set) => ({ name, set });

export const families = [
  {
    name: "Informatique",
    description:
      "Ordinateurs, composants, périphériques et tout l'équipement informatique du quotidien.",
    icon: "laptop",
    categories: [
      {
        name: "Ordinateurs",
        subcategories: [
          s("Ordinateurs portables", "laptop"),
          s("Ordinateurs de bureau", "desktop_pc"),
          s("PC gaming", "desktop_pc"),
          s("Mini PC", "mini_pc"),
        ],
      },
      {
        name: "Composants informatiques",
        subcategories: [
          s("Processeurs", "cpu"),
          s("Cartes graphiques", "gpu"),
          s("Cartes mères", "motherboard"),
          s("Mémoire RAM", "ram"),
          s("Stockage interne", "storage_drive"),
          s("Alimentations", "psu"),
          s("Boîtiers", "pc_case"),
          s("Refroidissement", "cooling"),
        ],
      },
      {
        name: "Périphériques",
        subcategories: [
          s("Claviers", "keyboard"),
          s("Souris", "mouse"),
          s("Webcams", "webcam"),
          s("Casques", "headset"),
          s("Haut-parleurs", "speaker"),
          s("Microphones", "microphone"),
        ],
      },
      {
        name: "Stockage",
        subcategories: [
          s("Disques durs", "storage_drive"),
          s("SSD", "storage_drive"),
          s("Clés USB", "usb_flash"),
          s("Cartes mémoire", "memory_card"),
        ],
      },
      {
        name: "Écrans & affichage",
        subcategories: [
          s("Moniteurs", "monitor"),
          s("Projecteurs", "projector"),
          s("Accessoires d'affichage", "computer_accessory"),
        ],
      },
      {
        name: "Câbles & connectique",
        subcategories: [
          s("HDMI", "cable"),
          s("USB", "cable"),
          s("Adaptateurs", "cable"),
          s("Autres câbles", "cable"),
        ],
      },
      {
        name: "Réseau",
        subcategories: [
          s("Routeurs", "network_device"),
          s("Switches", "network_device"),
          s("Adaptateurs réseau", "network_device"),
          s("Accessoires réseau", "computer_accessory"),
        ],
      },
      {
        name: "Impression",
        subcategories: [
          s("Imprimantes", "printer"),
          s("Cartouches", "printer_consumable"),
          s("Toners", "printer_consumable"),
          s("Tambours", "printer_consumable"),
          s("Accessoires d'impression", "computer_accessory"),
        ],
      },
      {
        name: "Calculatrices",
        subcategories: [
          s("Calculatrices standard", "calculator"),
          s("Calculatrices scientifiques", "calculator"),
          s("Calculatrices professionnelles", "calculator"),
        ],
      },
      {
        name: "Accessoires informatiques",
        subcategories: [
          s("Supports", "computer_accessory"),
          s("Hubs", "computer_accessory"),
          s("Adaptateurs", "computer_accessory"),
          s("Divers", "computer_accessory"),
        ],
      },
    ],
  },

  {
    name: "Fournitures scolaires",
    description:
      "Tout le nécessaire pour la rentrée et l'année scolaire, de la maternelle au supérieur.",
    icon: "pencil",
    categories: [
      {
        name: "Écriture",
        subcategories: [
          s("Stylos", "writing_instrument"),
          s("Stylos plume", "writing_instrument"),
          s("Crayons", "writing_instrument"),
          s("Marqueurs", "writing_instrument"),
          s("Feutres", "writing_instrument"),
          s("Craies", "writing_instrument"),
        ],
      },
      {
        name: "Cahiers & blocs",
        subcategories: [
          s("Cahiers", "notebook"),
          s("Blocs-notes", "notebook"),
          s("Blocs de papier", "notebook"),
          s("Post-it", "notebook"),
        ],
      },
      {
        name: "Dessin & arts créatifs",
        subcategories: [
          s("Crayons de couleur", "art_supply"),
          s("Crayons de cire", "art_supply"),
          s("Papier de construction", "art_supply"),
          s("Matériel de dessin", "art_supply"),
          s("Matériel artistique", "art_supply"),
        ],
      },
      {
        name: "Géométrie",
        subcategories: [
          s("Boîtes de géométrie", "geometry_tool"),
          s("Règles", "geometry_tool"),
          s("Équerres", "geometry_tool"),
          s("Rapporteurs", "geometry_tool"),
          s("Compas", "geometry_tool"),
        ],
      },
      {
        name: "Correction",
        subcategories: [
          s("Gommes", "correction_supply"),
          s("Correcteurs liquides", "correction_supply"),
          s("Correcteurs en ruban", "correction_supply"),
          s("Effaceurs", "correction_supply"),
        ],
      },
      {
        name: "Découpage & taille",
        subcategories: [
          s("Ciseaux", "cutting_tool"),
          s("Taille-crayons", "cutting_tool"),
        ],
      },
      {
        name: "Colles & adhésifs",
        subcategories: [
          s("Colles", "adhesive"),
          s("Colle en bâton", "adhesive"),
          s("Silicone", "adhesive"),
          s("Adhésifs", "adhesive"),
        ],
      },
      {
        name: "Trousses & accessoires",
        subcategories: [
          s("Trousses", "school_kit"),
          s("Accessoires scolaires", "school_kit"),
          s("Kits scolaires", "school_kit"),
        ],
      },
      {
        name: "Matériel scolaire divers",
        subcategories: [s("Matériel scolaire divers", "generic")],
      },
    ],
  },

  {
    name: "Gaming",
    description:
      "Jeux, consoles, matériel et mobilier pour jouer dans les meilleures conditions.",
    icon: "gamepad",
    categories: [
      {
        name: "Jeux",
        subcategories: [
          s("Jeux PC", "video_game"),
          s("Jeux PlayStation", "video_game"),
          s("Jeux Xbox", "video_game"),
          s("Jeux Nintendo", "video_game"),
          s("Jeux numériques", "video_game"),
          s("Cartes cadeaux", "gift_card"),
          s("Abonnements gaming", "gift_card"),
        ],
      },
      {
        name: "Consoles",
        subcategories: [
          s("PlayStation", "console"),
          s("Xbox", "console"),
          s("Nintendo", "console"),
          s("Autres consoles", "console"),
        ],
      },
      {
        name: "Matériel gaming",
        subcategories: [
          s("Manettes", "gaming_controller"),
          s("Claviers gaming", "keyboard"),
          s("Souris gaming", "mouse"),
          s("Casques gaming", "headset"),
          s("Microphones gaming", "microphone"),
          s("Volants", "gaming_peripheral"),
          s("Pédales", "gaming_peripheral"),
          s("Tapis gaming", "gaming_accessory"),
        ],
      },
      {
        name: "Mobilier gaming",
        subcategories: [
          s("Fauteuils gaming", "gaming_furniture"),
          s("Bureaux gaming", "gaming_furniture"),
          s("Supports", "gaming_furniture"),
        ],
      },
      {
        name: "Accessoires gaming",
        subcategories: [
          s("Câbles", "cable"),
          s("Chargeurs", "gaming_accessory"),
          s("Supports console", "gaming_accessory"),
          s("Éclairage gaming", "gaming_accessory"),
          s("Autres accessoires", "gaming_accessory"),
        ],
      },
    ],
  },

  {
    name: "Bureau",
    description:
      "Classement, papeterie et accessoires pour équiper un bureau professionnel.",
    icon: "briefcase",
    categories: [
      {
        name: "Classement & organisation",
        subcategories: [
          s("Classeurs", "filing_supply"),
          s("Chemises", "filing_supply"),
          s("Dossiers", "filing_supply"),
          s("Porte-documents", "filing_supply"),
          s("Boîtes de classement", "filing_supply"),
        ],
      },
      {
        name: "Agrafage",
        subcategories: [
          s("Agrafeuses", "stapler"),
          s("Agrafes", "stapler"),
          s("Dégrafeuses", "stapler"),
        ],
      },
      {
        name: "Adhésifs",
        subcategories: [
          s("Rubans adhésifs", "office_adhesive"),
          s("Rubans de masquage", "office_adhesive"),
          s("Scotch", "office_adhesive"),
          s("Dévidoirs", "office_adhesive"),
        ],
      },
      {
        name: "Fixation",
        subcategories: [
          s("Trombonnes", "fastener"),
          s("Élastiques", "fastener"),
          s("Punaises", "fastener"),
          s("Crochets", "fastener"),
        ],
      },
      {
        name: "Papeterie de bureau",
        subcategories: [
          s("Blocs-notes", "office_paper"),
          s("Post-it", "office_paper"),
          s("Enveloppes", "office_paper"),
          s("Papier", "office_paper"),
        ],
      },
      {
        name: "Écriture de bureau",
        subcategories: [
          s("Stylos", "writing_instrument"),
          s("Marqueurs", "writing_instrument"),
          s("Crayons", "writing_instrument"),
        ],
      },
      {
        name: "Tampons & cachets",
        subcategories: [
          s("Tampons", "stamp"),
          s("Tampons encreurs", "stamp"),
          s("Accessoires de sceau", "stamp"),
        ],
      },
      {
        name: "Accessoires de bureau",
        subcategories: [
          s("Organisateurs", "office_accessory"),
          s("Porte-stylos", "office_accessory"),
          s("Cloches de bureau", "office_accessory"),
          s("Divers", "office_accessory"),
        ],
      },
    ],
  },

  {
    name: "Maison & alimentaire",
    description:
      "Entretien, cuisine, rangement, éclairage et épicerie pour la maison.",
    icon: "home",
    categories: [
      {
        name: "Produits ménagers",
        subcategories: [
          s("Nettoyage", "cleaning_product"),
          s("Désinfection", "cleaning_product"),
          s("Lessive", "cleaning_product"),
          s("Vaisselle", "cleaning_product"),
          s("Entretien", "cleaning_product"),
        ],
      },
      {
        name: "Cuisine",
        subcategories: [
          s("Ustensiles", "kitchenware"),
          s("Rangement", "storage_container"),
          s("Contenants", "storage_container"),
          s("Accessoires de cuisine", "kitchenware"),
        ],
      },
      {
        name: "Rangement & organisation",
        subcategories: [
          s("Boîtes", "storage_container"),
          s("Paniers", "storage_container"),
          s("Crochets", "storage_container"),
          s("Organisateurs", "storage_container"),
        ],
      },
      {
        name: "Éclairage & énergie",
        subcategories: [
          s("Ampoules", "lighting"),
          s("Lampes", "lighting"),
          s("Ampoules rechargeables", "lighting"),
          s("Piles", "battery"),
          s("Batteries", "battery"),
        ],
      },
      {
        name: "Alimentaire",
        subcategories: [
          s("Snacks", "food"),
          s("Biscuits", "food"),
          s("Bonbons & confiseries", "food"),
          s("Chocolats", "food"),
          s("Boissons", "food"),
          s("Café & thé", "food"),
          s("Épicerie", "food"),
        ],
      },
    ],
  },

  {
    name: "Cosmétiques",
    description: "Soins du visage et du corps, cheveux, parfumerie et maquillage.",
    icon: "sparkles",
    categories: [
      {
        name: "Soins du visage",
        subcategories: [
          s("Nettoyants", "cosmetic"),
          s("Crèmes visage", "cosmetic"),
          s("Masques", "cosmetic"),
          s("Sérums", "cosmetic"),
        ],
      },
      {
        name: "Soins du corps",
        subcategories: [
          s("Savons", "cosmetic"),
          s("Lotions", "cosmetic"),
          s("Crèmes corps", "cosmetic"),
          s("Huiles", "cosmetic"),
        ],
      },
      {
        name: "Soins capillaires",
        subcategories: [
          s("Shampooings", "cosmetic"),
          s("Après-shampooings", "cosmetic"),
          s("Huiles capillaires", "cosmetic"),
          s("Produits coiffants", "cosmetic"),
        ],
      },
      {
        name: "Parfumerie",
        subcategories: [
          s("Parfums", "fragrance"),
          s("Brumes", "fragrance"),
          s("Déodorants", "fragrance"),
        ],
      },
      {
        name: "Maquillage",
        subcategories: [
          s("Lèvres", "makeup"),
          s("Yeux", "makeup"),
          s("Teint", "makeup"),
          s("Ongles", "makeup"),
        ],
      },
      {
        name: "Accessoires beauté",
        subcategories: [
          s("Miroirs", "beauty_accessory"),
          s("Trousses beauté", "beauty_accessory"),
          s("Accessoires de soin", "beauty_accessory"),
        ],
      },
    ],
  },

  {
    name: "Sport & loisirs",
    description:
      "Football, fitness, jeux de société et loisirs pour toute la famille.",
    icon: "trophy",
    categories: [
      {
        name: "Football",
        subcategories: [
          s("Ballons", "sports_equipment"),
          s("Chaussures", "footwear"),
          s("Maillots", "sports_apparel"),
          s("Chaussettes", "sports_apparel"),
          s("Accessoires", "sports_equipment"),
        ],
      },
      {
        name: "Sports & fitness",
        subcategories: [
          s("Équipements", "sports_equipment"),
          s("Accessoires", "sports_equipment"),
          s("Vêtements", "sports_apparel"),
        ],
      },
      {
        name: "Jeux de société",
        subcategories: [
          s("Échecs", "board_game"),
          s("Ludo", "board_game"),
          s("Jeux de cartes", "board_game"),
          s("Jeux de stratégie", "board_game"),
          s("Jeux familiaux", "board_game"),
          s("Autres jeux de société", "board_game"),
        ],
      },
      {
        name: "Jeux & loisirs",
        subcategories: [
          s("Puzzles", "toy"),
          s("Jeux éducatifs", "toy"),
          s("Jeux pour enfants", "toy"),
          s("Jeux d'extérieur", "toy"),
        ],
      },
      {
        name: "Accessoires de loisirs",
        subcategories: [s("Accessoires de loisirs", "generic")],
      },
    ],
  },
];
