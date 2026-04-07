"use client";

import { Restaurant } from "@/types/menu";

export default function MenuHeader({ restaurant }: { restaurant: Restaurant }) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white"
      style={{ borderBottom: "1px solid #EDE8E5" }}
    >
      <div className="flex items-center justify-between px-5 py-3.5 max-w-lg mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>restaurant</span>
          </div>
          <div className="min-w-0">
            <h1
              className="text-[15px] font-black leading-tight truncate"
              style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
            >
              {restaurant.name}
            </h1>
            {restaurant.address && (
              <p className="text-[11px] truncate mt-0.5" style={{ color: "#A09088" }}>
                {restaurant.address}
              </p>
            )}
          </div>
        </div>

        {/* Online badge */}
        <div
          className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
          <span className="text-[11px] font-bold" style={{ color: "#15803D" }}>En ligne</span>
        </div>
      </div>
    </header>
  );
}
