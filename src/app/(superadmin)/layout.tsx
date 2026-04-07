import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

async function SuperAdminLogout() {
  return null; // géré côté client via le bouton
}

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  // Double vérification serveur (le middleware couvre déjà)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== "admin@admin.com") redirect("/login");

  return (
    <div className="min-h-dvh flex" style={{ fontFamily: "var(--font-body)", backgroundColor: "#F6F4F2" }}>

      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 z-40 bg-white border-r border-[#EDE8E5]">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[#EDE8E5]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1C1B1B]">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 17 }}>shield_person</span>
          </div>
          <div>
            <p className="font-black text-[13px] leading-tight" style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}>
              Super Admin
            </p>
            <p className="text-[10px] font-medium" style={{ color: "#A09088" }}>admin@admin.com</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-2" style={{ color: "#A09088" }}>
            Navigation
          </p>
          <Link
            href="/superadmin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold bg-[#1C1B1B] text-white"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 19 }}>store</span>
            Restaurants
          </Link>
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 border-t border-[#EDE8E5] pt-3">
          <SuperAdminLogoutButton />
        </div>
      </aside>

      {/* ── Top bar (mobile) ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#EDE8E5] flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C1B1B]">
            <span className="material-symbols-outlined text-white" style={{ fontSize: 15 }}>shield_person</span>
          </div>
          <span className="font-black text-sm" style={{ fontFamily: "var(--font-headline)" }}>Super Admin</span>
        </div>
        <SuperAdminLogoutButton small />
      </header>

      {/* ── Main ── */}
      <main className="flex-1 pt-14 md:pt-0 md:ml-56">
        <div className="px-5 md:px-8 py-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

/* Bouton déconnexion client */
function SuperAdminLogoutButton({ small }: { small?: boolean }) {
  // Rendu serveur — on utilise un form action
  return (
    <form action="/api/auth/signout" method="post">
      <LogoutBtn small={small} />
    </form>
  );
}

// On délègue au client pour le router.push
import SuperAdminLogoutClient from "@/components/superadmin/LogoutButton";

function LogoutBtn({ small }: { small?: boolean }) {
  return <SuperAdminLogoutClient small={small} />;
}
