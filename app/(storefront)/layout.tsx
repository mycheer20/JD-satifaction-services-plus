import { Suspense } from "react";
import { DesignPreviewBanner } from "@/components/storefront/design-preview-banner";
import { SiteHeader } from "@/components/storefront/site-header";
import { SiteFooter } from "@/components/storefront/site-footer";

export default function StorefrontLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={null}>
        <DesignPreviewBanner />
      </Suspense>
      <Suspense fallback={<div className="h-32 border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)]" />}>
        <SiteHeader />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Suspense fallback={null}>
        <SiteFooter />
      </Suspense>
    </>
  );
}
