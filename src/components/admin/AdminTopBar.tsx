"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard":   { title: "Vue d'ensemble",  sub: "Statistiques et activité récente" },
  "/menu-editor": { title: "Éditeur de menu", sub: "Gérez vos catégories et vos plats" },
  "/qr":          { title: "QR Code",         sub: "Téléchargez et partagez votre code" },
  "/settings":    { title: "Paramètres",      sub: "Profil, plan et préférences" },
};

export default function AdminTopBar({
  logoUrl,
  restaurantName,
  restaurantSlug,
}: {
  logoUrl?: string | null;
  restaurantName?: string;
  restaurantSlug?: string;
}) {
  const pathname = usePathname();
  const router   = useRouter();
  const page     = PAGE_TITLES[pathname] ?? { title: "Admin", sub: "" };

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si clic extérieur
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6 md:px-8 h-16"
      style={{
        left: 0,
        backgroundColor: "#fff",
        borderBottom: "1px solid #EDE8E5",
        paddingLeft: undefined,
      }}
    >
      {/* Left — page title (desktop: offset by sidebar) */}
      <div className="flex items-center gap-3 md:pl-60">
        <div className="pl-6 hidden md:block">
          <h1
            className="text-[15px] font-black leading-tight"
            style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
          >
            {page.title}
          </h1>
          {page.sub && (
            <p className="text-xs mt-0.5" style={{ color: "#A09088" }}>{page.sub}</p>
          )}
        </div>
        {/* Mobile: logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden"
            style={{ backgroundColor: logoUrl ? "#F6F4F2" : "var(--color-primary)" }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={restaurantName ?? ""} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>restaurant</span>
            )}
          </div>
          <span
            className="font-black text-sm tracking-tight"
            style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
          >
            {restaurantName ?? "Digital Maître D'"}
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[#F6F4F2]"
          style={{ color: "#6B5B53" }}
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>notifications</span>
        </button>

        {/* Profile button + dropdown (mobile only) */}
        <div className="relative md:hidden" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[#F6F4F2]"
            style={{ color: open ? "var(--color-primary)" : "#6B5B53" }}
            aria-label="Compte"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>account_circle</span>
          </button>

          {open && (
            <div
              className="absolute right-0 top-11 w-52 rounded-2xl shadow-lg overflow-hidden z-50"
              style={{ backgroundColor: "#fff", border: "1px solid #EDE8E5" }}
            >
              {restaurantSlug && (
                <Link
                  href={`/menu/${restaurantSlug}`}
                  target="_blank"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold hover:bg-[#FAFAF9] transition-colors"
                  style={{ color: "#1C1B1B" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--color-primary)" }}>open_in_new</span>
                  Voir mon menu
                </Link>
              )}
              <div style={{ height: "1px", backgroundColor: "#EDE8E5" }} />
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold w-full hover:bg-red-50 transition-colors"
                style={{ color: "#BA1A1A" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                Se déconnecter
              </button>
            </div>
          )}
        </div>

        {/* Profile button (desktop only — no dropdown needed, sidebar handles it) */}
        <button
          className="hidden md:flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[#F6F4F2]"
          style={{ color: "#6B5B53" }}
          aria-label="Profil"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>account_circle</span>
        </button>
      </div>
    </header>
  );
}
