"use client";

import { useState, useTransition } from "react";
import { updateRestaurantSubscription, type SubscriptionDuration } from "@/actions/superadmin";
import type { SuperAdminRestaurant } from "@/lib/dal/superadmin";

type StatusMeta = Record<string, { label: string; bg: string; text: string; dot: string }>;

const PLAN_LABELS: Record<string, string> = {
  gratuit: "Gratuit",
  standard: "Standard",
  premium: "Premium",
};

const PLAN_COLORS: Record<string, { bg: string; text: string }> = {
  gratuit:  { bg: "#F6F4F2", text: "#6B5B53" },
  standard: { bg: "#EFF6FF", text: "#1D4ED8" },
  premium:  { bg: "#FFF7ED", text: "#C2410C" },
};

const DURATION_OPTIONS: { value: SubscriptionDuration; label: string; plansOnly?: string[] }[] = [
  { value: "none",     label: "Désactiver" },
  { value: "forever",  label: "Illimité", plansOnly: ["gratuit"] },
  { value: "trial_7d", label: "Essai 7 jours" },
  { value: "1m",       label: "1 mois" },
  { value: "2m",       label: "2 mois" },
  { value: "3m",       label: "3 mois" },
  { value: "6m",       label: "6 mois" },
  { value: "12m",      label: "12 mois" },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status, meta }: { status: string; meta: StatusMeta }) {
  const m = meta[status] ?? meta["none"];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: m.bg, color: m.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.dot }} />
      {m.label}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const c = PLAN_COLORS[plan] ?? PLAN_COLORS["gratuit"];
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {PLAN_LABELS[plan] ?? plan}
    </span>
  );
}

function RestaurantRow({
  restaurant,
  statusMeta,
}: {
  restaurant: SuperAdminRestaurant;
  statusMeta: StatusMeta;
}) {
  const [plan, setPlan] = useState<"gratuit" | "standard" | "premium">(restaurant.plan);
  const [duration, setDuration] = useState<SubscriptionDuration>(
    restaurant.plan === "gratuit" ? "forever" : "none"
  );

  function handlePlanChange(newPlan: "gratuit" | "standard" | "premium") {
    setPlan(newPlan);
    // Pour gratuit → illimité par défaut, pour les autres → essai 7j par défaut
    if (newPlan === "gratuit") setDuration("forever");
    else if (duration === "forever") setDuration("trial_7d");
  }
  const [expanded, setExpanded] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  function handleSave() {
    setFeedback(null);
    startTransition(async () => {
      const res = await updateRestaurantSubscription(restaurant.id, plan, duration);
      if (res.error) {
        setFeedback({ ok: false, msg: res.error });
      } else {
        setFeedback({ ok: true, msg: "Abonnement mis à jour" });
        setTimeout(() => setFeedback(null), 3000);
      }
    });
  }

  return (
    <>
      {/* Main row */}
      <tr className="border-t border-[#EDE8E5] hover:bg-[#FAFAF9] transition-colors">
        {/* Restaurant info */}
        <td className="px-5 py-4">
          <p className="text-sm font-bold text-[#1C1B1B] leading-tight">{restaurant.name}</p>
          <p className="text-xs text-[#A09088] mt-0.5">{restaurant.owner_email ?? "—"}</p>
          <p className="text-[10px] text-[#C4B9B4] mt-0.5 font-mono">/{restaurant.slug}</p>
        </td>

        {/* Plan */}
        <td className="px-4 py-4 hidden sm:table-cell">
          <PlanBadge plan={restaurant.plan} />
        </td>

        {/* Status */}
        <td className="px-4 py-4">
          <StatusBadge status={restaurant.subscription_status} meta={statusMeta} />
        </td>

        {/* End date */}
        <td className="px-4 py-4 hidden md:table-cell">
          <span className="text-xs text-[#6B5B53]">{formatDate(restaurant.subscription_end)}</span>
        </td>

        {/* Created */}
        <td className="px-4 py-4 hidden lg:table-cell">
          <span className="text-xs text-[#A09088]">{formatDate(restaurant.created_at)}</span>
        </td>

        {/* Action */}
        <td className="px-5 py-4 text-right">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#EDE8E5] bg-white hover:bg-[#F6F4F2] transition-colors text-[#1C1B1B]"
          >
            {expanded ? "Fermer" : "Gérer"}
          </button>
        </td>
      </tr>

      {/* Expanded management panel */}
      {expanded && (
        <tr className="border-t border-[#EDE8E5] bg-[#FAFAF9]">
          <td colSpan={6} className="px-5 py-5">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              {/* Plan selector */}
              <div className="flex-1 min-w-[160px]">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A09088] mb-1.5">
                  Plan
                </label>
                <div className="relative">
                  <select
                    value={plan}
                    onChange={(e) => handlePlanChange(e.target.value as typeof plan)}
                    className="w-full appearance-none bg-white border border-[#EDE8E5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1C1B1B] pr-8 focus:outline-none focus:ring-2 focus:ring-[#C64F00]/20 focus:border-[#C64F00]"
                  >
                    <option value="gratuit">Gratuit</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                  <span
                    className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#A09088]"
                    style={{ fontSize: 16 }}
                  >
                    expand_more
                  </span>
                </div>
              </div>

              {/* Duration selector */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#A09088] mb-1.5">
                  Durée / Type
                </label>
                <div className="relative">
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as SubscriptionDuration)}
                    className="w-full appearance-none bg-white border border-[#EDE8E5] rounded-xl px-3 py-2.5 text-sm font-medium text-[#1C1B1B] pr-8 focus:outline-none focus:ring-2 focus:ring-[#C64F00]/20 focus:border-[#C64F00]"
                  >
                    {DURATION_OPTIONS
                      .filter((opt) => !opt.plansOnly || opt.plansOnly.includes(plan))
                      .map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                  </select>
                  <span
                    className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#A09088]"
                    style={{ fontSize: 16 }}
                  >
                    expand_more
                  </span>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "#C64F00" }}
              >
                {isPending ? (
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16 }}>progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
                )}
                Appliquer
              </button>

              {/* Feedback */}
              {feedback && (
                <span
                  className="text-xs font-semibold"
                  style={{ color: feedback.ok ? "#15803D" : "#BA1A1A" }}
                >
                  {feedback.ok ? "✓ " : "✗ "}{feedback.msg}
                </span>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function RestaurantsTable({
  restaurants,
  statusMeta,
}: {
  restaurants: SuperAdminRestaurant[];
  statusMeta: StatusMeta;
}) {
  if (restaurants.length === 0) {
    return (
      <div className="px-5 py-16 text-center">
        <span className="material-symbols-outlined text-[#EDE8E5]" style={{ fontSize: 48 }}>store</span>
        <p className="text-sm text-[#A09088] mt-3">Aucun restaurant inscrit</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FAFAF9]">
            <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#A09088]">Restaurant</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#A09088] hidden sm:table-cell">Plan</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#A09088]">Statut</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#A09088] hidden md:table-cell">Expire le</th>
            <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#A09088] hidden lg:table-cell">Inscrit le</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {restaurants.map((r) => (
            <RestaurantRow key={r.id} restaurant={r} statusMeta={statusMeta} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
