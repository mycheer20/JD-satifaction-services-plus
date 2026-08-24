import Link from "next/link";
import { requireDesignEditor } from "@/features/design/guards";
import { publicEnv } from "@/lib/public-env";

export default async function DesignLayout({ children }: LayoutProps<"/design">) {
  await requireDesignEditor();

  return (
    <div data-design-panel="true" className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-violet-300">
              Design du site
            </p>
            <p className="text-sm text-slate-400">{publicEnv.storeName}</p>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm">
            <Link href="/design" className="font-medium text-white hover:text-violet-200">
              Dashboard
            </Link>
            <Link href="/design/apparence" className="text-slate-400 hover:text-white">
              Apparence
            </Link>
            <Link href="/" className="text-slate-400 hover:text-white" target="_blank">
              Voir le site
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
