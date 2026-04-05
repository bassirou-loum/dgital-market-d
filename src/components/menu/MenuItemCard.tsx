import { MenuItem, Badge } from "@/types/menu";

const BADGE_LABELS: Record<Badge, string> = {
  V: "V",
  VG: "VG",
  GF: "SF",
  SPICY: "🌶",
  NEW: "Nouveau",
  CHEF: "Chef",
};

interface MenuItemCardProps {
  item: MenuItem;
}

function formatPrice(price: number, currency: string): string {
  if (currency === "FCFA") {
    return `${price.toLocaleString("fr-FR")} FCFA`;
  }
  return `${currency}${(price / 100).toFixed(2)}`;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <article className="group">
      <div className="flex flex-col gap-4">
        {item.image && (
          <div
            className="relative overflow-hidden rounded-xl transition-colors"
            style={{ backgroundColor: "var(--color-surface-container-low)" }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-56 object-cover rounded-xl"
              style={{ opacity: item.available ? 1 : 0.5 }}
            />
            {!item.available && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
                <span
                  className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{
                    fontFamily: "var(--font-label)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  Indisponible
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4
                className="text-xl font-bold"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--color-on-surface)",
                }}
              >
                {item.name}
              </h4>
              {item.badges?.map((badge) => (
                <span
                  key={badge}
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded border"
                  style={{
                    fontFamily: "var(--font-label)",
                    backgroundColor: "rgba(0, 114, 228, 0.08)",
                    color: "var(--color-tertiary)",
                    borderColor: "rgba(0, 90, 183, 0.2)",
                  }}
                >
                  {BADGE_LABELS[badge]}
                </span>
              ))}
            </div>
            <p
              className="text-sm leading-relaxed mb-2"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--color-on-surface-variant)",
              }}
            >
              {item.description}
            </p>
            <span
              className="text-lg font-bold"
              style={{
                fontFamily: "var(--font-headline)",
                color: item.available ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              }}
            >
              {formatPrice(item.price, item.currency)}
            </span>
          </div>

          <button
            disabled={!item.available}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--color-surface-container-highest)",
              color: "var(--color-on-surface-variant)",
            }}
            aria-label={`Ajouter ${item.name}`}
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>
      </div>
    </article>
  );
}
