"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

interface AuthFormProps {
  mode: Mode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "register") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { restaurant_name: restaurantName },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        setSuccess("Compte créé ! Vérifiez votre email pour confirmer.");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError("Email ou mot de passe incorrect.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
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
    <div
      className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
      style={{ backgroundColor: "var(--color-surface-container-lowest)" }}
    >
      {/* Header */}
      <div
        className="px-8 pt-10 pb-6 text-center"
        style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
        }}
      >
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
          <span
            className="material-symbols-outlined text-white text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            restaurant
          </span>
        </div>
        <h1
          className="text-3xl font-black text-white tracking-tight"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          Digital Maître D&apos;
        </h1>
        <p
          className="text-white/80 text-sm mt-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {mode === "login" ? "Connectez-vous à votre espace" : "Créez votre restaurant digital"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-8 py-8 space-y-4">
        {mode === "register" && (
          <div>
            <label
              className="block text-xs font-bold uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
            >
              Nom du restaurant *
            </label>
            <input
              type="text"
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Ex : Le Petit Bistro"
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; }}
            />
          </div>
        )}

        <div>
          <label
            className="block text-xs font-bold uppercase tracking-widest mb-2"
            style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
          >
            Email *
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

        <div>
          <div className="flex justify-between items-center mb-2">
            <label
              className="text-xs font-bold uppercase tracking-widest"
              style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
            >
              Mot de passe *
            </label>
            {mode === "login" && (
              <Link
                href="/forgot-password"
                className="text-xs font-bold transition-opacity hover:opacity-70"
                style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)" }}
              >
                Oublié ?
              </Link>
            )}
          </div>
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
          {mode === "register" && (
            <p className="text-xs mt-1" style={{ color: "var(--color-on-surface-variant)" }}>
              Minimum 6 caractères
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
            style={{ backgroundColor: "#ffdad6", color: "#93000a", fontFamily: "var(--font-body)" }}
          >
            <span className="material-symbols-outlined text-sm">error_outline</span>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            className="px-4 py-3 rounded-2xl text-sm flex items-center gap-2"
            style={{ backgroundColor: "#dcfce7", color: "#15803d", fontFamily: "var(--font-body)" }}
          >
            <span className="material-symbols-outlined text-sm">check_circle</span>
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-full font-bold text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          style={{
            background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
            fontFamily: "var(--font-label)",
            fontSize: "0.9375rem",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              {mode === "login" ? "Connexion..." : "Création..."}
            </span>
          ) : (
            mode === "login" ? "Se connecter" : "Créer mon compte"
          )}
        </button>
      </form>

      {/* Footer link */}
      <div
        className="px-8 pb-8 text-center"
      >
        <p className="text-sm" style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
          {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
          <Link
            href={mode === "login" ? "/register" : "/login"}
            className="font-bold transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            {mode === "login" ? "Créer un compte" : "Se connecter"}
          </Link>
        </p>
      </div>
    </div>
  );
}
