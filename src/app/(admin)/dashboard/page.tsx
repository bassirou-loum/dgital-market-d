import type { Metadata } from "next";
import Link from "next/link";
import { getMyRestaurant } from "@/lib/dal/restaurant";
import { getDashboardStats } from "@/lib/dal/menu";

export const metadata: Metadata = { title: "Dashboard — Lëkkal Digital" };

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

const PLAN_LABEL: Record<string, string> = {
  gratuit: "Gratuit",
  standard: "Standard",
  premium: "Premium",
};

const PLAN_COLOR: Record<string, { bg: string; text: string }> = {
  gratuit:  { bg: "#F0EDEC", text: "#6B5B53" },
  standard: { bg: "#FFF0E8", text: "var(--color-primary)" },
  premium:  { bg: "#1C1B1B", text: "#FFB595" },
};

const QUICK_ACTIONS = [
  { icon: "add_circle",       label: "Ajouter un plat",      sub: "Enrichir votre carte",         href: "/menu-editor" },
  { icon: "create_new_folder",label: "Nouvelle catégorie",    sub: "Organiser votre menu",          href: "/menu-editor" },
  { icon: "qr_code_2",        label: "Télécharger le QR",     sub: "Imprimer pour les tables",      href: "/qr" },
];

export default async function DashboardPage() {
  const restaurant = await getMyRestaurant();
  const stats = await getDashboardStats(restaurant.id);

  const planBadge = PLAN_COLOR[restaurant.plan] ?? PLAN_COLOR.gratuit;

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium mb-1" style={{ color: "#A09088" }}>
            {getGreeting()} 👋
          </p>
          <h1
            className="text-3xl md:text-4xl font-black tracking-tight"
            style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
          >
            {restaurant.name}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ backgroundColor: planBadge.bg, color: planBadge.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: planBadge.text, opacity: 0.7 }} />
            Plan {PLAN_LABEL[restaurant.plan]}
          </span>
          <Link
            href={`/menu/${restaurant.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors hover:bg-white"
            style={{ borderColor: "#EDE8E5", color: "#6B5B53", backgroundColor: "#fff" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>open_in_new</span>
            Voir le menu
          </Link>
        </div>
      </header>

      {/* ── Stats ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total views — large card */}
        <div
          className="col-span-2 bg-white rounded-2xl border border-[#EDE8E5] p-6"
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#A09088" }}>
            Vues totales du menu
          </p>
          <p
            className="text-5xl font-black leading-none"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
          >
            {stats.totalViews.toLocaleString("fr-FR")}
          </p>
          {stats.weekGrowth !== 0 && (
            <div className={`flex items-center gap-1 mt-3 text-sm font-semibold ${stats.weekGrowth >= 0 ? "text-green-600" : "text-red-500"}`}>
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                {stats.weekGrowth >= 0 ? "trending_up" : "trending_down"}
              </span>
              {stats.weekGrowth >= 0 ? "+" : ""}{stats.weekGrowth}% cette semaine
            </div>
          )}
        </div>

        {/* Scans today */}
        <div className="bg-white rounded-2xl border border-[#EDE8E5] p-6 flex flex-col justify-between">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#A09088" }}>
            Scans aujourd&apos;hui
          </p>
          <p
            className="text-4xl font-black"
            style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
          >
            {stats.scansToday.toLocaleString("fr-FR")}
          </p>
          <div className="flex items-center gap-1 mt-3 text-xs" style={{ color: "#A09088" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>qr_code_scanner</span>
            Via QR code
          </div>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-2xl border border-[#EDE8E5] p-6 flex flex-col justify-between">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#A09088" }}>
            Abonnement
          </p>
          <p
            className="text-2xl font-black"
            style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
          >
            {PLAN_LABEL[restaurant.plan]}
          </p>
          <Link
            href="/settings"
            className="text-xs font-bold mt-3 hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-primary)" }}
          >
            Gérer →
          </Link>
        </div>
      </section>

      {/* ── Content grid ── */}
      <div className="grid md:grid-cols-3 gap-6 items-start">

        {/* Quick actions */}
        <div className="md:col-span-1 bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EDE8E5]">
            <h2 className="text-sm font-black" style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}>
              Actions rapides
            </h2>
          </div>
          <div className="divide-y divide-[#EDE8E5]">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 px-5 py-4 hover:bg-[#FAFAF9] transition-colors group"
              >
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "#FFF0E8" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--color-primary)" }}>
                    {action.icon}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1C1B1B] truncate">{action.label}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "#A09088" }}>{action.sub}</p>
                </div>
                <span className="material-symbols-outlined text-[#C0B4AE] group-hover:text-[#6B5B53] transition-colors" style={{ fontSize: 18 }}>
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Top dishes */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EDE8E5] flex items-center justify-between">
            <h2 className="text-sm font-black" style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}>
              Plats les plus vus
            </h2>
            <Link href="/menu-editor" className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--color-primary)" }}>
              Gérer le menu
            </Link>
          </div>

          {stats.topItems.length > 0 ? (
            <div className="divide-y divide-[#EDE8E5]">
              {stats.topItems.map((dish, i) => (
                <div key={dish.id} className="flex items-center gap-4 px-5 py-4">
                  {/* Rank */}
                  <span
                    className="text-sm font-black w-5 text-center flex-shrink-0"
                    style={{ color: i === 0 ? "var(--color-primary)" : "#C0B4AE" }}
                  >
                    {i + 1}
                  </span>
                  {/* Image */}
                  {dish.image_url ? (
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: "#F6F4F2" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: "#C0B4AE" }}>restaurant</span>
                    </div>
                  )}
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#1C1B1B] truncate">{dish.name}</p>
                    <p className="text-xs mt-0.5 font-semibold" style={{ color: "var(--color-primary)" }}>
                      {dish.price.toLocaleString("fr-FR")} FCFA
                    </p>
                  </div>
                  {/* Views */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-[#1C1B1B]">{dish.views}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: "#A09088" }}>vues / sem.</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-12 text-center">
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#E0D9D5" }}>visibility_off</span>
              <p className="mt-3 text-sm font-medium" style={{ color: "#A09088" }}>
                Pas encore de données.
              </p>
              <Link
                href="/qr"
                className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-primary)" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>qr_code_2</span>
                Générer mon QR code
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent updates table ── */}
      <section className="bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EDE8E5] flex items-center justify-between">
          <h2 className="text-sm font-black" style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}>
            Mises à jour récentes
          </h2>
          <Link href="/menu-editor" className="text-xs font-semibold hover:opacity-70 transition-opacity" style={{ color: "var(--color-primary)" }}>
            Voir l&apos;éditeur
          </Link>
        </div>

        {stats.recentItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr style={{ borderBottom: "1px solid #EDE8E5" }}>
                  {["Plat", "Catégorie", "Statut", "Modifié"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "#A09088" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recentItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAFAF9] transition-colors"
                    style={{ borderBottom: "1px solid #EDE8E5" }}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-[#1C1B1B]">{item.name}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "#6B5B53" }}>{item.categoryName}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={
                          item.available
                            ? { backgroundColor: "#F0FDF4", color: "#15803D" }
                            : { backgroundColor: "#FFF7ED", color: "#C2410C" }
                        }
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full inline-block"
                          style={{ backgroundColor: item.available ? "#15803D" : "#C2410C" }}
                        />
                        {item.available ? "En ligne" : "Épuisé"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ color: "#A09088" }}>{timeAgo(item.updatedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-10 text-center">
            <p className="text-sm" style={{ color: "#A09088" }}>
              Aucun plat encore.{" "}
              <Link href="/menu-editor" className="font-bold hover:opacity-70 transition-opacity" style={{ color: "var(--color-primary)" }}>
                Ajoutez votre premier plat.
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* ── FAB mobile ── */}
      <Link
        href="/menu-editor"
        className="fixed bottom-24 right-5 md:hidden w-13 h-13 rounded-full flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform z-40"
        style={{ backgroundColor: "var(--color-primary)", width: 52, height: 52 }}
        aria-label="Ajouter un plat"
      >
        <span className="material-symbols-outlined">add</span>
      </Link>

    </div>
  );
}
