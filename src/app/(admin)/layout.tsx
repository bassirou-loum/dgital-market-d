import Link from "next/link";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getMyRestaurant, isTeamMember } from "@/lib/dal/restaurant";

const MOBILE_NAV_OWNER = [
  { icon: "grid_view",       label: "Accueil", href: "/dashboard" },
  { icon: "restaurant_menu", label: "Menu",    href: "/menu-editor" },
  { icon: "qr_code_2",       label: "QR Code", href: "/qr" },
  { icon: "settings",        label: "Réglages", href: "/settings" },
];

const MOBILE_NAV_EMPLOYEE = [
  { icon: "restaurant_menu", label: "Menu",    href: "/menu-editor" },
  { icon: "qr_code_2",       label: "QR Code", href: "/qr" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [restaurant, teamMember] = await Promise.all([getMyRestaurant(), isTeamMember()]);

  // Les membres d'équipe ont accès uniquement à /menu-editor
  if (!teamMember) {
    // Vérifier l'abonnement seulement pour les propriétaires
    const realStatus = (() => {
      const s = restaurant.subscription_status;
      if (s === "none") return "none";
      if (restaurant.subscription_end && new Date(restaurant.subscription_end) < new Date()) return "expired";
      return s;
    })();
    if (realStatus === "none" || realStatus === "expired") redirect("/en-attente");
  }

  return (
    <div className="min-h-dvh" style={{ backgroundColor: "#F6F4F2", fontFamily: "var(--font-body)" }}>
      <AdminTopBar logoUrl={restaurant.logo_url} restaurantName={restaurant.name} restaurantSlug={restaurant.slug} />
      <AdminSidebar restaurantName={restaurant.name} restaurantSlug={restaurant.slug} isEmployee={teamMember} logoUrl={restaurant.logo_url} />

      {/* Main content */}
      <main className="pt-16 pb-24 md:pb-8 md:pl-60">
        <div className="px-5 md:px-8 py-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 pt-2 pb-6"
        style={{ backgroundColor: "#fff", borderTop: "1px solid #EDE8E5" }}
      >
        {(teamMember ? MOBILE_NAV_EMPLOYEE : MOBILE_NAV_OWNER).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-xl text-[#A09088] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
