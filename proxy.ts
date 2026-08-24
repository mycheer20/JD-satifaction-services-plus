import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { DESIGN_PREVIEW_COOKIE } from "@/lib/design/preview";

/**
 * Refreshes the Supabase session cookie on every navigation and keeps
 * unauthenticated visitors out of /admin and /compte.
 *
 * This is a convenience layer, not the security boundary: authorization is
 * re-checked server-side in `features/auth/guards.ts` and enforced by row level
 * security in the database.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const isProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/compte") ||
    pathname.startsWith("/design");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  const preview = request.nextUrl.searchParams.get("preview");
  if (preview === "draft") {
    response.cookies.set(DESIGN_PREVIEW_COOKIE, "draft", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 4,
    });
  } else if (preview === "live" || preview === "off") {
    response.cookies.set(DESIGN_PREVIEW_COOKIE, "", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except static assets, image optimisation and files with an
    // extension. Without this, a redirect would also swallow CSS and images.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
