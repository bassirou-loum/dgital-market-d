"use client";

import { MenuCategory } from "@/types/menu";

interface CategorySidebarProps {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  performance: number;
}

export default function CategorySidebar({
  categories,
  activeId,
  onSelect,
  performance,
}: CategorySidebarProps) {
  return (
    <aside className="lg:col-span-3 space-y-6">
      {/* Category list */}
      <div className="rounded-3xl p-6" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
        <h3
          className="text-xs font-bold uppercase tracking-widest mb-6"
          style={{ fontFamily: "var(--font-label)", color: "var(--color-primary)" }}
        >
          Sections du menu
        </h3>
        <ul className="space-y-2">
          {categories.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => onSelect(cat.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left"
                  style={{
                    backgroundColor: isActive ? "var(--color-surface-container-lowest)" : "transparent",
                    color: isActive ? "var(--color-on-surface)" : "var(--color-on-surface-variant)",
                    fontFamily: "var(--font-body)",
                    fontWeight: isActive ? 700 : 600,
                    boxShadow: isActive ? "0 2px 8px rgba(90,65,56,0.06)" : "none",
                  }}
                >
                  <span>{cat.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? "rgba(158,61,0,0.1)" : "transparent",
                      color: isActive ? "var(--color-primary)" : "rgba(90,65,56,0.4)",
                      fontFamily: "var(--font-label)",
                    }}
                  >
                    {cat.items.length}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Performance card */}
      <div
        className="rounded-3xl p-6 text-white"
        style={{ backgroundColor: "var(--color-primary-container)" }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined">trending_up</span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-label)" }}>
            Performance en direct
          </span>
        </div>
        <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-headline)" }}>
          {performance}% Actif
        </p>
        <p className="text-sm opacity-80" style={{ fontFamily: "var(--font-body)" }}>
          Tous les articles sont en stock et disponibles à la commande.
        </p>
      </div>
    </aside>
  );
}
