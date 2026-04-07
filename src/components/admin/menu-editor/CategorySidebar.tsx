"use client";

import { MenuCategory } from "@/types/menu";

export default function CategorySidebar({
  categories,
  activeId,
  onSelect,
  performance,
}: {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  performance: number;
}) {
  return (
    <aside className="lg:col-span-3 space-y-4">

      {/* Category list */}
      <div className="bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
        <div className="px-4 py-3.5 border-b border-[#EDE8E5]">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#A09088" }}>
            Sections du menu
          </p>
        </div>
        <ul className="p-2 space-y-0.5">
          {categories.map((cat) => {
            const active = cat.id === activeId;
            return (
              <li key={cat.id}>
                <button
                  onClick={() => onSelect(cat.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors text-left text-sm"
                  style={{
                    backgroundColor: active ? "#FFF0E8" : "transparent",
                    color: active ? "var(--color-primary)" : "#6B5B53",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <span className="truncate">{cat.name}</span>
                  <span
                    className="ml-2 flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: active ? "rgba(198,79,0,0.12)" : "#F0EDEC",
                      color: active ? "var(--color-primary)" : "#A09088",
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

      {/* Performance */}
      <div
        className="rounded-2xl p-4"
        style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>trending_up</span>
          <p className="text-xs font-bold uppercase tracking-widest">Performance</p>
        </div>
        <p className="text-3xl font-black mb-1" style={{ fontFamily: "var(--font-headline)" }}>
          {performance}%
        </p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
          des plats sont disponibles
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{ width: `${performance}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
