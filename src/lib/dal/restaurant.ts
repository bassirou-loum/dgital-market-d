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
}

/** Récupère le restaurant de l'utilisateur connecté. Redirige si non connecté. */
export async function getMyRestaurant(): Promise<DbRestaurant> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("restaurants")
    .select("id, name, slug, address, phone, logo_url, plan")
    .eq("owner_id", user.id)
    .single();

  if (error || !data) redirect("/login");

  return data as DbRestaurant;
}

/** Récupère un restaurant par slug (page publique). */
export async function getRestaurantBySlug(slug: string): Promise<DbRestaurant | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("restaurants")
    .select("id, name, slug, address, phone, logo_url, plan")
    .eq("slug", slug)
    .single();

  return data ?? null;
}
