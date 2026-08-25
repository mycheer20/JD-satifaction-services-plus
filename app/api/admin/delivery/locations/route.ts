import { NextResponse } from "next/server";
import { assertStaff } from "@/features/auth/guards";
import {
  listCitiesForAdmin,
  listCommunesForAdmin,
  listCountriesForAdmin,
  listDepartmentsForAdmin,
} from "@/features/delivery/queries";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    await assertStaff();
  } catch {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const parentId = searchParams.get("parentId");

  try {
    switch (type) {
      case "countries":
        return NextResponse.json(
          (await listCountriesForAdmin()).map((c) => ({ id: c.id, name: c.name, is_active: c.is_active })),
        );
      case "departments":
        if (!parentId) return NextResponse.json({ error: "parentId requis" }, { status: 400 });
        return NextResponse.json(
          (await listDepartmentsForAdmin(parentId)).map((d) => ({
            id: d.id,
            name: d.name,
            is_active: d.is_active,
          })),
        );
      case "communes":
        if (!parentId) return NextResponse.json({ error: "parentId requis" }, { status: 400 });
        return NextResponse.json(
          (await listCommunesForAdmin(parentId)).map((c) => ({
            id: c.id,
            name: c.name,
            is_active: c.is_active,
          })),
        );
      case "cities":
        if (!parentId) return NextResponse.json({ error: "parentId requis" }, { status: 400 });
        return NextResponse.json(
          (await listCitiesForAdmin(parentId)).map((c) => ({
            id: c.id,
            name: c.name,
            is_active: c.is_active,
          })),
        );
      case "zones":
        if (!parentId) return NextResponse.json({ error: "parentId requis" }, { status: 400 });
        {
          const supabase = await createSupabaseServerClient();
          const { data } = await supabase
            .from("delivery_zones")
            .select("id, name, delivery_fee, currency, is_active")
            .eq("city_id", parentId)
            .order("name");
          return NextResponse.json(data ?? []);
        }
      default:
        return NextResponse.json({ error: "type invalide" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur serveur" },
      { status: 500 },
    );
  }
}
