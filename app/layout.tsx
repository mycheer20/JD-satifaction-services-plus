import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/features/cart/cart-context";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[color:var(--color-background)] text-[color:var(--color-foreground)]">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
