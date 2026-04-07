import { MenuItem, Badge } from "@/types/menu";

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

  return (
    <article
      className="bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden"
      style={{ opacity: unavailable ? 0.6 : 1 }}
    >
      {/* Full-width image (if present) */}
      {item.image && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {/* Chef badge overlay */}
          {item.badges?.includes("CHEF") && (
            <span
              className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "#1C1B1B", color: "#FFB595" }}
            >
              Chef
            </span>
          )}
          {/* Unavailable overlay */}
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
            {/* Name */}
            <h4
              className="font-black text-base leading-snug text-[#1C1B1B] mb-1"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {item.name}
            </h4>

            {/* Description */}
            {item.description && (
              <p className="text-sm leading-5 mb-3 line-clamp-2" style={{ color: "#6B5B53" }}>
                {item.description}
              </p>
            )}

            {/* Badges (excluding CHEF shown in image) */}
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

            {/* Price */}
            <span
              className="text-base font-black"
              style={{
                fontFamily: "var(--font-headline)",
                color: unavailable ? "#A09088" : "var(--color-primary)",
              }}
            >
              {fmt(item.price, item.currency)}
            </span>
          </div>

          {/* Thumbnail (when no full-width image) */}
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
