"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (err) {
      setError(err.message);
    } else {
      setSent(true);
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
      {/* Header */}
      <div
        className="px-8 pt-10 pb-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)" }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-white text-3xl">lock_reset</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
          Mot de passe oublié
        </h1>
        <p className="text-white/80 text-sm mt-1" style={{ fontFamily: "var(--font-body)" }}>
          Recevez un lien de réinitialisation
        </p>
      </div>

      <div className="px-8 py-8">
        {sent ? (
          <div className="text-center space-y-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: "#dcfce7" }}
            >
              <span className="material-symbols-outlined text-3xl" style={{ color: "#15803d" }}>mark_email_read</span>
            </div>
            <h2 className="text-xl font-bold" style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}>
              Email envoyé !
            </h2>
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
              Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 mt-4 text-sm font-bold"
              style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm" style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="chef@restaurant.com"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
              />
            </div>

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
                  Envoi...
                </span>
              ) : "Envoyer le lien"}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm font-bold" style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}>
                ← Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
