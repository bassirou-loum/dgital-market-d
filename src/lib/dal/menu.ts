import { createClient } from "@/lib/supabase/server";
import type { Badge } from "@/types/menu";

export interface DbItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  image_url: string | null;
  available: boolean;
  badges: Badge[];
  position: number;
}

export interface DbCategory {
  id: string;
  menu_id: string;
  name: string;
  position: number;
  items: DbItem[];
}

export interface DbMenu {
  id: string;
  restaurant_id: string;
  name: string;
  daily_special_title: string | null;
  daily_special_image_url: string | null;
  categories: DbCategory[];
}

/** Récupère le menu actif d'un restaurant avec catégories et plats. */
export async function getActiveMenu(restaurantId: string): Promise<DbMenu | null> {
  const supabase = await createClient();

  const { data: menu } = await supabase
    .from("menus")
    .select("id, restaurant_id, name, daily_special_title, daily_special_image_url")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .single();

  if (!menu) return null;

  const { data: categories } = await supabase
    .from("categories")
    .select("id, menu_id, name, position")
    .eq("menu_id", menu.id)
    .order("position");

  if (!categories?.length) return { ...menu, categories: [] };

  const categoryIds = categories.map((c) => c.id);

  const { data: items } = await supabase
    .from("items")
    .select("id, category_id, name, description, price, currency, image_url, available, badges, position")
    .in("category_id", categoryIds)
    .order("position");

  const categoriesWithItems: DbCategory[] = categories.map((cat) => ({
    ...cat,
    items: (items ?? [])
      .filter((i) => i.category_id === cat.id)
      .map((i) => ({ ...i, badges: (i.badges ?? []) as Badge[] })),
  }));

  return { ...menu, categories: categoriesWithItems };
}

/** Stats du dashboard */
export async function getDashboardStats(restaurantId: string) {
  const supabase = await createClient();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const prevWeekStart = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

  const [totalRes, todayRes, weekRes, prevWeekRes] = await Promise.all([
    supabase.from("menu_views").select("id", { count: "exact", head: true }).eq("restaurant_id", restaurantId),
    supabase.from("menu_views").select("id", { count: "exact", head: true }).eq("restaurant_id", restaurantId).gte("viewed_at", todayStart),
    supabase.from("menu_views").select("id", { count: "exact", head: true }).eq("restaurant_id", restaurantId).gte("viewed_at", weekAgo),
    supabase.from("menu_views").select("id", { count: "exact", head: true }).eq("restaurant_id", restaurantId).gte("viewed_at", prevWeekStart).lt("viewed_at", weekAgo),
  ]);

  const weekCount = weekRes.count ?? 0;
  const prevWeekCount = prevWeekRes.count ?? 1;
  const weekGrowth = Math.round(((weekCount - prevWeekCount) / prevWeekCount) * 100);

  // Plats les plus vus
  const { data: topItems } = await supabase
    .from("menu_views")
    .select("item_id")
    .eq("restaurant_id", restaurantId)
    .gte("viewed_at", weekAgo)
    .not("item_id", "is", null);

  const viewsByItem: Record<string, number> = {};
  (topItems ?? []).forEach(({ item_id }) => {
    if (item_id) viewsByItem[item_id] = (viewsByItem[item_id] ?? 0) + 1;
  });

  const topItemIds = Object.entries(viewsByItem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => id);

  let topItemsData: Array<{ id: string; name: string; price: number; image_url: string | null; views: number }> = [];

  if (topItemIds.length) {
    const { data: itemsData } = await supabase
      .from("items")
      .select("id, name, price, image_url")
      .in("id", topItemIds);

    topItemsData = (itemsData ?? []).map((item) => ({
      ...item,
      views: viewsByItem[item.id] ?? 0,
    }));
  }

  // Derniers plats modifiés
  const { data: recentItems } = await supabase
    .from("items")
    .select("id, name, available, updated_at, categories(name)")
    .order("updated_at", { ascending: false })
    .limit(5);

  return {
    totalViews: totalRes.count ?? 0,
    scansToday: todayRes.count ?? 0,
    weekGrowth,
    topItems: topItemsData,
    recentItems: (recentItems ?? []).map((i) => ({
      id: i.id,
      name: i.name,
      available: i.available,
      updatedAt: i.updated_at,
      categoryName: (i.categories as unknown as { name: string } | null)?.name ?? "—",
    })),
  };
}
