"use client";

import { useState, useRef } from "react";
import { updateRestaurantProfile, uploadLogo } from "@/actions/restaurant";
import type { DbRestaurant } from "@/lib/dal/restaurant";

const COLOR_PALETTE = [
  { value: "#9e3d00", label: "Terracotta" },
  { value: "#1c1b1b", label: "Anthracite" },
  { value: "#065f46", label: "Forêt" },
  { value: "#1e3a8a", label: "Marine" },
  { value: "#7c3aed", label: "Violet" },
  { value: "#be185d", label: "Rose" },
  { value: "#b45309", label: "Ambre" },
  { value: "#0f766e", label: "Émeraude" },
];

const PLAN_INFO: Record<string, { label: string; desc: string; badge: { bg: string; text: string } }> = {
  gratuit:  { label: "Gratuit",  desc: "1 menu · 10 plats · 3 catégories",               badge: { bg: "#F0EDEC", text: "#6B5B53" } },
  standard: { label: "Standard", desc: "3 menus · 50 plats · 10 catégories",              badge: { bg: "#FFF0E8", text: "var(--color-primary)" } },
  premium:  { label: "Premium",  desc: "Illimité · Statistiques avancées · Multi-langue", badge: { bg: "#1C1B1B", text: "#FFB595" } },
};

