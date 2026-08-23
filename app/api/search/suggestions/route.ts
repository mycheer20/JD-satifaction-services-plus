import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SearchSuggestion } from "@/features/catalog/types";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";

  if (query.length < 2) {
    return Response.json([] satisfies SearchSuggestion[]);
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("search_suggestions", {
    p_query: query,
    p_limit: 10,
  });

  if (error) {
    return Response.json([], { status: 200 });
  }

  return Response.json((Array.isArray(data) ? data : []) as unknown as SearchSuggestion[]);
}
