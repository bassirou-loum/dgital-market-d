"use client";

import { useState, useEffect } from "react";
import { MenuCategory } from "@/types/menu";

export default function CategoryNav({ categories }: { categories: MenuCategory[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
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
      className="sticky z-40 -mx-5 px-5 py-3 hide-scrollbar overflow-x-auto flex gap-2"
      style={{ top: "61px", backgroundColor: "#fff", borderBottom: "1px solid #EDE8E5" }}
    >
      {categories.map((cat) => {
        const active = activeId === cat.id;
        return (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors"
            style={
              active
                ? { backgroundColor: "var(--color-primary)", color: "#fff" }
                : { backgroundColor: "#F0EDEC", color: "#6B5B53" }
            }
          >
            {cat.name}
          </a>
        );
      })}
    </nav>
  );
}
