"use client";

import { useEffect, useState } from "react";
import { MenuItem, Badge } from "@/types/menu";

interface DishModalProps {
  item?: MenuItem | null;
  categoryName: string;
  onSave: (data: Omit<MenuItem, "id"> & { id?: string }) => void;
  onClose: () => void;
}

const ALL_BADGES: Badge[] = ["V", "VG", "GF", "SPICY", "NEW", "CHEF"];
const BADGE_LABELS: Record<Badge, string> = {
  V: "Végétarien (V)",
  VG: "Vegan (VG)",
  GF: "Sans gluten (GF)",
  SPICY: "Épicé",
  NEW: "Nouveau",
  CHEF: "Choix du chef",
};

export default function DishModal({ item, categoryName, onSave, onClose }: DishModalProps) {
  const isEdit = !!item;
  const [name, setName] = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice] = useState(item ? String(item.price) : "");
  const [image, setImage] = useState(item?.image ?? "");
  const [available, setAvailable] = useState(item?.available ?? true);
  const [badges, setBadges] = useState<Badge[]>(item?.badges ?? []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function toggleBadge(b: Badge) {
    setBadges((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onSave({
      id: item?.id,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      currency: "FCFA",
      image: image.trim() || undefined,
      available,
      badges: badges.length > 0 ? badges : undefined,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(28,27,27,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-6"
          style={{ borderBottom: "1px solid rgba(227,191,178,0.15)" }}
        >
          <div>
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              {isEdit ? "Modifier le plat" : "Nouveau plat"}
            </h2>
            <p
              className="text-sm mt-1"
              style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)" }}
            >
              Catégorie : {categoryName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              Nom du plat *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Steak Frites"
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

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Décrivez le plat..."
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all resize-none"
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

          {/* Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              Prix (FCFA) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5000"
                className="w-full pl-4 pr-16 py-3 rounded-2xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: "var(--color-surface-container-low)",
                  color: "var(--color-on-surface)",
                  fontFamily: "var(--font-body)",
                  border: "2px solid transparent",
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
              />
              <span
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold"
                style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
              >
                FCFA
              </span>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              URL de l&apos;image
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://..."
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

          {/* Badges */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              Badges
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_BADGES.map((b) => {
                const selected = badges.includes(b);
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => toggleBadge(b)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={{
                      fontFamily: "var(--font-label)",
                      backgroundColor: selected ? "var(--color-primary)" : "var(--color-surface-container-low)",
                      color: selected ? "white" : "var(--color-on-surface-variant)",
                    }}
                  >
                    {BADGE_LABELS[b]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability */}
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{ backgroundColor: "var(--color-surface-container-low)" }}
          >
            <div>
              <p className="font-bold text-sm" style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface)" }}>
                Disponibilité
              </p>
              <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                {available ? "Le plat est visible et commandable" : "Le plat est masqué"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAvailable(!available)}
              className="w-11 h-6 rounded-full relative transition-colors"
              style={{ backgroundColor: available ? "var(--color-primary)" : "#d4d0cf" }}
            >
              <div
                className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all shadow-sm"
                style={{ left: available ? "calc(100% - 22px)" : "2px" }}
              />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div
          className="flex gap-3 px-8 py-5"
          style={{ borderTop: "1px solid rgba(227,191,178,0.15)" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full font-bold text-sm transition-all"
            style={{
              backgroundColor: "var(--color-surface-container-low)",
              color: "var(--color-on-surface-variant)",
              fontFamily: "var(--font-label)",
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-full font-bold text-sm text-white transition-all active:scale-95 shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
              fontFamily: "var(--font-label)",
            }}
          >
            {isEdit ? "Enregistrer" : "Ajouter le plat"}
          </button>
        </div>
      </div>
    </div>
  );
}
