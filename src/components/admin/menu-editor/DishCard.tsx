"use client";

import { MenuItem } from "@/types/menu";


function fmt(price: number) {
  return `${price.toLocaleString("fr-FR")} FCFA`;
}

function PriceDisplay({ item }: { item: MenuItem }) {
  if (item.variants && item.variants.length > 0) {
    const min = Math.min(...item.variants.map((v) => v.price));
    return (
      <div>
        <span className="text-xs font-medium" style={{ color: "#A09088" }}>À partir de </span>
        <span className="text-sm font-black" style={{ color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}>
          {fmt(min)}
        </span>
        <span
          className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: "#FFF0E8", color: "var(--color-primary)" }}
        >
          {item.variants.length} variantes
        </span>
      </div>
    );
  }
  return (
    <span className="text-sm font-black" style={{ color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}>
      {fmt(item.price)}
    </span>
  );
}

export default function DishCard({
  item,
  onToggleAvailable,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onToggleAvailable: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}) {
  const unavailable = !item.available;

  return (
    <div
      className="bg-white rounded-2xl border overflow-hidden flex flex-col transition-opacity"
      style={{
        borderColor: unavailable ? "#EDE8E5" : "#EDE8E5",
        opacity: unavailable ? 0.65 : 1,
      }}
    >
      {/* Image */}
      {item.image ? (
        <div className="relative h-44 overflow-hidden flex-shrink-0 bg-[#F6F4F2]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {/* Price badge */}
          <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 border border-[#EDE8E5]">
            <span className="text-xs font-black" style={{ color: "var(--color-primary)", fontFamily: "var(--font-headline)" }}>
              {item.variants && item.variants.length > 0
                ? `dès ${fmt(Math.min(...item.variants.map((v) => v.price)))}`
                : fmt(item.price)}
            </span>
          </div>
          {/* Chef badge */}
          {item.badges?.includes("CHEF") && (
            <div className="absolute top-3 left-3">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Chef
              </span>
            </div>
          )}
          {/* Unavailable overlay */}
          {unavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/50 px-3 py-1.5 rounded-full">
                Épuisé
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-14 flex items-center justify-center bg-[#F6F4F2] flex-shrink-0">
          <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#C0B4AE" }}>image_not_supported</span>
        </div>
      )}

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name + actions */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-bold text-[15px] leading-snug text-[#1C1B1B] flex-1 min-w-0">
            {item.name}
          </h4>
          <div className="flex gap-0.5 flex-shrink-0">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg hover:bg-[#F6F4F2] transition-colors"
              style={{ color: "#A09088" }}
              aria-label="Modifier"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>edit</span>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
              style={{ color: "#A09088" }}
              aria-label="Supprimer"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>delete_outline</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-5 line-clamp-2 mb-3 flex-1" style={{ color: "#6B5B53" }}>
          {item.description}
        </p>

        {/* Price (no image) */}
        {!item.image && (
          <div className="mb-3">
            <PriceDisplay item={item} />
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#EDE8E5]">
          {/* Badges */}
          <div className="flex gap-1 flex-wrap">
            {item.badges?.filter((b) => b !== "CHEF").map((badge) => (
              <span
                key={badge}
                className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-[#F6F4F2]"
                style={{ color: "#6B5B53" }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Toggle */}
          <button
            onClick={() => onToggleAvailable(item.id)}
            className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
            style={{ backgroundColor: item.available ? "var(--color-primary)" : "#E0D9D5" }}
            role="switch"
            aria-checked={item.available}
          >
            <span
              className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"
              style={{ left: item.available ? "calc(100% - 18px)" : "2px" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
