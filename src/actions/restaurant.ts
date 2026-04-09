"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateRestaurantProfile(data: {
  name: string;
  address?: string;
  phone?: string;
  logo_url?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase
    .from("restaurants")
    .update({
      name: data.name,
      address: data.address ?? null,
      phone: data.phone ?? null,
      logo_url: data.logo_url ?? null,
    })
    .eq("owner_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/menu-editor");
  return { success: true };
}

export async function uploadLogo(formData: FormData): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const file = formData.get("logo") as File;
  if (!file || file.size === 0) return { error: "Fichier manquant" };

  const ext = file.name.split(".").pop();
  const path = `${user.id}/logo.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("logos")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from("logos")
    .getPublicUrl(path);

  return { url: publicUrl };
}

export async function uploadDishImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const file = formData.get("image") as File;
  if (!file || file.size === 0) return { error: "Fichier manquant" };
  if (file.size > 5 * 1024 * 1024) return { error: "Image trop lourde (max 5 MB)" };

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("dishes")
    .upload(path, file, { upsert: false, contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from("dishes")
    .getPublicUrl(path);

  return { url: publicUrl };
}
