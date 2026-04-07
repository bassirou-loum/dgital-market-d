import { MenuCategory } from "@/types/menu";
import MenuItemCard from "./MenuItemCard";

export default function MenuSection({ category }: { category: MenuCategory }) {
  const available = category.items.filter((i) => i.available).length;

  return (
    <section className="mt-10 first:mt-6" id={category.id}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h3
          className="text-xl font-black text-[#1C1B1B]"
          style={{ fontFamily: "var(--font-headline)" }}
        >
          {category.name}
        </h3>
        <span className="text-xs font-medium" style={{ color: "#A09088" }}>
          {available}/{category.items.length}
        </span>
      </div>

      {/* Items */}
      <div className="space-y-3">
        {category.items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
