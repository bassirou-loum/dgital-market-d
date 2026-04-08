"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/dashboard",   icon: "grid_view",        label: "Vue d'ensemble", employeeOnly: false },
  { href: "/menu-editor", icon: "restaurant_menu",   label: "Éditeur de menu", employeeOnly: true },
  { href: "/qr",          icon: "qr_code_2",         label: "QR Code", employeeOnly: true },
  { href: "/settings",    icon: "settings",          label: "Paramètres", employeeOnly: false },
];

export default function AdminSidebar({
  restaurantName,
  restaurantSlug,
  isEmployee = false,
}: {
  restaurantName: string;
  restaurantSlug: string;
  isEmployee?: boolean;
}) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 z-40"
      style={{ backgroundColor: "#fff", borderRight: "1px solid #EDE8E5" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-[#EDE8E5] flex-shrink-0">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>restaurant</span>
        </div>
        <div className="min-w-0">
          <p
            className="font-black text-[13px] leading-tight truncate"
            style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
          >
            {restaurantName}
          </p>
          <p className="text-[10px] font-medium mt-0.5" style={{ color: "#A09088" }}>
            Espace admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest px-3 pb-2 pt-1" style={{ color: "#A09088" }}>
          Navigation
        </p>
        {NAV.filter((item) => !isEmployee || item.employeeOnly).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "#FFF0E8" : "transparent",
                color: active ? "var(--color-primary)" : "#6B5B53",
                fontWeight: active ? 700 : 500,
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, color: active ? "var(--color-primary)" : "#A09088" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 space-y-1 border-t border-[#EDE8E5] pt-3 flex-shrink-0">
        <Link
          href={`/menu/${restaurantSlug}`}
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 17 }}>open_in_new</span>
          Voir mon menu
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium w-full rounded-xl transition-colors hover:bg-red-50"
          style={{ color: "#BA1A1A" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>logout</span>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
