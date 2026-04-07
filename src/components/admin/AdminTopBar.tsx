"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard":   { title: "Vue d'ensemble",  sub: "Statistiques et activité récente" },
  "/menu-editor": { title: "Éditeur de menu", sub: "Gérez vos catégories et vos plats" },
  "/qr":          { title: "QR Code",         sub: "Téléchargez et partagez votre code" },
  "/settings":    { title: "Paramètres",      sub: "Profil, plan et préférences" },
};

export default function AdminTopBar() {
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] ?? { title: "Admin", sub: "" };

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
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>restaurant</span>
          </div>
          <span
            className="font-black text-sm tracking-tight"
            style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
          >
            Digital Maître D&apos;
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
        <button
          className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-[#F6F4F2]"
          style={{ color: "#6B5B53" }}
          aria-label="Profil"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>account_circle</span>
        </button>
      </div>
    </header>
  );
}
