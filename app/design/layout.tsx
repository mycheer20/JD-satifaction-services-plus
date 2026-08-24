import { requireDesignEditor } from "@/features/design/guards";
import { DesignShell } from "@/components/design/design-shell";

export default async function DesignLayout({ children }: LayoutProps<"/design">) {
  const user = await requireDesignEditor();

  return <DesignShell user={user}>{children}</DesignShell>;
}
