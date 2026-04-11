"use client";

import { useEffect, useState } from "react";

interface CategoryModalProps {
  onSave: (name: string) => void;
  onClose: () => void;
}

export default function CategoryModal({ onSave, onClose }: CategoryModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim());
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(28,27,27,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        <div
          className="flex items-center justify-between px-5 sm:px-8 py-5 sm:py-6"
          style={{ borderBottom: "1px solid rgba(227,191,178,0.15)" }}
        >
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
          >
            Nouvelle catégorie
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--color-on-surface-variant)" }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 sm:px-8 py-5 sm:py-6 space-y-5">
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
            >
              Nom de la catégorie *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Desserts, Boissons..."
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--color-surface-container-low)",
                color: "var(--color-on-surface)",
                fontFamily: "var(--font-body)",
                border: "2px solid transparent",
              }}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full font-bold text-sm"
              style={{
                backgroundColor: "var(--color-surface-container-low)",
                color: "var(--color-on-surface-variant)",
                fontFamily: "var(--font-label)",
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full font-bold text-sm text-white active:scale-95 transition-all"
              style={{
                background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
                fontFamily: "var(--font-label)",
              }}
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
