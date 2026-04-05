"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Badge } from "@/types/menu";

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { supabase, user };
}

// ── Items ─────────────────────────────────────────────────────────────────────

export async function toggleItemAvailable(itemId: string, available: boolean) {
  const { supabase } = await getAuthUser();

  await supabase
    .from("items")
    .update({ available })
    .eq("id", itemId);

  revalidatePath("/menu-editor");
  revalidatePath("/dashboard");
}

export async function saveItem(
  categoryId: string,
  data: {
    id?: string;
    name: string;
    description?: string;
    price: number;
    currency?: string;
    image_url?: string;
    available: boolean;
    badges?: Badge[];
  }
) {
  const { supabase } = await getAuthUser();

  const payload = {
    category_id: categoryId,
    name: data.name,
    description: data.description ?? null,
    price: data.price,
    currency: data.currency ?? "FCFA",
    image_url: data.image_url ?? null,
    available: data.available,
    badges: data.badges ?? [],
  };

  if (data.id) {
    await supabase.from("items").update(payload).eq("id", data.id);
  } else {
    await supabase.from("items").insert(payload);
  }

  revalidatePath("/menu-editor");
}

export async function deleteItem(itemId: string) {
  const { supabase } = await getAuthUser();
  await supabase.from("items").delete().eq("id", itemId);
  revalidatePath("/menu-editor");
  revalidatePath("/dashboard");
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function addCategory(menuId: string, name: string) {
  const { supabase } = await getAuthUser();

  const { data: existing } = await supabase
    .from("categories")
    .select("position")
    .eq("menu_id", menuId)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const position = (existing?.position ?? -1) + 1;

  await supabase.from("categories").insert({ menu_id: menuId, name, position });

  revalidatePath("/menu-editor");
}

export async function deleteCategory(categoryId: string) {
  const { supabase } = await getAuthUser();
  await supabase.from("categories").delete().eq("id", categoryId);
  revalidatePath("/menu-editor");
}

// ── Plat du jour ─────────────────────────────────────────────────────────────

export async function updateDailySpecial(
  menuId: string,
  data: { title: string; image_url: string } | null
) {
  const { supabase } = await getAuthUser();

  await supabase
    .from("menus")
    .update({
      daily_special_title: data?.title ?? null,
      daily_special_image_url: data?.image_url ?? null,
    })
    .eq("id", menuId);

  revalidatePath("/menu-editor");
}

// ── Menu Views (page publique) ────────────────────────────────────────────────

export async function recordMenuView(restaurantId: string, itemId?: string) {
  const { supabase } = await getAuthUser();

  await supabase.from("menu_views").insert({
    restaurant_id: restaurantId,
    item_id: itemId ?? null,
  });
}
