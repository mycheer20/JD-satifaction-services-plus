export const MOBILE_MONEY_PROVIDERS = ["moncash", "natcash"] as const;

export type MobileMoneyProvider = (typeof MOBILE_MONEY_PROVIDERS)[number];

export function isMobileMoneyProvider(provider: string): provider is MobileMoneyProvider {
  return MOBILE_MONEY_PROVIDERS.includes(provider as MobileMoneyProvider);
}

export const PAYMENT_PROOF_MAX_FILES = 5;
export const PAYMENT_PROOF_MAX_BYTES = 5 * 1024 * 1024;
