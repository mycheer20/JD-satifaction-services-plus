import { NextResponse } from "next/server";
import { requireStaff } from "@/features/auth/guards";
import { getFieldDefinitionsForSubcategory } from "@/features/catalog/queries";

export async function GET(request: Request) {
  await requireStaff();

  const subcategoryId = new URL(request.url).searchParams.get("subcategoryId");
  if (!subcategoryId) {
    return NextResponse.json([]);
  }

  const definitions = await getFieldDefinitionsForSubcategory(subcategoryId);
  return NextResponse.json(definitions);
}
