import type { Metadata } from "next";
import { AboutPageView } from "@/components/storefront/about-page-view";
import { publicEnv } from "@/lib/public-env";

export const metadata: Metadata = {
  title: "À propos",
  description: `Découvrez ${publicEnv.storeName} : histoire, mission, valeurs et présence en Haïti.`,
};

export default function AboutPage() {
  return <AboutPageView />;
}
