"use client";

import { MenuItem } from "@/types/menu";

interface DishCardProps {
  item: MenuItem;
  onToggleAvailable: (id: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
}

function formatPrice(price: number): string {
  return `${price.toLocaleString("fr-FR")} FCFA`;
}

export default function DishCard({ item, onToggleAvailable, onEdit, onDelete }: DishCardProps) {
  const unavailable = !item.available;

  return (
    <div
      className="group relative rounded-3xl overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: unavailable
          ? "rgba(246,243,242,0.5)"
          : "var(--color-surface-container-lowest)",
        border: unavailable ? "2px dashed rgba(227,191,178,0.3)" : "none",
        boxShadow: unavailable ? "none" : undefined,
      }}
    >
      {/* Image */}
      {item.image ? (
        <div className={`relative h-48 overflow-hidden ${unavailable ? "opacity-60 grayscale" : ""}`}>
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Price badge */}
          {!unavailable && (
            <div
              className="absolute top-4 right-4 px-3 py-1 rounded-full shadow-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)" }}
            >
              <span
                className="font-bold text-sm"
                style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
              >
                {formatPrice(item.price)}
              </span>
            </div>
          )}
          {/* Chef badge */}
          {item.badges?.includes("CHEF") && (
            <div className="absolute top-4 left-4">
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "var(--color-tertiary-container)", fontFamily: "var(--font-label)" }}
              >
                Choix du chef
              </span>
            </div>
          )}
          {/* Out of stock overlay */}
          {unavailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40" style={{ backdropFilter: "blur(2px)" }}>
              <span
                className="text-white font-bold text-sm uppercase tracking-widest px-4 py-2 rounded-full"
                style={{ backgroundColor: "rgba(0,0,0,0.4)", fontFamily: "var(--font-label)" }}
              >
                Épuisé
              </span>
            </div>
          )}
        </div>
      ) : (
        /* No image placeholder */
        <div
          className="h-20 flex items-center justify-center"
          style={{ backgroundColor: "var(--color-surface-container-low)" }}
        >
          <span className="material-symbols-outlined opacity-20 text-4xl">image_not_supported</span>
        </div>
      )}

      {/* Body */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4
            className="font-extrabold text-lg leading-tight flex-1 pr-2"
            style={{
              fontFamily: "var(--font-body)",
              color: unavailable ? "var(--color-on-surface-variant)" : "var(--color-on-surface)",
            }}
          >
            {item.name}
          </h4>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="p-1 rounded-lg transition-colors"
              style={{ color: "rgba(90,65,56,0.4)" }}
              aria-label="Modifier"
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 rounded-lg transition-colors hover:text-red-500"
              style={{ color: "rgba(90,65,56,0.4)" }}
              aria-label="Supprimer"
            >
              <span className="material-symbols-outlined text-lg">delete_outline</span>
            </button>
          </div>
        </div>
        <p
          className="text-sm mb-4 line-clamp-2"
          style={{
            fontFamily: "var(--font-body)",
            color: unavailable ? "rgba(90,65,56,0.5)" : "var(--color-on-surface-variant)",
          }}
        >
          {item.description}
        </p>

        {/* No-image price */}
        {!item.image && (
          <p
            className="font-bold text-base mb-4"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
          >
            {formatPrice(item.price)}
          </p>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-4"
          style={{ borderTop: "1px solid rgba(227,191,178,0.1)" }}
        >
          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            {item.badges?.filter((b) => b !== "CHEF").map((badge) => (
              <span
                key={badge}
                className="text-[10px] font-bold uppercase tracking-tighter px-2 py-0.5 rounded"
                style={{
                  backgroundColor: "var(--color-surface-container-low)",
                  color: unavailable ? "rgba(90,65,56,0.4)" : "var(--color-on-surface-variant)",
                  fontFamily: "var(--font-label)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Availability toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ backgroundColor: item.available ? "var(--color-primary)" : "#d4d0cf" }}
              onClick={() => onToggleAvailable(item.id)}
            >
              <div
                className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all shadow-sm"
                style={{ left: item.available ? "calc(100% - 22px)" : "2px" }}
              />
            </div>
            <span
              className="text-xs font-bold"
              style={{
                fontFamily: "var(--font-label)",
                color: unavailable ? "rgba(90,65,56,0.4)" : "var(--color-on-surface-variant)",
              }}
            >
              {item.available ? "Disponible" : "Indisponible"}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
