"use client";

import { useState, useTransition } from "react";
import { updateDailySpecial } from "@/actions/menu";
import type { MenuItem } from "@/types/menu";

interface DailySpecialPanelProps {
  menuId: string;
  currentTitle: string | null;
  currentImage: string | null;
  allItems: MenuItem[];
}

export default function DailySpecialPanel({
  menuId,
  currentTitle,
  currentImage,
  allItems,
}: DailySpecialPanelProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle ?? "");
  const [imageUrl, setImageUrl] = useState(currentImage ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  const hasSpecial = !!(currentTitle);

  function fillFromItem(itemId: string) {
    const item = allItems.find((i) => i.id === itemId);
    if (!item) return;
    setTitle(item.name);
    setImageUrl(item.image ?? "");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    startTransition(() => {
      updateDailySpecial(menuId, title.trim() ? { title: title.trim(), image_url: imageUrl.trim() } : null);
    });
    setSaving(false);
    setSaved(true);
    setOpen(false);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleRemove() {
    startTransition(() => { updateDailySpecial(menuId, null); });
    setTitle("");
    setImageUrl("");
    setSaved(false);
  }

  const inputStyle = {
    backgroundColor: "var(--color-surface-container-low)",
    color: "var(--color-on-surface)",
    fontFamily: "var(--font-body)",
    border: "2px solid transparent",
    padding: "0.65rem 1rem",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s",
  };

  return (
    <div
      className="rounded-3xl overflow-hidden mb-8"
      style={{
        backgroundColor: hasSpecial
          ? "var(--color-surface-container-lowest)"
          : "var(--color-surface-container-low)",
        boxShadow: hasSpecial ? "0 4px 20px rgba(90,65,56,0.06)" : "none",
        border: hasSpecial ? "none" : "2px dashed rgba(227,191,178,0.4)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: hasSpecial ? "var(--color-tertiary-container)" : "rgba(227,191,178,0.3)",
              color: hasSpecial ? "white" : "var(--color-on-surface-variant)",
            }}
          >
            <span className="material-symbols-outlined text-lg">restaurant</span>
          </div>
          <div>
            <p
              className="font-bold text-sm"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface)" }}
            >
              Plat du jour
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}
            >
              {hasSpecial ? currentTitle : "Non configuré — affiché en bannière hero"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span
              className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ backgroundColor: "#dcfce7", color: "#15803d", fontFamily: "var(--font-label)" }}
            >
              Enregistré
            </span>
          )}
          {hasSpecial && (
            <button
              onClick={(e) => { e.stopPropagation(); handleRemove(); }}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--color-error)" }}
              title="Supprimer le plat du jour"
            >
              <span className="material-symbols-outlined text-sm">delete_outline</span>
            </button>
          )}
          <span
            className="material-symbols-outlined transition-transform"
            style={{
              color: "var(--color-on-surface-variant)",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            expand_more
          </span>
        </div>
      </div>

      {/* Preview quand configuré et fermé */}
      {hasSpecial && !open && currentImage && (
        <div className="px-6 pb-5">
          <div className="relative w-full h-28 rounded-xl overflow-hidden">
            <img src={currentImage} alt={currentTitle ?? ""} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
              <p className="text-white text-sm font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                {currentTitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      {open && (
        <form onSubmit={handleSave} className="px-6 pb-6 space-y-4 border-t" style={{ borderColor: "rgba(227,191,178,0.15)" }}>
          <div className="pt-4">

            {/* Sélection rapide depuis les plats existants */}
            {allItems.length > 0 && (
              <div className="mb-4">
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
                >
                  Choisir depuis vos plats
                </label>
                <select
                  onChange={(e) => fillFromItem(e.target.value)}
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
                  style={{
                    backgroundColor: "var(--color-surface-container-low)",
                    color: "var(--color-on-surface)",
                    fontFamily: "var(--font-body)",
                    border: "2px solid transparent",
                  }}
                >
                  <option value="" disabled>— Sélectionner un plat —</option>
                  {allItems.filter(i => i.available).map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                  Pré-remplit le titre et l'image automatiquement
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(227,191,178,0.3)" }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}>
                ou personnaliser
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(227,191,178,0.3)" }} />
            </div>

            {/* Titre */}
            <div className="mb-4">
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
              >
                Titre du plat du jour
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Canard Confit à la Réduction de Cerise"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
              />
            </div>

            {/* Image */}
            <div className="mb-4">
              <label
                className="block text-xs font-bold uppercase tracking-widest mb-2"
                style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
              >
                URL de l'image hero
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
              />
              {/* Aperçu */}
              {imageUrl && (
                <div className="mt-2 w-full h-20 rounded-xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all"
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
                disabled={saving}
                className="flex-1 py-2.5 rounded-full text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-60"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
                  fontFamily: "var(--font-label)",
                }}
              >
                {saving ? "..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
