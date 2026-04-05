import { MenuCategory } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";

interface MenuSectionProps {
  category: MenuCategory;
}

export default function MenuSection({ category }: MenuSectionProps) {
  return (
    <section className="mt-16 first:mt-8" id={category.id}>
      <div className="flex items-center gap-4 mb-8">
        <h3
          className="text-3xl font-bold whitespace-nowrap"
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--color-on-surface)",
          }}
        >
          {category.name}
        </h3>
        <div
          className="h-px flex-grow"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-outline-variant) 30%, transparent)" }}
        />
      </div>
      <div className="space-y-10">
        {category.items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
