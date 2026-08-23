import { publicEnv } from "@/lib/public-env";

function env(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

/** Coordonnées boutique — variables NEXT_PUBLIC_* (utilisable côté client). */
export const storeContact = {
  name: publicEnv.storeName,
  phone: env("NEXT_PUBLIC_STORE_PHONE", "+509 0000 0000"),
  whatsapp: env("NEXT_PUBLIC_STORE_WHATSAPP"),
  email: env("NEXT_PUBLIC_STORE_EMAIL", "contact@jdsatisfaction.com"),

  pickup: {
    label: env("NEXT_PUBLIC_STORE_PICKUP_LABEL", "Boutique JDSATISFACTION SERVICES PLUS"),
    addressLine1: env("NEXT_PUBLIC_STORE_ADDRESS_LINE1", "Adresse à configurer"),
    addressLine2: env("NEXT_PUBLIC_STORE_ADDRESS_LINE2"),
    city: env("NEXT_PUBLIC_STORE_CITY", ""),
    hours: env("NEXT_PUBLIC_STORE_HOURS", "Lun–Sam : 9h – 18h"),
    mapsUrl: env("NEXT_PUBLIC_STORE_MAPS_URL", "https://maps.google.com"),
  },

  bank: {
    bankName: env("NEXT_PUBLIC_STORE_BANK_NAME", "Banque"),
    accountName: env("NEXT_PUBLIC_STORE_BANK_ACCOUNT_NAME", publicEnv.storeName),
    accountNumber: env("NEXT_PUBLIC_STORE_BANK_ACCOUNT_NUMBER", "—"),
    /** Réservé usage interne — jamais affiché sur le site. */
    iban: env("STORE_BANK_IBAN"),
    swift: env("STORE_BANK_SWIFT"),
  },

  /** Stripe — activation ultérieure. */
  stripe: {
    enabled: env("STRIPE_SECRET_KEY") !== "",
  },

  natcash: {
    walletName: env("NEXT_PUBLIC_STORE_NATCASH_NAME", publicEnv.storeName),
    walletNumber: env("NEXT_PUBLIC_STORE_NATCASH_NUMBER", "—"),
  },

  moncash: {
    walletName: env("NEXT_PUBLIC_STORE_MONCASH_NAME", publicEnv.storeName),
    walletNumber: env("NEXT_PUBLIC_STORE_MONCASH_NUMBER", "—"),
  },
};

export function storeWhatsAppNumber(): string {
  const raw = storeContact.whatsapp || storeContact.phone;
  return raw.replace(/\D/g, "");
}

export function storePhoneHref(): string {
  return `tel:${storeContact.phone.replace(/\s/g, "")}`;
}

export function storeWhatsAppHref(message?: string): string {
  const base = `https://wa.me/${storeWhatsAppNumber()}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export function pickupAddressLines(): string[] {
  const { pickup } = storeContact;
  return [pickup.addressLine1, pickup.addressLine2, pickup.city].filter(Boolean);
}
