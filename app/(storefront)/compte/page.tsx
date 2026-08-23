import type { Metadata } from "next";
import { requireUser } from "@/features/auth/guards";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/auth/auth-forms";
import { PageTitle, SectionLabel } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Mon profil",
  robots: { index: false },
};

export default async function AccountPage() {
  const user = await requireUser();
  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("full_name, phone, address")
    .eq("id", user.id)
    .maybeSingle();

  const address = (profile?.address ?? {}) as Record<string, string>;

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Profil</SectionLabel>
        <PageTitle
          title="Mes informations"
          description="Ces informations pré-remplissent le formulaire de commande."
          className="mb-0"
        />
      </div>

      <ProfileForm
        defaults={{
          fullName: profile?.full_name ?? "",
          phone: profile?.phone ?? "",
          addressLine1: address.line1 ?? "",
          city: address.city ?? "",
          region: address.region ?? "",
          postalCode: address.postal_code ?? "",
        }}
      />
    </div>
  );
}
