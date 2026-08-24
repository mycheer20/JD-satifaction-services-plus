import type { Metadata } from "next";
import { DesignPageHeader } from "@/components/design/design-page-header";
import { MotionSettingsForm } from "@/components/design/motion-settings-form";
import {
  getDraftMotionSettings,
  getPublishedMotionSettingsState,
} from "@/features/design/queries";

export const metadata: Metadata = {
  title: "Animations",
  robots: { index: false },
};

export default async function DesignAnimationsPage() {
  const [draftSettings, publishedState] = await Promise.all([
    getDraftMotionSettings(),
    getPublishedMotionSettingsState(),
  ]);

  return (
    <div className="space-y-8">
      <DesignPageHeader
        eyebrow="Design du site"
        title="Animations & interactions"
        description="Ajustez les transitions, survols et apparitions au défilement. Sans publication, le site conserve les animations codées par défaut dans l'application."
      />

      <MotionSettingsForm
        draftSettings={draftSettings}
        publishedSettings={publishedState.settings}
        hasPublishedOverride={publishedState.hasPublishedOverride}
      />
    </div>
  );
}
