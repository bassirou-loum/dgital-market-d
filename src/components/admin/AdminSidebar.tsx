"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "Vue d'ensemble" },
  { href: "/menu-editor", icon: "restaurant_menu", label: "Éditeur de menu" },
  { href: "/qr", icon: "qr_code_2", label: "Générateur QR" },
  { href: "/settings", icon: "settings", label: "Paramètres" },
];

interface AdminSidebarProps {
  restaurantName: string;
  restaurantSlug: string;
}

export default function AdminSidebar({ restaurantName, restaurantSlug }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-40 p-4"
      style={{ backgroundColor: "#f6f3f2" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10 pt-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
          style={{ backgroundColor: "var(--color-primary-container)" }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            restaurant
          </span>
        </div>
        <div>
          <h2
            className="text-lg font-bold leading-none"
            style={{ fontFamily: "var(--font-headline)", color: "#1c1b1b" }}
          >
            {restaurantName}
          </h2>
          <p
            className="text-[10px] uppercase tracking-widest mt-0.5"
            style={{ fontFamily: "var(--font-label)", color: "#5a4138", opacity: 0.6 }}
          >
            Admin Console
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all"
              style={{
                borderRadius: isActive ? "0 9999px 9999px 0" : "0",
                backgroundColor: isActive ? "rgba(158, 61, 0, 0.1)" : "transparent",
                color: isActive ? "var(--color-primary)" : "#5a4138",
                fontFamily: "var(--font-body)",
                fontWeight: isActive ? 700 : 500,
                transform: isActive ? "none" : undefined,
              }}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto space-y-3 pb-4">
        <Link
          href={`/menu/${restaurantSlug}`}
          target="_blank"
          className="block w-full py-3 px-4 rounded-full text-white text-sm font-bold text-center transition-all hover:brightness-110 active:scale-95"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
            fontFamily: "var(--font-label)",
          }}
        >
          Aperçu du menu
        </Link>
        <Link
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium"
          style={{ color: "#5a4138", fontFamily: "var(--font-body)" }}
        >
          <span className="material-symbols-outlined">help_outline</span>
          Centre d&apos;aide
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium w-full transition-opacity hover:opacity-70"
          style={{ color: "var(--color-error)", fontFamily: "var(--font-body)" }}
        >
          <span className="material-symbols-outlined">logout</span>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
