"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { claimTeamAccess } from "@/actions/team";

export default function AccesPage() {
  const router = useRouter();
  const [code, setCode]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // 1. Connexion anonyme Supabase
    const { error: authError } = await supabase.auth.signInAnonymously();
    if (authError) {
      setError("Erreur de connexion. Réessayez.");
      setLoading(false);
      return;
    }

    // 2. Valider le code et créer le membership
    const result = await claimTeamAccess(code);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setSuccess(`Bienvenue ! Accès accordé à "${result.restaurantName}"`);
    setTimeout(() => router.push("/menu-editor"), 1200);
  }

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-5"
      style={{ backgroundColor: "#F6F4F2", fontFamily: "var(--font-body)" }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#FFF0E8" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: "#C64F00" }}>
              group
            </span>
          </div>
          <h1
            className="text-2xl font-black tracking-tight text-[#1C1B1B]"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Accès équipe
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B5B53" }}>
            Entrez le code fourni par votre responsable
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-[#EDE8E5] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#A09088" }}>
                Code d&apos;accès
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex : ABC12DEF"
                maxLength={8}
                autoComplete="off"
                autoCapitalize="characters"
                className="w-full px-4 py-3 rounded-xl text-center text-2xl font-black tracking-[0.3em] outline-none transition-all border-2"
                style={{
                  borderColor: error ? "#BA1A1A" : "#EDE8E5",
                  color: "#1C1B1B",
                  backgroundColor: "#FAFAF9",
                  fontFamily: "var(--font-headline)",
                }}
                onFocus={(e) => { if (!error) e.target.style.borderColor = "#C64F00"; }}
                onBlur={(e) => { if (!error) e.target.style.borderColor = "#EDE8E5"; }}
              />
            </div>

            {error && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
                style={{ backgroundColor: "#FFF0EE", color: "#BA1A1A" }}
              >
                <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 16 }}>error_outline</span>
                {error}
              </div>
            )}

            {success && (
              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#F0FDF4", color: "#15803D" }}
              >
                <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 16 }}>check_circle</span>
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !code.trim() || !!success}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold text-white transition-opacity disabled:opacity-55"
              style={{ backgroundColor: "#C64F00" }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin" style={{ fontSize: 18 }}>progress_activity</span>
                  Vérification…
                </>
              ) : "Accéder au menu"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-5" style={{ color: "#A09088" }}>
          Vous êtes propriétaire ?{" "}
          <a href="/login" className="font-semibold" style={{ color: "#C64F00" }}>
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
