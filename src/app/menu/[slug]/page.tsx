import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/lib/dal/restaurant";
import { getActiveMenu } from "@/lib/dal/menu";
import MenuHeader from "@/components/menu/MenuHeader";
import DailySpecial from "@/components/menu/DailySpecial";
import CategoryNav from "@/components/menu/CategoryNav";
import MenuSection from "@/components/menu/MenuSection";
import BottomNav from "@/components/menu/BottomNav";
import type { Restaurant, MenuCategory, MenuItem } from "@/types/menu";
import type { Badge } from "@/types/menu";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return { title: "Menu introuvable" };
  return {
    title: `${restaurant.name} — Menu`,
    description: `Consultez le menu de ${restaurant.name}`,
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbRestaurant = await getRestaurantBySlug(slug);
  if (!dbRestaurant) notFound();

  const menu = await getActiveMenu(dbRestaurant.id);

  const categories: MenuCategory[] = (menu?.categories ?? []).map((cat): MenuCategory => ({
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
  }));

  const restaurant: Restaurant = {
    id: dbRestaurant.id,
    slug: dbRestaurant.slug,
    name: dbRestaurant.name,
    address: dbRestaurant.address ?? "",
    categories,
    dailySpecial:
      menu?.daily_special_title
        ? { title: menu.daily_special_title, image: menu.daily_special_image_url ?? "" }
        : undefined,
  };

  return (
    <div
      className="pb-32"
      style={{
        backgroundColor: "var(--color-background)",
        fontFamily: "var(--font-body)",
        color: "var(--color-on-surface)",
        minHeight: "100dvh",
      }}
    >
      <MenuHeader restaurant={restaurant} />

      <main className="pt-24 px-6 max-w-screen-sm mx-auto">
        {restaurant.dailySpecial && (
          <DailySpecial special={restaurant.dailySpecial} />
        )}

        {categories.length > 0 && (
          <CategoryNav categories={categories} />
        )}

        {categories.length > 0 ? (
          categories.map((category) => (
            <MenuSection key={category.id} category={category} />
          ))
        ) : (
          <div className="text-center py-20" style={{ color: "var(--color-on-surface-variant)" }}>
            <span className="material-symbols-outlined text-6xl opacity-20">restaurant_menu</span>
            <p className="mt-4 font-medium" style={{ fontFamily: "var(--font-body)" }}>
              Le menu est en cours de préparation.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
