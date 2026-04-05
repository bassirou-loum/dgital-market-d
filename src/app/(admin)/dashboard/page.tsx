import type { Metadata } from "next";
import Link from "next/link";
import { getMyRestaurant } from "@/lib/dal/restaurant";
import { getDashboardStats } from "@/lib/dal/menu";

export const metadata: Metadata = { title: "Dashboard — Digital Maître D'" };

const QUICK_ACTIONS = [
  { icon: "create_new_folder", label: "Créer une catégorie", sub: "Grouper les plats par type", href: "/menu-editor", accent: true },
  { icon: "add_circle", label: "Ajouter un plat", sub: "Mettre à jour les offres", href: "/menu-editor", accent: true },
  { icon: "download", label: "Télécharger le QR code", sub: "Imprimer pour les tables", href: "/qr", accent: false },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  true:  { bg: "#dcfce7", text: "#15803d", label: "En ligne" },
  false: { bg: "#fff7ed", text: "#c2410c", label: "Épuisé" },
};

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

export default async function DashboardPage() {
  const restaurant = await getMyRestaurant();
  const stats = await getDashboardStats(restaurant.id);

  const planLabel: Record<string, string> = {
    gratuit: "Gratuit",
    standard: "Standard",
    premium: "Premium",
  };

  return (
    <div className="py-8">
      {/* Welcome */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1
            className="text-4xl md:text-5xl font-black tracking-tight mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
          >
            {getGreeting()}, Chef.
          </h1>
          <p style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
            Bienvenue sur votre espace {restaurant.name}.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-white self-start"
          style={{ backgroundColor: "var(--color-tertiary-container)", fontFamily: "var(--font-label)" }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          Plan {planLabel[restaurant.plan]}
        </div>
      </header>

      {/* Stats Bento */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div
          className="md:col-span-2 p-8 rounded-3xl relative overflow-hidden group"
          style={{ backgroundColor: "var(--color-surface-container-lowest)", boxShadow: "0 20px 40px rgba(90,65,56,0.04)" }}
        >
          <div className="relative z-10">
            <p className="text-sm font-bold tracking-widest uppercase mb-1" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}>
              Vues totales du menu
            </p>
            <h3 className="text-6xl font-black leading-none mb-4" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
              {stats.totalViews.toLocaleString("fr-FR")}
            </h3>
            {stats.weekGrowth !== 0 && (
              <div className={`flex items-center gap-2 font-bold text-sm ${stats.weekGrowth >= 0 ? "text-green-600" : "text-red-500"}`}>
                <span className="material-symbols-outlined text-sm">
                  {stats.weekGrowth >= 0 ? "trending_up" : "trending_down"}
                </span>
                {stats.weekGrowth >= 0 ? "+" : ""}{stats.weekGrowth}% cette semaine
              </div>
            )}
          </div>
          <span
            className="material-symbols-outlined absolute -right-10 -bottom-10 text-[200px] opacity-5 group-hover:scale-110 transition-transform duration-700"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            analytics
          </span>
        </div>

        <div className="p-8 rounded-3xl flex flex-col justify-between" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
          <div>
            <p className="text-sm font-bold tracking-widest uppercase mb-1" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}>
              Plan actif
            </p>
            <h3 className="text-3xl font-bold" style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}>
              {planLabel[restaurant.plan]}
            </h3>
          </div>
          <Link
            href="/settings"
            className="text-sm font-bold pb-0.5 self-start mt-4 border-b transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)", borderColor: "var(--color-primary)", fontFamily: "var(--font-body)" }}
          >
            Gérer l&apos;abonnement
          </Link>
        </div>

        <div className="p-8 rounded-3xl flex flex-col justify-between" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
          <div>
            <p className="text-sm font-bold tracking-widest uppercase mb-1" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}>
              Scans aujourd&apos;hui
            </p>
            <h3 className="text-4xl font-black" style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}>
              {stats.scansToday.toLocaleString("fr-FR")}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-sm mt-4" style={{ color: "var(--color-on-surface-variant)" }}>
            <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
            Via QR code
          </div>
        </div>
      </section>

      {/* Quick Actions + Top items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-1">
          <h4 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-headline)" }}>
            Actions rapides
            <div className="h-px flex-1 ml-2" style={{ backgroundColor: "rgba(227,191,178,0.3)" }} />
          </h4>
          <div className="space-y-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="w-full flex items-center justify-between p-5 rounded-2xl group transition-all active:scale-[0.98] block"
                style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: action.accent ? "#fff0e6" : "#f5f5f4", color: action.accent ? "var(--color-primary)" : "var(--color-secondary)" }}
                  >
                    <span className="material-symbols-outlined">{action.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "var(--color-on-surface)", fontFamily: "var(--font-body)" }}>{action.label}</p>
                    <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>{action.sub}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined" style={{ color: "var(--color-outline)" }}>chevron_right</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h4 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-headline)" }}>
            Plats les plus vus
            <div className="h-px flex-1 ml-2" style={{ backgroundColor: "rgba(227,191,178,0.3)" }} />
          </h4>
          {stats.topItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.topItems.map((dish) => (
                <div key={dish.id} className="p-4 rounded-3xl flex gap-4 items-center" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
                  {dish.image_url ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                      <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                      <span className="material-symbols-outlined opacity-30">restaurant</span>
                    </div>
                  )}
                  <div>
                    <h5 className="font-bold text-lg leading-tight" style={{ fontFamily: "var(--font-body)" }}>{dish.name}</h5>
                    <p className="font-bold mt-1" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
                      {dish.price.toLocaleString("fr-FR")} FCFA
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[10px] font-bold" style={{ color: "var(--color-on-surface-variant)" }}>
                      <span className="material-symbols-outlined text-xs">visibility</span>
                      {dish.views} vues cette semaine
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl p-12 text-center" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
              <span className="material-symbols-outlined text-5xl opacity-20">visibility_off</span>
              <p className="mt-3 font-medium" style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
                Pas encore de données de vues.<br />Partagez votre QR code pour commencer.
              </p>
              <Link
                href="/qr"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))" }}
              >
                <span className="material-symbols-outlined text-sm">qr_code_2</span>
                Générer mon QR code
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Updates */}
      <section className="mt-12">
        <div className="rounded-3xl overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.4)", backdropFilter: "blur(8px)" }}>
          <div className="px-8 py-6 flex justify-between items-center" style={{ borderBottom: "1px solid rgba(227,191,178,0.15)" }}>
            <h4 className="text-xl font-bold" style={{ fontFamily: "var(--font-headline)" }}>Mises à jour récentes</h4>
            <Link href="/menu-editor" className="text-sm font-bold transition-colors hover:text-primary" style={{ color: "var(--color-on-surface-variant)" }}>
              Voir l&apos;éditeur
            </Link>
          </div>
          {stats.recentItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {["Nom du plat", "Catégorie", "Statut", "Modifié"].map((h) => (
                      <th key={h} className="px-8 py-4 text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentItems.map((item) => {
                    const s = STATUS_STYLES[String(item.available)];
                    return (
                      <tr key={item.id} className="group transition-colors hover:bg-stone-100/30" style={{ borderTop: "1px solid rgba(227,191,178,0.1)" }}>
                        <td className="px-8 py-5">
                          <span className="font-bold text-sm" style={{ fontFamily: "var(--font-body)" }}>{item.name}</span>
                        </td>
                        <td className="px-8 py-5 text-sm font-medium" style={{ color: "var(--color-on-surface-variant)" }}>{item.categoryName}</td>
                        <td className="px-8 py-5">
                          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: s.bg, color: s.text }}>
                            {s.label}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-sm" style={{ color: "var(--color-on-surface-variant)" }}>{timeAgo(item.updatedAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-8 py-12 text-center" style={{ color: "var(--color-on-surface-variant)" }}>
              <p style={{ fontFamily: "var(--font-body)" }}>Aucun plat encore. <Link href="/menu-editor" className="font-bold underline" style={{ color: "var(--color-primary)" }}>Ajoutez votre premier plat.</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* FAB */}
      <Link
        href="/menu-editor"
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full text-white shadow-xl flex items-center justify-center group active:scale-95 transition-all z-40"
        style={{ backgroundColor: "var(--color-primary)" }}
        aria-label="Ajouter un plat"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
        <span className="absolute right-full mr-4 text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ backgroundColor: "var(--color-on-surface)", color: "var(--color-surface)" }}>
          Ajouter un plat
        </span>
      </Link>
    </div>
  );
}
