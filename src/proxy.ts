import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Routes superadmin
  if (pathname.startsWith("/superadmin")) {
    if (!user || user.email !== "admin@admin.com") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return supabaseResponse;
  }

  // Routes protégées (admin)
  const adminRoutes = ["/dashboard", "/menu-editor", "/qr", "/settings"];
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  // /reset-password nécessite d'être connecté (session via lien email)
  const needsSession = pathname === "/reset-password";

  if ((isAdminRoute || needsSession) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si déjà connecté, redirige depuis login/register
  const authOnlyRoutes = ["/login", "/register", "/forgot-password"];
  if (authOnlyRoutes.includes(pathname) && user) {
    const dest = user.email === "admin@admin.com" ? "/superadmin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|menu/).*)",
  ],
};
