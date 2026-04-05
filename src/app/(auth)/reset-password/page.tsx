"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({ password });

    if (err) {
      setError(err.message);
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  }

  const inputStyle = {
    backgroundColor: "var(--color-surface-container-low)",
    color: "var(--color-on-surface)",
    fontFamily: "var(--font-body)",
    border: "2px solid transparent",
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "1rem",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style={{ backgroundColor: "var(--color-surface-container-lowest)" }}>
      <div
        className="px-8 pt-10 pb-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-white text-3xl">key</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
          Nouveau mot de passe
        </h1>
        <p className="text-white/80 text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>
          Choisissez un mot de passe sécurisé
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
            Nouveau mot de passe *
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
            Confirmer le mot de passe *
          </label>
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
          />
        </div>

        {/* Indicateur de force */}
        {password.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => {
                const strength = Math.min(Math.floor(password.length / 3), 4);
                const colors = ["#ba1a1a", "#ea580c", "#ca8a04", "#15803d"];
                return (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-colors"
                    style={{ backgroundColor: i <= strength ? colors[strength - 1] : "#e5e2e1" }}
                  />
                );
              })}
            </div>
            <p className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>
              {password.length < 6 ? "Trop court" : password.length < 9 ? "Faible" : password.length < 12 ? "Moyen" : "Fort"}
            </p>
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2" style={{ backgroundColor: "#ffdad6", color: "#93000a" }}>
            <span className="material-symbols-outlined text-sm">error_outline</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-full font-bold text-white transition-all active:scale-95 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
            fontFamily: "var(--font-label)",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              Mise à jour...
            </span>
          ) : "Mettre à jour le mot de passe"}
        </button>
      </form>
    </div>
  );
}
