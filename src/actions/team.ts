"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

async function getOwnerRestaurant() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();

  if (!restaurant) throw new Error("Restaurant introuvable");
  return { supabase, user, restaurant };
}

/** Créer un compte employé et le lier au restaurant */
export async function createEmployee(
  email: string,
  password: string,
  displayName: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const { restaurant } = await getOwnerRestaurant();
    const admin = createAdminClient();

    // Créer l'user sans email de confirmation
    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName, is_employee: true },
    });

    if (createError || !newUser.user) {
      if (createError?.message?.includes("already registered")) {
        return { error: "Cet email est déjà utilisé." };
      }
      return { error: createError?.message ?? "Erreur lors de la création." };
    }

    // Lier l'employé au restaurant
    const { error: memberError } = await admin
      .from("restaurant_members")
      .insert({
        restaurant_id: restaurant.id,
        user_id: newUser.user.id,
        display_name: displayName,
      });

    if (memberError) {
      // Rollback : supprimer l'user créé
      await admin.auth.admin.deleteUser(newUser.user.id);
      return { error: "Erreur lors de la liaison au restaurant." };
    }

    revalidatePath("/settings");
    return { success: true };
  } catch (e: any) {
    return { error: e.message ?? "Erreur inconnue" };
  }
}

/** Supprimer un employé */
export async function deleteEmployee(
  memberId: string,
  userId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const { restaurant } = await getOwnerRestaurant();
    const admin = createAdminClient();

    // Supprimer le membership
    const { error } = await admin
      .from("restaurant_members")
      .delete()
      .eq("id", memberId)
      .eq("restaurant_id", restaurant.id);

    if (error) return { error: "Erreur lors de la suppression." };

    // Supprimer le compte auth
    await admin.auth.admin.deleteUser(userId);

    revalidatePath("/settings");
    return { success: true };
  } catch (e: any) {
    return { error: e.message ?? "Erreur inconnue" };
  }
}

/** Récupérer les employés du restaurant */
export async function getTeamMembers() {
  const { supabase, restaurant } = await getOwnerRestaurant();

  const { data, error } = await supabase
    .from("restaurant_members")
    .select("id, user_id, display_name, joined_at")
    .eq("restaurant_id", restaurant.id)
    .order("joined_at");

  if (error) return [];
  return data ?? [];
}
