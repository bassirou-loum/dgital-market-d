"use client";

import { useState } from "react";
import { MenuItem, Badge, ItemVariant } from "@/types/menu";

const BADGE_STYLE: Record<Badge, { label: string; bg: string; color: string }> = {
  V:     { label: "Végétarien",  bg: "#F0FDF4", color: "#15803D" },
  VG:    { label: "Vegan",       bg: "#F0FDF4", color: "#15803D" },
  GF:    { label: "Sans gluten", bg: "#FFF7ED", color: "#C2410C" },
  SPICY: { label: "Épicé 🌶",    bg: "#FFF0E8", color: "var(--color-primary)" },
  NEW:   { label: "Nouveau",     bg: "#EFF6FF", color: "#1D4ED8" },
  CHEF:  { label: "Chef",        bg: "#1C1B1B", color: "#FFB595" },
};

function fmt(price: number, currency: string) {
  if (currency === "FCFA") return `${price.toLocaleString("fr-FR")} FCFA`;
  return `${currency}${(price / 100).toFixed(2)}`;
}

export default function MenuItemCard({ item }: { item: MenuItem }) {
  const unavailable = !item.available;
  const hasVariants = (item.variants?.length ?? 0) > 0;
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(
    hasVariants ? item.variants![0] : null
  );

  const displayPrice = selectedVariant ? selectedVariant.price : item.price;
  const minPrice = hasVariants ? Math.min(...item.variants!.map((v) => v.price)) : item.price;

  return (
    <article
      className="bg-white rounded-2xl border overflow-hidden transition-shadow"
      style={{
        borderColor: hasVariants ? "#E8D5C8" : "#EDE8E5",
        opacity: unavailable ? 0.6 : 1,
      }}
    >
      {/* Full-width image */}
      {item.image && (
        <div className="relative h-44 overflow-hidden">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />

          {/* Variantes badge sur l'image */}
          {hasVariants && (
            <div
              className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(28,27,27,0.75)", backdropFilter: "blur(4px)" }}
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>tune</span>
              <span className="text-[11px] font-bold text-white">
                {item.variants!.length} tailles
              </span>
            </div>
          )}

          {item.badges?.includes("CHEF") && (
            <span
              className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#1C1B1B", color: "#FFB595" }}
            >
              Chef
            </span>
          )}
          {unavailable && (
            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <span className="bg-black/60 text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                Indisponible
              </span>
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">

            {/* Name + variantes indicator (si pas d'image) */}
            <div className="flex items-start gap-2 mb-1">
              <h4
                className="font-black text-base leading-snug text-[#1C1B1B] flex-1"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                {item.name}
              </h4>
              {hasVariants && !item.image && (
                <span
                  className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5"
                  style={{ backgroundColor: "#FFF0E8", color: "var(--color-primary)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 11 }}>tune</span>
                  {item.variants!.length} tailles
                </span>
              )}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-sm leading-5 mb-3 line-clamp-2" style={{ color: "#6B5B53" }}>
                {item.description}
              </p>
            )}

            {/* Badges (excluding CHEF) */}
            {item.badges && item.badges.filter((b) => b !== "CHEF").length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {item.badges.filter((b) => b !== "CHEF").map((badge) => {
                  const s = BADGE_STYLE[badge];
                  return (
                    <span
                      key={badge}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: s.bg, color: s.color }}
                    >
                      {s.label}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Variants selector */}
            {hasVariants && (
              <div className="mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#A09088" }}>
                  Choisir une taille
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {item.variants!.map((v) => {
                    const active = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className="flex flex-col items-center px-3 py-1.5 rounded-xl border-2 transition-all"
                        style={{
                          backgroundColor: active ? "#FFF0E8" : "#FAFAF9",
                          borderColor: active ? "var(--color-primary)" : "#EDE8E5",
                        }}
                      >
                        <span
                          className="text-xs font-bold"
                          style={{ color: active ? "var(--color-primary)" : "#1C1B1B" }}
                        >
                          {v.name}
                        </span>
                        <span
                          className="text-[11px] font-black"
                          style={{
                            color: active ? "var(--color-primary)" : "#6B5B53",
                            fontFamily: "var(--font-headline)",
                          }}
                        >
                          {fmt(v.price, item.currency)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2">
              {hasVariants ? (
                <>
                  <span className="text-base font-black" style={{ fontFamily: "var(--font-headline)", color: unavailable ? "#A09088" : "var(--color-primary)" }}>
                    {fmt(displayPrice, item.currency)}
                  </span>
                </>
              ) : (
                <span
                  className="text-base font-black"
                  style={{ fontFamily: "var(--font-headline)", color: unavailable ? "#A09088" : "var(--color-primary)" }}
                >
                  {fmt(item.price, item.currency)}
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail (no image) */}
          {!item.image && (
            <div
              className="flex-shrink-0 w-20 h-20 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#F6F4F2" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#C0B4AE" }}>
                restaurant
              </span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
