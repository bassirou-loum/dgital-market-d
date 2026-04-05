import type { Metadata } from "next";
import { getMyRestaurant } from "@/lib/dal/restaurant";
import { getActiveMenu } from "@/lib/dal/menu";
import MenuEditorClient from "@/components/admin/menu-editor/MenuEditorClient";
import type { Restaurant, MenuCategory, MenuItem } from "@/types/menu";
import type { Badge } from "@/types/menu";
import Link from "next/link";

export const metadata: Metadata = { title: "Éditeur de menu — Digital Maître D'" };

export default async function MenuEditorPage() {
  const restaurant = await getMyRestaurant();
  const menu = await getActiveMenu(restaurant.id);

  if (!menu) {
    return (
      <div className="py-8 text-center">
        <span className="material-symbols-outlined text-6xl opacity-20">restaurant_menu</span>
        <p className="mt-4 font-bold" style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)" }}>
          Aucun menu trouvé.{" "}
          <Link href="/dashboard" className="underline" style={{ color: "var(--color-primary)" }}>
            Retour au dashboard
          </Link>
        </p>
      </div>
    );
  }

  // Transformer les données Supabase en types Restaurant
  const restaurantData: Restaurant = {
    id: restaurant.id,
    slug: restaurant.slug,
    name: restaurant.name,
    address: restaurant.address ?? "",
    categories: menu.categories.map((cat): MenuCategory => ({
      id: cat.id,
      name: cat.name,
      items: cat.items.map((item): MenuItem => ({
        id: item.id,
        name: item.name,
        description: item.description ?? "",
        price: item.price,
        currency: item.currency,
        image: item.image_url ?? undefined,
        available: item.available,
        badges: (item.badges ?? []) as Badge[],
      })),
    })),
  };

  return (
    <MenuEditorClient
      restaurant={restaurantData}
      menuId={menu.id}
      dailySpecialTitle={menu.daily_special_title}
      dailySpecialImage={menu.daily_special_image_url}
    />
  );
}
