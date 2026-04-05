"use client";

import { Restaurant } from "@/types/menu";

interface MenuHeaderProps {
  restaurant: Restaurant;
}

export default function MenuHeader({ restaurant }: MenuHeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-sm mx-auto">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
            style={{ backgroundColor: "var(--color-primary-container)" }}
          >
            <span className="material-symbols-outlined text-xl">restaurant</span>
          </div>
          <div className="flex flex-col">
            <h1
              className="text-xl font-black tracking-tight"
              style={{
                fontFamily: "var(--font-headline)",
                color: "var(--color-primary)",
              }}
            >
              {restaurant.name}
            </h1>
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-label)",
                color: "var(--color-on-surface-variant)",
                opacity: 0.7,
              }}
            >
              {restaurant.address}
            </span>
          </div>
        </div>
        <button
          className="p-2 rounded-xl transition-all active:scale-95"
          style={{ color: "var(--color-primary)" }}
          aria-label="Rechercher"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </header>
  );
}
