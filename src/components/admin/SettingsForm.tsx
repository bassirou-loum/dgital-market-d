"use client";

import { useState, useRef, useTransition } from "react";
import { updateRestaurantProfile, uploadLogo } from "@/actions/restaurant";
import type { DbRestaurant } from "@/lib/dal/restaurant";

interface SettingsFormProps {
  restaurant: DbRestaurant;
}

const PLAN_INFO = {
  gratuit:  { label: "Gratuit",   color: "#78716c", desc: "1 menu · 10 plats · 3 catégories" },
  standard: { label: "Standard",  color: "#005ab7", desc: "3 menus · 50 plats · 10 catégories" },
  premium:  { label: "Premium",   color: "#9e3d00", desc: "Illimité · Stats avancées · Multi-langue" },
};

export default function SettingsForm({ restaurant }: SettingsFormProps) {
  const [name, setName] = useState(restaurant.name);
  const [address, setAddress] = useState(restaurant.address ?? "");
  const [phone, setPhone] = useState(restaurant.phone ?? "");
  const [logoUrl, setLogoUrl] = useState(restaurant.logo_url ?? "");
  const [logoPreview, setLogoPreview] = useState(restaurant.logo_url ?? "");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview immédiat
    setLogoPreview(URL.createObjectURL(file));
    setUploading(true);
    setFeedback(null);

    const fd = new FormData();
    fd.append("logo", file);
    const result = await uploadLogo(fd);

    if (result.error) {
      setFeedback({ type: "error", msg: result.error });
      setLogoPreview(restaurant.logo_url ?? "");
    } else if (result.url) {
      setLogoUrl(result.url);
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const result = await updateRestaurantProfile({ name, address, phone, logo_url: logoUrl });

    if (result?.error) {
      setFeedback({ type: "error", msg: result.error });
    } else {
      setFeedback({ type: "success", msg: "Profil mis à jour avec succès." });
    }
    setSaving(false);
  }

  const plan = PLAN_INFO[restaurant.plan];
  const inputBase = {
    backgroundColor: "var(--color-surface-container-low)",
    color: "var(--color-on-surface)",
    fontFamily: "var(--font-body)",
    border: "2px solid transparent",
    padding: "0.75rem 1rem",
    borderRadius: "1rem",
    fontSize: "0.875rem",
    outline: "none",
    width: "100%",
    transition: "border-color 0.15s",
  };

  return (
    <div className="max-w-2xl space-y-8">

      {/* Plan actuel */}
      <section
        className="rounded-3xl p-6 flex items-center justify-between"
        style={{ backgroundColor: "var(--color-surface-container-lowest)", boxShadow: "0 4px 20px rgba(90,65,56,0.04)" }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-label)", color: "var(--color-outline)" }}>
            Plan actif
          </p>
          <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-headline)", color: plan.color }}>
            {plan.label}
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
            {plan.desc}
          </p>
        </div>
        <button
          className="px-5 py-2.5 rounded-full font-bold text-sm transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
            color: "white",
            fontFamily: "var(--font-label)",
          }}
        >
          Changer de plan
        </button>
      </section>

      {/* Profil */}
      <section
        className="rounded-3xl overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-container-lowest)", boxShadow: "0 4px 20px rgba(90,65,56,0.04)" }}
      >
        <div className="px-8 py-6" style={{ borderBottom: "1px solid rgba(227,191,178,0.15)" }}>
          <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}>
            Profil du restaurant
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6">

          {/* Logo */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: "var(--color-surface-container-low)" }}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl opacity-30" style={{ color: "var(--color-on-surface-variant)" }}>
                    restaurant
                  </span>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/30">
                  <span className="material-symbols-outlined text-white animate-spin">progress_activity</span>
                </div>
              )}
            </div>
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-surface-container-low)",
                  color: "var(--color-on-surface)",
                  fontFamily: "var(--font-label)",
                }}
              >
                {uploading ? "Envoi en cours..." : "Changer le logo"}
              </button>
              <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
                PNG, JPG — max 2 MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              Nom du restaurant *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputBase}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
            />
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              Adresse
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex : 12 Avenue Cheikh Anta Diop, Dakar"
              style={inputBase}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              Téléphone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex : +221 77 000 00 00"
              style={inputBase}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
            />
          </div>

          {/* Slug (lecture seule) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
              Lien du menu public
            </label>
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm"
              style={{ backgroundColor: "var(--color-surface-container)", fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)" }}
            >
              <span className="material-symbols-outlined text-sm">link</span>
              <span className="truncate">/menu/{restaurant.slug}</span>
            </div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
              style={{
                backgroundColor: feedback.type === "success" ? "#dcfce7" : "#ffdad6",
                color: feedback.type === "success" ? "#15803d" : "#93000a",
                fontFamily: "var(--font-body)",
              }}
            >
              <span className="material-symbols-outlined text-sm">
                {feedback.type === "success" ? "check_circle" : "error_outline"}
              </span>
              {feedback.msg}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-full font-bold text-white transition-all active:scale-95 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
              fontFamily: "var(--font-label)",
              fontSize: "0.9375rem",
            }}
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                Enregistrement...
              </span>
            ) : "Enregistrer les modifications"}
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section
        className="rounded-3xl p-6"
        style={{ backgroundColor: "#fff8f6", border: "1px solid rgba(186,26,26,0.1)" }}
      >
        <h3 className="font-bold mb-1" style={{ fontFamily: "var(--font-headline)", color: "#ba1a1a" }}>
          Zone de danger
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
          Supprimer votre compte supprime définitivement toutes vos données.
        </p>
        <button
          className="px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95"
          style={{ backgroundColor: "#ffdad6", color: "#ba1a1a", fontFamily: "var(--font-label)" }}
        >
          Supprimer mon compte
        </button>
      </section>
    </div>
  );
}
