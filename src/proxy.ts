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

  // Routes protégées (admin) — /en-attente est accessible sans abonnement actif
  const adminRoutes = ["/dashboard", "/menu-editor", "/qr", "/settings", "/en-attente"];
  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  // /reset-password nécessite d'être connecté (session via lien email)
  const needsSession = pathname === "/reset-password";

  if ((isAdminRoute || needsSession) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Employés : is_employee dans les metadata → accès /menu-editor uniquement
  const isEmployee = user?.user_metadata?.is_employee === true;
  if (isEmployee && isAdminRoute && !pathname.startsWith("/menu-editor")) {
    return NextResponse.redirect(new URL("/menu-editor", request.url));
  }

  // Si déjà connecté, redirige depuis login/register
  const authOnlyRoutes = ["/login", "/register", "/forgot-password"];
  if (authOnlyRoutes.includes(pathname) && user) {
    if (user.email === "admin@admin.com") return NextResponse.redirect(new URL("/superadmin", request.url));
    if (isEmployee) return NextResponse.redirect(new URL("/menu-editor", request.url));
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|menu/).*)",
  ],
};
