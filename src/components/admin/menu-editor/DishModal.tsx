"use client";

import { useEffect, useState, useRef } from "react";
import { MenuItem, Badge, ItemVariant } from "@/types/menu";
import { uploadDishImage } from "@/actions/restaurant";

interface DishModalProps {
  item?: MenuItem | null;
  categoryName: string;
  onSave: (data: Omit<MenuItem, "id"> & { id?: string }) => void;
  onClose: () => void;
}

const ALL_BADGES: Badge[] = ["V", "VG", "GF", "SPICY", "NEW", "CHEF"];
const BADGE_LABELS: Record<Badge, string> = {
  V: "Végétarien",
  VG: "Vegan",
  GF: "Sans gluten",
  SPICY: "Épicé",
  NEW: "Nouveau",
  CHEF: "Choix du chef",
};

const INPUT_STYLE = {
  backgroundColor: "var(--color-surface-container-low)",
  color: "var(--color-on-surface)",
  fontFamily: "var(--font-body)",
  border: "2px solid transparent",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-widest mb-2"
        style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

export default function DishModal({ item, categoryName, onSave, onClose }: DishModalProps) {
  const isEdit = !!item;
  const [name, setName]               = useState(item?.name ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [price, setPrice]             = useState(item ? String(item.price) : "");
  const [image, setImage]             = useState(item?.image ?? "");
  const [available, setAvailable]     = useState(item?.available ?? true);
  const [badges, setBadges]           = useState<Badge[]>(item?.badges ?? []);
  const [uploading, setUploading]     = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef                  = useRef<HTMLInputElement>(null);

  // Variants
  const [useVariants, setUseVariants] = useState((item?.variants?.length ?? 0) > 0);
  const [variants, setVariants]       = useState<Omit<ItemVariant, "id">[]>(
    item?.variants?.map((v) => ({ name: v.name, price: v.price, position: v.position })) ?? []
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    // Preview local immédiat
    setImage(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("image", file);
    const result = await uploadDishImage(fd);
    if (result.error) {
      setUploadError(result.error);
      setImage(item?.image ?? "");
    } else if (result.url) {
      setImage(result.url);
    }
    setUploading(false);
  }

  function toggleBadge(b: Badge) {
    setBadges((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  }

  function addVariant() {
    setVariants((prev) => [...prev, { name: "", price: 0, position: prev.length }]);
  }

  function removeVariant(idx: number) {
    setVariants((prev) => prev.filter((_, i) => i !== idx).map((v, i) => ({ ...v, position: i })));
  }

  function updateVariant(idx: number, field: "name" | "price", value: string) {
    setVariants((prev) =>
      prev.map((v, i) => i === idx ? { ...v, [field]: field === "price" ? Number(value) : value } : v)
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const minPrice = useVariants && variants.length > 0
      ? Math.min(...variants.map((v) => v.price))
      : Number(price);

    if (!useVariants && !price) return;
    if (useVariants && variants.length === 0) return;

    onSave({
      id: item?.id,
      name: name.trim(),
      description: description.trim(),
      price: minPrice,
      currency: "FCFA",
      image: image.trim() || undefined,
      available,
      badges: badges.length > 0 ? badges : undefined,
      variants: useVariants ? variants : [],
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ backgroundColor: "rgba(28,27,27,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 sm:px-6 py-5"
          style={{ borderBottom: "1px solid rgba(227,191,178,0.15)" }}
        >
          <div>
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              {isEdit ? "Modifier le plat" : "Nouveau plat"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-on-surface-variant)" }}>
              Catégorie : {categoryName}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: "var(--color-on-surface-variant)" }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5 space-y-4 max-h-[72vh] overflow-y-auto">

          {/* Name */}
          <Field label="Nom du plat *">
            <input
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Burger Dakar"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={INPUT_STYLE}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <textarea
              value={description} onChange={(e) => setDescription(e.target.value)}
              rows={2} placeholder="Décrivez le plat..."
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all resize-none"
              style={INPUT_STYLE}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
            />
          </Field>

          {/* Prix / Variantes toggle */}
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{ backgroundColor: "var(--color-surface-container-low)" }}
          >
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--color-on-surface)" }}>
                Plusieurs tailles / prix
              </p>
              <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                {useVariants ? "Activer les variantes" : "Prix unique"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setUseVariants((v) => !v); }}
              className="w-11 h-6 rounded-full relative transition-colors"
              style={{ backgroundColor: useVariants ? "var(--color-primary)" : "#d4d0cf" }}
            >
              <div
                className="absolute top-[2px] w-5 h-5 bg-white rounded-full transition-all shadow-sm"
                style={{ left: useVariants ? "calc(100% - 22px)" : "2px" }}
              />
            </button>
          </div>

          {/* Prix unique */}
          {!useVariants && (
            <Field label="Prix (FCFA) *">
              <div className="relative">
                <input
                  type="number" required min={0} value={price} onChange={(e) => setPrice(e.target.value)}
                  placeholder="2500"
                  className="w-full pl-4 pr-16 py-3 rounded-2xl text-sm outline-none transition-all"
                  style={INPUT_STYLE}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold" style={{ color: "var(--color-on-surface-variant)" }}>
                  FCFA
                </span>
              </div>
            </Field>
          )}

          {/* Variantes */}
          {useVariants && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-widest" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
                  Variantes *
                </label>
                <button
                  type="button" onClick={addVariant}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#FFF0E8", color: "var(--color-primary)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                  Ajouter
                </button>
              </div>

              {variants.length === 0 && (
                <p className="text-xs text-center py-4 rounded-2xl" style={{ backgroundColor: "var(--color-surface-container-low)", color: "var(--color-on-surface-variant)" }}>
                  Aucune variante — cliquez "Ajouter"
                </p>
              )}

              <div className="space-y-2">
                {variants.map((v, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text" value={v.name} onChange={(e) => updateVariant(idx, "name", e.target.value)}
                      placeholder={`Variante ${idx + 1} (ex: Petit)`}
                      className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                      style={INPUT_STYLE}
                      onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
                    />
                    <div className="relative w-24 sm:w-32 flex-shrink-0">
                      <input
                        type="number" min={0} value={v.price || ""} onChange={(e) => updateVariant(idx, "price", e.target.value)}
                        placeholder="Prix"
                        className="w-full pl-3 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
                        style={INPUT_STYLE}
                        onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                        onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold" style={{ color: "var(--color-on-surface-variant)" }}>
                        FCFA
                      </span>
                    </div>
                    <button
                      type="button" onClick={() => removeVariant(idx)}
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                      style={{ color: "#A09088" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_outline</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image upload */}
          <Field label="Photo du plat">
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-dashed transition-colors cursor-pointer"
              style={{ borderColor: uploadError ? "#BA1A1A" : image ? "transparent" : "#E0D9D5" }}
              onClick={() => fileInputRef.current?.click()}
            >
              {image ? (
                <div className="relative h-36">
                  <img src={image} alt="Aperçu" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-white text-sm font-bold">
                      <span className="material-symbols-outlined" style={{ fontSize: 20 }}>photo_camera</span>
                      Changer la photo
                    </div>
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImage(""); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors"
                  >
                    <span className="material-symbols-outlined text-white" style={{ fontSize: 14 }}>close</span>
                  </button>
                </div>
              ) : (
                <div
                  className="h-28 flex flex-col items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--color-surface-container-low)" }}
                >
                  {uploading ? (
                    <span className="material-symbols-outlined animate-spin" style={{ fontSize: 28, color: "var(--color-primary)" }}>progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#A09088" }}>add_photo_alternate</span>
                      <p className="text-xs font-semibold" style={{ color: "#A09088" }}>Appuyer pour ajouter une photo</p>
                      <p className="text-[10px]" style={{ color: "#C0B4AE" }}>JPG, PNG, WEBP — max 5 MB</p>
                    </>
                  )}
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-xs mt-1.5" style={{ color: "#BA1A1A" }}>{uploadError}</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </Field>

          {/* Badges */}
          <Field label="Badges">
            <div className="flex flex-wrap gap-2">
              {ALL_BADGES.map((b) => {
                const selected = badges.includes(b);
                return (
                  <button
                    key={b} type="button" onClick={() => toggleBadge(b)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={{
                      backgroundColor: selected ? "var(--color-primary)" : "var(--color-surface-container-low)",
                      color: selected ? "white" : "var(--color-on-surface-variant)",
                    }}
                  >
                    {BADGE_LABELS[b]}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* Availability */}
          <div
            className="flex items-center justify-between p-4 rounded-2xl"
            style={{ backgroundColor: "var(--color-surface-container-low)" }}
          >
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--color-on-surface)" }}>Disponibilité</p>
              <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
                {available ? "Visible sur le menu" : "Masqué"}
              </p>
            </div>
            <button
              type="button" onClick={() => setAvailable(!available)}
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
        <div className="flex gap-3 px-4 sm:px-6 py-5" style={{ borderTop: "1px solid rgba(227,191,178,0.15)" }}>
          <button
            type="button" onClick={onClose}
            className="flex-1 py-3 rounded-full font-bold text-sm transition-all"
            style={{ backgroundColor: "var(--color-surface-container-low)", color: "var(--color-on-surface-variant)" }}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-full font-bold text-sm text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))" }}
          >
            {isEdit ? "Enregistrer" : "Ajouter le plat"}
          </button>
        </div>
      </div>
    </div>
  );
}
