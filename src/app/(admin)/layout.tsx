import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import { getMyRestaurant } from "@/lib/dal/restaurant";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const restaurant = await getMyRestaurant();

  return (
    <div style={{ backgroundColor: "var(--color-background)", minHeight: "100dvh" }}>
      <AdminTopBar />
      <AdminSidebar restaurantName={restaurant.name} restaurantSlug={restaurant.slug} />
      <main className="pt-20 pb-20 md:pb-8 px-4 md:pl-72 md:pr-8 max-w-screen-2xl mx-auto">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8 z-50 rounded-t-3xl"
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(24px)",
          boxShadow: "0 -10px 40px rgba(90,65,56,0.08)",
        }}
      >
        {[
          { icon: "dashboard", label: "Accueil", href: "/dashboard" },
          { icon: "restaurant_menu", label: "Menu", href: "/menu-editor" },
          { icon: "qr_code_2", label: "QR Code", href: "/qr" },
          { icon: "person", label: "Profil", href: "#" },
        ].map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="flex flex-col items-center justify-center text-stone-400 transition-transform active:scale-90"
          >
            <span className="material-symbols-outlined mb-1">{item.icon}</span>
            <span
              className="text-[10px] uppercase tracking-widest font-bold"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {item.label}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}
