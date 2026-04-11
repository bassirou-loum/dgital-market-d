"use client";

import { useEffect } from "react";

interface ConfirmDeleteModalProps {
  dishName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDeleteModal({ dishName, onConfirm, onClose }: ConfirmDeleteModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(28,27,27,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        {/* Icône + titre */}
        <div className="flex flex-col items-center px-6 pt-8 pb-5 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: "#FFF0EE" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#BA1A1A" }}>
              delete_outline
            </span>
          </div>
          <h2
            className="text-xl font-black mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
          >
            Supprimer ce plat ?
          </h2>
          <p className="text-sm leading-6" style={{ color: "#6B5B53" }}>
            <span className="font-bold text-[#1C1B1B]">{dishName}</span> sera définitivement supprimé de votre menu.
            Cette action est irréversible.
          </p>
        </div>

        {/* Boutons */}
        <div
          className="flex flex-col gap-2 px-6 pb-8 pt-2"
          style={{ borderTop: "1px solid rgba(227,191,178,0.15)" }}
        >
          <button
            onClick={onConfirm}
            className="w-full py-3.5 rounded-full font-bold text-sm text-white transition-all active:scale-95"
            style={{ backgroundColor: "#BA1A1A" }}
          >
            Oui, supprimer
          </button>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-full font-bold text-sm transition-all"
            style={{ backgroundColor: "var(--color-surface-container-low)", color: "var(--color-on-surface-variant)" }}
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
