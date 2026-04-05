"use client";

import { useState, useEffect } from "react";
import { MenuCategory } from "@/types/menu";

interface CategoryNavProps {
  categories: MenuCategory[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -65% 0px" }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav
      className="sticky top-[72px] z-40 -mx-6 px-6 py-3 hide-scrollbar overflow-x-auto flex gap-6 items-center"
      style={{ backgroundColor: "color-mix(in srgb, var(--color-surface) 95%, transparent)" }}
    >
      {categories.map((cat) => {
        const isActive = activeId === cat.id;
        return (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className="flex-shrink-0 pb-1 text-sm font-bold transition-colors"
            style={{
              fontFamily: "var(--font-label)",
              color: isActive ? "var(--color-primary)" : "var(--color-on-surface-variant)",
              borderBottom: isActive ? `2px solid var(--color-primary)` : "2px solid transparent",
            }}
          >
            {cat.name}
          </a>
        );
      })}
    </nav>
  );
}
