import type { Metadata } from "next";
import { getAllRestaurants, getSuperAdminStats } from "@/lib/dal/superadmin";
import RestaurantsTable from "@/components/superadmin/RestaurantsTable";

export const metadata: Metadata = { title: "Super Admin — Digital Maître D'" };
export const dynamic = "force-dynamic";

const STATUS_META = {
  active:  { label: "Actif",        bg: "#F0FDF4", text: "#15803D", dot: "#22C55E" },
  trial:   { label: "Essai",        bg: "#FFF7ED", text: "#C2410C", dot: "#F97316" },
  expired: { label: "Expiré",       bg: "#FFF0EE", text: "#BA1A1A", dot: "#EF4444" },
  none:    { label: "Sans abonnement", bg: "#F6F4F2", text: "#6B5B53", dot: "#A09088" },
};

export default async function SuperAdminPage() {
  const [restaurants, stats] = await Promise.all([
    getAllRestaurants(),
    getSuperAdminStats(),
  ]);

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#A09088" }}>
          Super Admin
        </p>
        <h1
          className="text-3xl font-black text-[#1C1B1B]"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Restaurants inscrits
        </h1>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",          value: stats.total,   bg: "#F6F4F2", text: "#1C1B1B" },
          { label: "Abonnés actifs", value: stats.active,  bg: "#F0FDF4", text: "#15803D" },
          { label: "En essai",       value: stats.trial,   bg: "#FFF7ED", text: "#C2410C" },
          { label: "Expirés",        value: stats.expired, bg: "#FFF0EE", text: "#BA1A1A" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-[#EDE8E5] px-5 py-4"
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#A09088" }}>
              {s.label}
            </p>
            <p
              className="text-4xl font-black"
              style={{ fontFamily: "var(--font-headline)", color: s.text }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EDE8E5] flex items-center justify-between">
          <h2 className="text-sm font-black text-[#1C1B1B]" style={{ fontFamily: "var(--font-headline)" }}>
            Liste des restaurants
          </h2>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#F0EDEC]" style={{ color: "#6B5B53" }}>
            {restaurants.length} restaurant{restaurants.length > 1 ? "s" : ""}
          </span>
        </div>

        <RestaurantsTable restaurants={restaurants} statusMeta={STATUS_META} />
      </div>
    </div>
  );
}
