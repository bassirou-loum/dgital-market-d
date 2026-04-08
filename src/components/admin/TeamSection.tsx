"use client";

import { useState, useTransition } from "react";
import { createEmployee, deleteEmployee } from "@/actions/team";

interface Member {
  id: string;
  user_id: string;
  display_name: string | null;
  joined_at: string;
}

export default function TeamSection({ members: initial }: { members: Member[] }) {
  const [members, setMembers]     = useState<Member[]>(initial);
  const [showForm, setShowForm]   = useState(false);
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [feedback, setFeedback]   = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setName(""); setEmail(""); setPassword("");
    setShowForm(false); setFeedback(null);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;
    setFeedback(null);
    startTransition(async () => {
      const result = await createEmployee(email.trim(), password, name.trim());
      if (result.error) {
        setFeedback({ type: "error", msg: result.error });
      } else {
        setFeedback({ type: "success", msg: `Compte créé pour ${name}` });
        // Optimistic add
        setMembers((prev) => [...prev, {
          id: `temp-${Date.now()}`,
          user_id: "",
          display_name: name,
          joined_at: new Date().toISOString(),
        }]);
        setTimeout(resetForm, 1500);
      }
    });
  }

  function handleDelete(member: Member) {
    if (!confirm(`Supprimer l'accès de ${member.display_name ?? "cet employé"} ?`)) return;
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    startTransition(async () => {
      const result = await deleteEmployee(member.id, member.user_id);
      if (result.error) {
        setFeedback({ type: "error", msg: result.error });
        setMembers((prev) => [...prev, member]); // rollback
      }
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#EDE8E5] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-[#1C1B1B]" style={{ fontFamily: "var(--font-headline)" }}>
            Équipe
          </h2>
          <p className="text-xs mt-0.5" style={{ color: "#A09088" }}>
            {members.length} employé{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#C64F00" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          Ajouter
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form onSubmit={handleCreate} className="px-5 py-5 border-b border-[#EDE8E5] space-y-3" style={{ backgroundColor: "#FAFAF9" }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#A09088" }}>
            Nouveau compte employé
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nom */}
            <div
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 border"
              style={{ borderColor: "#E0D9D5", backgroundColor: "#fff" }}
            >
              <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 17, color: "#A09088" }}>badge</span>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Prénom / Nom" required
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#C0B4AE]"
                style={{ color: "#1C1B1B" }}
              />
            </div>

            {/* Email */}
            <div
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 border"
              style={{ borderColor: "#E0D9D5", backgroundColor: "#fff" }}
            >
              <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 17, color: "#A09088" }}>mail</span>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email" required
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#C0B4AE]"
                style={{ color: "#1C1B1B" }}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div
            className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 border"
            style={{ borderColor: "#E0D9D5", backgroundColor: "#fff" }}
          >
            <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 17, color: "#A09088" }}>lock</span>
            <input
              type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe" required minLength={6}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-[#C0B4AE]"
              style={{ color: "#1C1B1B" }}
            />
            <button type="button" onClick={() => setShowPass((v) => !v)} className="flex-shrink-0" style={{ color: "#A09088" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>{showPass ? "visibility_off" : "visibility"}</span>
            </button>
          </div>

          {feedback && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
              style={feedback.type === "success"
                ? { backgroundColor: "#F0FDF4", color: "#15803D" }
                : { backgroundColor: "#FFF0EE", color: "#BA1A1A" }
              }
            >
              <span className="material-symbols-outlined flex-shrink-0" style={{ fontSize: 15 }}>
                {feedback.type === "success" ? "check_circle" : "error_outline"}
              </span>
              {feedback.msg}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button" onClick={resetForm}
              className="flex-1 py-2.5 rounded-full text-sm font-bold border border-[#EDE8E5] text-[#6B5B53] hover:bg-[#F6F4F2]"
            >
              Annuler
            </button>
            <button
              type="submit" disabled={isPending}
              className="flex-1 py-2.5 rounded-full text-sm font-bold text-white disabled:opacity-55"
              style={{ backgroundColor: "#C64F00" }}
            >
              {isPending ? "Création…" : "Créer le compte"}
            </button>
          </div>
        </form>
      )}

      {/* Members list */}
      {members.length === 0 ? (
        <div className="px-5 py-8 text-center">
          <span className="material-symbols-outlined" style={{ fontSize: 36, color: "#E0D9D5" }}>group</span>
          <p className="text-sm mt-2" style={{ color: "#A09088" }}>Aucun employé pour l'instant</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#EDE8E5]">
          {members.map((m) => (
            <li key={m.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "#FFF0E8" }}
                >
                  <span className="text-sm font-black" style={{ color: "#C64F00" }}>
                    {(m.display_name ?? "?")[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1C1B1B]">{m.display_name ?? "Employé"}</p>
                  <p className="text-xs" style={{ color: "#A09088" }}>
                    Depuis le {new Date(m.joined_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(m)}
                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                style={{ color: "#A09088" }}
                title="Supprimer l'accès"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person_remove</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
