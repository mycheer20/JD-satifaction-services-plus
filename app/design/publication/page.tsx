import type { Metadata } from "next";
import { DesignPageHeader } from "@/components/design/design-page-header";
import { PublicationDashboard } from "@/components/design/publication-dashboard";
import {
  getDesignPendingModules,
  getDesignPublicationHistory,
} from "@/features/design/queries";

export const metadata: Metadata = {
  title: "Publication & aperçu",
  robots: { index: false },
};

export default async function DesignPublicationPage() {
  const [modules, history] = await Promise.all([
    getDesignPendingModules(),
    getDesignPublicationHistory(),
  ]);

  const pendingCount = modules.filter((module) => module.pending).length;

  return (
    <div className="space-y-8">
      <DesignPageHeader
        eyebrow="Design du site"
        title="Publication & aperçu"
        description="Prévisualisez les brouillons sur la boutique réelle, puis publiez l'ensemble des changements en une seule action. L'historique conserve un snapshot à chaque publication."
      />

      <PublicationDashboard
        modules={modules}
        history={history}
        pendingCount={pendingCount}
      />
    </div>
  );
}