export default function SettingsForm({ restaurant }: { restaurant: DbRestaurant }) {
  const [name,         setName]         = useState(restaurant.name);
  const [address,      setAddress]      = useState(restaurant.address ?? "");
  const [phone,        setPhone]        = useState(restaurant.phone ?? "");
  const [logoUrl,      setLogoUrl]      = useState(restaurant.logo_url ?? "");
  const [preview,      setPreview]      = useState(restaurant.logo_url ?? "");
  const [primaryColor,  setPrimaryColor]  = useState(restaurant.primary_color ?? "#9e3d00");
  const [colorStatus,   setColorStatus]   = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saving,        setSaving]        = useState(false);
  const [uploading,     setUploading]     = useState(false);
  const [feedback,      setFeedback]      = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plan = PLAN_INFO[restaurant.plan] ?? PLAN_INFO.gratuit;

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setFeedback(null);
    const fd = new FormData();
    fd.append("logo", file);
    const result = await uploadLogo(fd);
    if (result.error) {
      setFeedback({ type: "error", msg: result.error });
      setPreview(restaurant.logo_url ?? "");
    } else if (result.url) {
      setLogoUrl(result.url);
    }
    setUploading(false);
  }

  async function saveColor(color: string) {
    setColorStatus("saving");
    const result = await updateRestaurantProfile({ name, address, phone, logo_url: logoUrl, primary_color: color });
    if (result?.error) {
      setColorStatus("error");
    } else {
      setColorStatus("saved");
      setTimeout(() => setColorStatus("idle"), 2000);
    }
  }

  async function handlePaletteClick(color: string) {
    setPrimaryColor(color);
    await saveColor(color);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    const result = await updateRestaurantProfile({ name, address, phone, logo_url: logoUrl, primary_color: primaryColor });
    if (result?.error) {
      setFeedback({ type: "error", msg: result.error });
    } else {
      setFeedback({ type: "success", msg: "Profil mis à jour avec succès." });
    }
    setSaving(false);
  }

  return (
    <div className="max-w-2xl space-y-5">

      {/* ── Plan actif ── */}
      <div className="bg-white rounded-2xl border border-[#EDE8E5] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#A09088" }}>
            Plan actif
          </p>
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ backgroundColor: plan.badge.bg, color: plan.badge.text }}
            >
              {plan.label}
            </span>
          </div>
          <p className="text-sm" style={{ color: "#6B5B53" }}>{plan.desc}</p>
        </div>
        <button
          className="flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          Changer de plan
        </button>
      </div>

      {/* ── Profil ── */}
      <div className="bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EDE8E5]">
          <h2 className="text-sm font-black text-[#1C1B1B]" style={{ fontFamily: "var(--font-headline)" }}>
            Profil du restaurant
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">

          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#EDE8E5] bg-[#F6F4F2] flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-[#C0B4AE]" style={{ fontSize: 24 }}>restaurant</span>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/30">
                  <span className="material-symbols-outlined text-white animate-spin" style={{ fontSize: 20 }}>progress_activity</span>
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-full text-sm font-bold border border-[#EDE8E5] text-[#1C1B1B] hover:bg-[#FAFAF9] transition-colors disabled:opacity-50"
              >
                {uploading ? "Envoi en cours…" : "Changer le logo"}
              </button>
              <p className="text-xs mt-1.5" style={{ color: "#A09088" }}>PNG, JPG — max 2 MB</p>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>

          {/* Fields */}
          <Field label="Nom du restaurant *">
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex : Le Petit Bistro"
              icon="storefront"
            />
          </Field>

          <Field label="Adresse">
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex : 12 Avenue Cheikh Anta Diop, Dakar"
              icon="location_on"
            />
          </Field>

          <Field label="Téléphone">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex : +221 77 000 00 00"
              icon="phone"
            />
          </Field>

          {/* Slug — read only */}
          <Field label="Lien du menu public">
            <div
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 border border-[#EDE8E5]"
              style={{ backgroundColor: "#F6F4F2" }}
            >
              <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 18, color: "#A09088" }}>link</span>
              <span className="text-sm truncate" style={{ color: "#6B5B53" }}>/menu/{restaurant.slug}</span>
            </div>
          </Field>

          {/* Feedback */}
          {feedback && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
              style={
                feedback.type === "success"
                  ? { backgroundColor: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }
                  : { backgroundColor: "#FFF0EE", color: "#93000A", border: "1px solid #FFDAD6" }
              }
            >
              <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 17, marginTop: 1 }}>
                {feedback.type === "success" ? "check_circle" : "error_outline"}
              </span>
              {feedback.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-55 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {saving ? (
              <>
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                Enregistrement…
              </>
            ) : "Enregistrer les modifications"}
          </button>
        </form>
      </div>

      {/* ── Apparence ── */}
      <div className="bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EDE8E5] flex items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-black text-[#1C1B1B]" style={{ fontFamily: "var(--font-headline)" }}>
              Couleur principale
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#A09088" }}>
              Appliquée sur le menu public visible par vos clients
            </p>
          </div>
          {/* Statut + aperçu */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {colorStatus === "saving" && (
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: 16, color: "#A09088" }}>progress_activity</span>
            )}
            {colorStatus === "saved" && (
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#15803D" }}>check_circle</span>
            )}
            {colorStatus === "error" && (
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#BA1A1A" }}>error_outline</span>
            )}
            <div
              className="w-8 h-8 rounded-xl border border-[#EDE8E5] transition-colors"
              style={{ backgroundColor: primaryColor }}
            />
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          {restaurant.plan === "gratuit" ? (
            /* Gratuit : verrouillé */
            <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ backgroundColor: "#F6F4F2" }}>
              <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ fontSize: 18, color: "#A09088" }}>lock</span>
              <div>
                <p className="text-sm font-semibold text-[#1C1B1B]">Personnalisation non disponible</p>
                <p className="text-xs mt-0.5" style={{ color: "#A09088" }}>
                  Passez au plan Standard pour choisir parmi 8 couleurs, ou Premium pour une couleur libre.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Palette prédéfinie — sauvegarde auto au clic */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#A09088" }}>
                  Palette
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {COLOR_PALETTE.map((c) => {
                    const active = primaryColor === c.value;
                    return (
                      <button
                        key={c.value}
                        type="button"
                        title={c.label}
                        onClick={() => handlePaletteClick(c.value)}
                        disabled={colorStatus === "saving"}
                        className="w-9 h-9 rounded-full transition-transform hover:scale-110 relative disabled:opacity-50"
                        style={{
                          backgroundColor: c.value,
                          outline: active ? `3px solid ${c.value}` : "none",
                          outlineOffset: "2px",
                          border: "2px solid rgba(255,255,255,0.7)",
                        }}
                      >
                        {active && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white" style={{ fontSize: 16 }}>check</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Couleur libre — Premium, bouton Appliquer dédié */}
              {restaurant.plan === "premium" && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#A09088" }}>
                    Couleur personnalisée
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border border-[#EDE8E5] p-0.5"
                      style={{ backgroundColor: "transparent" }}
                    />
                    <span className="text-sm font-mono font-semibold text-[#1C1B1B]">
                      {primaryColor.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => saveColor(primaryColor)}
                      disabled={colorStatus === "saving"}
                      className="ml-auto px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {colorStatus === "saving" ? "…" : "Appliquer"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Danger zone ── */}
      <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-100">
          <h3 className="text-sm font-black" style={{ color: "#BA1A1A", fontFamily: "var(--font-headline)" }}>
            Zone de danger
          </h3>
        </div>
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm" style={{ color: "#6B5B53" }}>
            Supprimer votre compte supprime définitivement toutes vos données.
          </p>
          <button
            className="self-start sm:self-auto flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors hover:bg-red-100"
            style={{ backgroundColor: "#FFF0EE", color: "#BA1A1A" }}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5 text-[#1C1B1B]">{label}</label>
      {children}
    </div>
  );
}

function Input({ icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 transition-colors"
      style={{
        border: `1.5px solid ${focused ? "var(--color-primary)" : "#E0D9D5"}`,
        backgroundColor: focused ? "#FFFBF9" : "#FAFAF9",
      }}
    >
      <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 18, color: focused ? "var(--color-primary)" : "#A09088" }}>
        {icon}
      </span>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e); }}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#C0B4AE] min-w-0"
        style={{ color: "#1C1B1B", fontFamily: "var(--font-body)" }}
      />
    </div>
  );
}
