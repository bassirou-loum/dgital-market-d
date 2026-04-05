"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { icon: "menu_book", label: "Menu", id: "menu" },
  { icon: "filter_list", label: "Catégories", id: "categories" },
  { icon: "info", label: "Infos", id: "info" },
];

export default function BottomNav() {
  const [active, setActive] = useState("menu");

  return (
    <nav
      className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pt-3 pb-8 md:hidden z-50 rounded-t-3xl"
      style={{
        backgroundColor: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(24px)",
        boxShadow: "0 -10px 40px rgba(90,65,56,0.08)",
      }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="flex flex-col items-center justify-center rounded-2xl px-6 py-2 transition-all active:scale-90"
            style={{
              backgroundColor: isActive ? "rgb(255 237 213)" : "transparent",
              color: isActive ? "var(--color-primary)" : "#a8a29e",
            }}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
            <span
              className="text-[10px] uppercase tracking-widest font-bold"
              style={{ fontFamily: "var(--font-label)" }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
