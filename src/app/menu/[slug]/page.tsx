import { notFound } from "next/navigation";
import { getRestaurantBySlug } from "@/lib/dal/restaurant";
import { getActiveMenu } from "@/lib/dal/menu";
import MenuHeader from "@/components/menu/MenuHeader";
import DailySpecial from "@/components/menu/DailySpecial";
import CategoryNav from "@/components/menu/CategoryNav";
import MenuSection from "@/components/menu/MenuSection";

import type { Restaurant, MenuCategory, MenuItem } from "@/types/menu";
import type { Badge } from "@/types/menu";
import type { Metadata } from "next";

/** Calcule si le texte par-dessus la couleur doit être blanc ou sombre */
function onColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.45 ? "#1C1B1B" : "#ffffff";
}

/** Éclaircit légèrement un hex pour `--color-primary-container` */
function lighten(hex: string, amount = 0.15): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + Math.round(255 * amount));
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + Math.round(255 * amount));
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

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
      variants: item.variants ?? [],
    })),
  }));

  const restaurant: Restaurant = {
    id: dbRestaurant.id,
    slug: dbRestaurant.slug,
    name: dbRestaurant.name,
    address: dbRestaurant.address ?? "",
    logo: dbRestaurant.logo_url ?? undefined,
    primaryColor: dbRestaurant.primary_color ?? undefined,
    categories,
    dailySpecial:
      menu?.daily_special_title
        ? { title: menu.daily_special_title, image: menu.daily_special_image_url ?? "" }
        : undefined,
  };

  const customColor = restaurant.primaryColor;

  return (
    <div
      className="pb-10"
      style={{
        backgroundColor: "var(--color-background)",
        fontFamily: "var(--font-body)",
        color: "var(--color-on-surface)",
        minHeight: "100dvh",
      }}
    >
      {customColor && (
        <style>{`
          :root {
            --color-primary: ${customColor};
            --color-primary-container: ${lighten(customColor)};
            --color-on-primary: ${onColor(customColor)};
          }
        `}</style>
      )}
      <MenuHeader restaurant={restaurant} />

      <main className="pt-32 px-5 pb-10 max-w-lg mx-auto">
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

    </div>
  );
}
