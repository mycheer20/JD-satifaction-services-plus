import { NextResponse } from "next/server";
import {
  listActiveCities,
  listActiveCommunes,
  listActiveCountries,
  listActiveDepartments,
  listActiveZones,
} from "@/features/delivery/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const parentId = searchParams.get("parentId");

  try {
    switch (type) {
      case "countries":
        return NextResponse.json(await listActiveCountries());
      case "departments":
        if (!parentId) return NextResponse.json({ error: "parentId requis" }, { status: 400 });
        return NextResponse.json(await listActiveDepartments(parentId));
      case "communes":
        if (!parentId) return NextResponse.json({ error: "parentId requis" }, { status: 400 });
        return NextResponse.json(await listActiveCommunes(parentId));
      case "cities":
        if (!parentId) return NextResponse.json({ error: "parentId requis" }, { status: 400 });
        return NextResponse.json(await listActiveCities(parentId));
      case "zones":
        if (!parentId) return NextResponse.json({ error: "parentId requis" }, { status: 400 });
        return NextResponse.json(await listActiveZones(parentId));
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
