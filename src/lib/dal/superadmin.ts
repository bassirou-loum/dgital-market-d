import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface SuperAdminRestaurant {
  id: string;
  name: string;
  slug: string;
  owner_email: string | null;
  plan: "gratuit" | "standard" | "premium";
  subscription_status: "none" | "trial" | "active" | "expired";
  subscription_start: string | null;
  subscription_end: string | null;
  created_at: string;
}

/** Vérifie que l'utilisateur connecté est le superadmin */
async function assertSuperAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log("[superadmin] assertSuperAdmin →", { email: user?.email, error });
  if (!user || user.email !== "admin@admin.com") redirect("/login");
  return supabase;
}

/** Calcule le statut réel en tenant compte de la date d'expiration */
function resolveStatus(row: SuperAdminRestaurant): SuperAdminRestaurant["subscription_status"] {
  if (row.subscription_status === "none") return "none";
  if (!row.subscription_end) return row.subscription_status;
  if (new Date(row.subscription_end) < new Date()) return "expired";
  return row.subscription_status;
}

/** Liste tous les restaurants avec leur abonnement */
export async function getAllRestaurants(): Promise<SuperAdminRestaurant[]> {
  const supabase = await assertSuperAdmin();

  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, slug, owner_email, plan, subscription_status, subscription_start, subscription_end, created_at")
    .order("created_at", { ascending: false });

  console.log("[superadmin] getAllRestaurants →", { count: data?.length, error });

  if (error || !data) return [];

  return data.map((r) => ({
    ...r,
    subscription_status: resolveStatus(r as SuperAdminRestaurant),
  })) as SuperAdminRestaurant[];
}

/** Stats globales pour le dashboard superadmin */
export async function getSuperAdminStats() {
  const restaurants = await getAllRestaurants();
  return {
    total:   restaurants.length,
    active:  restaurants.filter((r) => r.subscription_status === "active").length,
    trial:   restaurants.filter((r) => r.subscription_status === "trial").length,
    expired: restaurants.filter((r) => r.subscription_status === "expired").length,
    none:    restaurants.filter((r) => r.subscription_status === "none").length,
  };
}
