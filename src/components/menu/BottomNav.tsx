"use client";

import { useState } from "react";

const NAV = [
  { icon: "menu_book",    label: "Menu",       id: "menu" },
  { icon: "filter_list",  label: "Catégories", id: "categories" },
  { icon: "info",         label: "Infos",      id: "info" },
];

export default function BottomNav() {
  const [active, setActive] = useState("menu");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center px-4 pt-2 pb-7"
      style={{ backgroundColor: "#fff", borderTop: "1px solid #EDE8E5" }}
    >
      {NAV.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className="flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition-colors active:scale-95"
            style={{
              color: isActive ? "var(--color-primary)" : "#A09088",
              backgroundColor: isActive ? "#FFF0E8" : "transparent",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: 22,
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
