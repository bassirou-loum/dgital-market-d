"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (mode === "register") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { restaurant_name: restaurantName } },
      });
      if (signUpError) {
        setError(signUpError.message);
      } else {
        router.push("/en-attente");
      }
    } else {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError("Email ou mot de passe incorrect.");
      } else {
        const dest = signInData.user?.email === "admin@admin.com" ? "/superadmin" : "/dashboard";
        router.push(dest);
        router.refresh();
      }
    }

    setLoading(false);
  }

  const isLogin = mode === "login";

  return (
    <div className="w-full max-w-[420px]">

      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-black tracking-tight mb-2"
          style={{ fontFamily: "var(--font-headline)", color: "#1C1B1B" }}
        >
          {isLogin ? "Bon retour" : "Créez votre espace"}
        </h1>
        <p className="text-[15px]" style={{ color: "#6B5B53" }}>
          {isLogin
            ? "Connectez-vous pour gérer votre menu."
            : "Votre premier menu digital en moins de 3 minutes."}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Restaurant name — register only */}
        {!isLogin && (
          <Field label="Nom du restaurant">
            <Input
              type="text"
              required
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Ex : Le Petit Bistro"
              icon="storefront"
            />
          </Field>
        )}

        {/* Email */}
        <Field label="Adresse email">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="chef@restaurant.com"
            icon="mail"
          />
        </Field>

        {/* Password */}
        <Field
          label="Mot de passe"
          hint={isLogin ? undefined : "Minimum 6 caractères"}
          action={
            isLogin ? (
              <Link
                href="/forgot-password"
                className="text-xs font-semibold hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-primary)" }}
              >
                Mot de passe oublié ?
              </Link>
            ) : undefined
          }
        >
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon="lock"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09088] hover:text-[#1C1B1B] transition-colors"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </Field>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: "#FFF0EE", color: "#93000A", border: "1px solid #FFDAD6" }}
          >
            <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 17, marginTop: 1 }}>
              error_outline
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Success */}
        {success && (
          <div
            className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}
          >
            <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 17, marginTop: 1 }}>
              check_circle
            </span>
            <span>{success}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-55 disabled:cursor-not-allowed mt-1"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>
                progress_activity
              </span>
              {isLogin ? "Connexion…" : "Création…"}
            </>
          ) : (
            isLogin ? "Se connecter" : "Créer mon compte"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ backgroundColor: "#EDE8E5" }} />
        <span className="text-xs font-medium" style={{ color: "#A09088" }}>ou</span>
        <div className="flex-1 h-px" style={{ backgroundColor: "#EDE8E5" }} />
      </div>

      {/* Switch mode */}
      <p className="text-center text-sm" style={{ color: "#6B5B53" }}>
        {isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="font-bold hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-primary)" }}
        >
          {isLogin ? "Créer un compte" : "Se connecter"}
        </Link>
      </p>
    </div>
  );
}

/* ── Helpers ── */

function Field({
  label,
  hint,
  action,
  children,
}: {
  label: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold" style={{ color: "#1C1B1B" }}>
          {label}
        </label>
        {action}
      </div>
      {children}
      {hint && (
        <p className="text-xs mt-1.5" style={{ color: "#A09088" }}>{hint}</p>
      )}
    </div>
  );
}

function Input({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon: string }) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 transition-colors"
      style={{
        border: `1.5px solid ${focused ? "var(--color-primary)" : "#E0D9D5"}`,
        backgroundColor: focused ? "#FFFBF9" : "#FAFAF9",
      }}
    >
      <span
        className="material-symbols-outlined flex-shrink-0"
        style={{ fontSize: 18, color: focused ? "var(--color-primary)" : "#A09088" }}
      >
        {icon}
      </span>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#C0B4AE] min-w-0"
        style={{ color: "#1C1B1B", fontFamily: "var(--font-body)" }}
      />
    </div>
  );
}
