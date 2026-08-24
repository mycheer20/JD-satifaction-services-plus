import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DesignThemeStyles } from "@/components/design/design-theme-styles";
import { DesignMotionStyles } from "@/components/design/design-motion-styles";
import { CartProvider } from "@/features/cart/cart-context";
import {
  getPublishedMotionSettingsState,
  getPublishedThemeTokensState,
} from "@/features/design/queries";
import { motionSettingsToDataAttributes } from "@/lib/design/motion-css";
import { publicEnv } from "@/lib/public-env";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: `${publicEnv.storeName} — Informatique, fournitures, gaming et plus`,
    template: `%s · ${publicEnv.storeName}`,
  },
  description:
    "Boutique en ligne multi-catégories : informatique, fournitures scolaires, gaming, bureau, maison, cosmétiques, sport et services de design sur mesure.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [themeState, motionState] = await Promise.all([
    getPublishedThemeTokensState(),
    getPublishedMotionSettingsState(),
  ]);

  const motionAttrs = motionSettingsToDataAttributes(motionState.settings);

  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      {...motionAttrs}
    >
      <body className="flex min-h-full flex-col bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
        {themeState.hasPublishedOverride ? (
          <DesignThemeStyles tokens={themeState.tokens} />
        ) : null}
        {motionState.hasPublishedOverride ? (
          <DesignMotionStyles settings={motionState.settings} />
        ) : null}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
