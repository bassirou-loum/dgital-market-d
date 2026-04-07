"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SuperAdminLogoutClient({ small }: { small?: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (small) {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#BA1A1A] hover:opacity-70 transition-opacity"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
        Déconnexion
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium w-full rounded-xl transition-colors hover:bg-red-50"
      style={{ color: "#BA1A1A" }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 19 }}>logout</span>
      Se déconnecter
    </button>
  );
}
