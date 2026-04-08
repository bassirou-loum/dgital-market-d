import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface DbRestaurant {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
  plan: "gratuit" | "standard" | "premium";
  subscription_status: "none" | "trial" | "active" | "expired";
  subscription_end: string | null;
}

/** Récupère le restaurant de l'utilisateur connecté (owner ou membre d'équipe). */
export async function getMyRestaurant(): Promise<DbRestaurant> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Essayer d'abord en tant que propriétaire
  const { data: owned } = await supabase
    .from("restaurants")
    .select("id, name, slug, address, phone, logo_url, plan, subscription_status, subscription_end")
    .eq("owner_id", user.id)
    .single();

  if (owned) return owned as DbRestaurant;

  // Sinon chercher en tant que membre d'équipe
  const { data: membership } = await supabase
    .from("restaurant_members")
    .select("restaurant_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/login");

  const { data: memberRestaurant, error } = await supabase
    .from("restaurants")
    .select("id, name, slug, address, phone, logo_url, plan, subscription_status, subscription_end")
    .eq("id", membership.restaurant_id)
    .single();

  if (error || !memberRestaurant) redirect("/login");

  return memberRestaurant as DbRestaurant;
}

/** Indique si l'utilisateur est membre d'équipe (pas propriétaire) */
export async function isTeamMember(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("restaurant_members")
    .select("id")
    .eq("user_id", user.id)
    .single();

  return !!data;
}

/** Récupère un restaurant par slug (page publique). */
export async function getRestaurantBySlug(slug: string): Promise<DbRestaurant | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("restaurants")
    .select("id, name, slug, address, phone, logo_url, plan, subscription_status, subscription_end")
    .eq("slug", slug)
    .single();

  return data ?? null;
}
