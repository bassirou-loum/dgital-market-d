"use client";

import { useState, useTransition } from "react";
import { Restaurant, MenuCategory, MenuItem } from "@/types/menu";
import CategorySidebar from "./CategorySidebar";
import DishCard from "./DishCard";
import DishModal from "./DishModal";
import CategoryModal from "./CategoryModal";
import DailySpecialPanel from "./DailySpecialPanel";
import { toggleItemAvailable, saveItem, deleteItem, addCategory } from "@/actions/menu";
import type { Badge } from "@/types/menu";

function calcPerformance(categories: MenuCategory[]): number {
  const all = categories.flatMap((c) => c.items);
  if (!all.length) return 100;
  return Math.round((all.filter((i) => i.available).length / all.length) * 100);
}

interface MenuEditorClientProps {
  restaurant: Restaurant;
  menuId: string;
  dailySpecialTitle?: string | null;
  dailySpecialImage?: string | null;
}

export default function MenuEditorClient({ restaurant, menuId, dailySpecialTitle, dailySpecialImage }: MenuEditorClientProps) {
  const [categories, setCategories] = useState<MenuCategory[]>(restaurant.categories);
  const [activeCatId, setActiveCatId] = useState(restaurant.categories[0]?.id ?? "");
  const [viewGrid, setViewGrid] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [showDishModal, setShowDishModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const activeCategory = categories.find((c) => c.id === activeCatId);

  // Toggle availability — optimistic + server action
  function handleToggleAvailable(itemId: string) {
    const item = categories.flatMap((c) => c.items).find((i) => i.id === itemId);
    if (!item) return;
    const newAvailable = !item.available;

    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        items: cat.items.map((i) => i.id === itemId ? { ...i, available: newAvailable } : i),
      }))
    );

    startTransition(() => {
      toggleItemAvailable(itemId, newAvailable);
    });
  }

  // Save dish (add or edit)
  function handleSaveDish(data: Omit<MenuItem, "id"> & { id?: string }) {
    // Optimistic update
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== activeCatId) return cat;
        if (data.id) {
          return { ...cat, items: cat.items.map((item) => item.id === data.id ? { ...item, ...data, id: item.id } : item) };
        } else {
          const newItem: MenuItem = { ...data, id: `item-${Date.now()}` };
          return { ...cat, items: [...cat.items, newItem] };
        }
      })
    );
    setShowDishModal(false);
    setEditingItem(null);

    startTransition(() => {
      saveItem(activeCatId, {
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        image_url: data.image,
        available: data.available,
        badges: data.badges as Badge[],
      });
    });
  }

  // Delete dish
  function handleDeleteDish(itemId: string) {
    if (!confirm("Supprimer ce plat ?")) return;
    setCategories((prev) =>
      prev.map((cat) => ({ ...cat, items: cat.items.filter((i) => i.id !== itemId) }))
    );
    startTransition(() => { deleteItem(itemId); });
  }

  // Add category
  function handleAddCategory(name: string) {
    const tempId = `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { id: tempId, name, items: [] }]);
    setActiveCatId(tempId);
    setShowCategoryModal(false);
    startTransition(() => { addCategory(menuId, name); });
  }

  const performance = calcPerformance(categories);

  return (
    <div className="py-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2
            className="text-4xl font-black tracking-tight mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
          >
            Votre expérience culinaire
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--color-on-surface-variant)" }}>
            Gérez vos catégories, prix et disponibilités saisonnières.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all active:scale-95"
            style={{
              backgroundColor: "var(--color-surface-container-lowest)",
              border: "1px solid rgba(227,191,178,0.2)",
              color: "var(--color-on-surface-variant)",
              fontFamily: "var(--font-label)",
            }}
          >
            <span className="material-symbols-outlined text-lg">create_new_folder</span>
            Catégorie
          </button>
          <button
            onClick={() => { setEditingItem(null); setShowDishModal(true); }}
            className="px-6 py-3 rounded-full font-bold text-sm text-white flex items-center gap-2 transition-all active:scale-95 shadow-lg"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))",
              fontFamily: "var(--font-label)",
            }}
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            Ajouter un plat
          </button>
        </div>
      </div>

      {/* Plat du jour */}
      <DailySpecialPanel
        menuId={menuId}
        currentTitle={dailySpecialTitle ?? null}
        currentImage={dailySpecialImage ?? null}
        allItems={categories.flatMap((c) => c.items)}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <CategorySidebar
          categories={categories}
          activeId={activeCatId}
          onSelect={setActiveCatId}
          performance={performance}
        />

        {/* Items area */}
        <div className="lg:col-span-9">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <h3
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              {activeCategory?.name ?? "—"}
              <span
                className="font-normal ml-2"
                style={{ color: "rgba(90,65,56,0.4)" }}
              >
                {activeCategory?.items.length ?? 0} plats
              </span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewGrid(true)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: viewGrid ? "var(--color-surface-container-low)" : "transparent",
                  color: viewGrid ? "var(--color-primary)" : "var(--color-on-surface-variant)",
                }}
              >
                <span className="material-symbols-outlined">grid_view</span>
              </button>
              <button
                onClick={() => setViewGrid(false)}
                className="p-2 rounded-lg transition-colors"
                style={{
                  backgroundColor: !viewGrid ? "var(--color-surface-container-low)" : "transparent",
                  color: !viewGrid ? "var(--color-primary)" : "rgba(90,65,56,0.4)",
                }}
              >
                <span className="material-symbols-outlined">format_list_bulleted</span>
              </button>
            </div>
          </div>

          {/* Cards */}
          {activeCategory && (
            <div
              className={
                viewGrid
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {activeCategory.items.map((item) => (
                <DishCard
                  key={item.id}
                  item={item}
                  onToggleAvailable={handleToggleAvailable}
                  onEdit={(i) => { setEditingItem(i); setShowDishModal(true); }}
                  onDelete={handleDeleteDish}
                />
              ))}

              {/* Add new dish card */}
              <button
                onClick={() => { setEditingItem(null); setShowDishModal(true); }}
                className="group relative rounded-3xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer"
                style={{
                  minHeight: activeCategory.items.length > 0 ? "200px" : "400px",
                  backgroundColor: "var(--color-surface-container-low)",
                  border: "2px dashed rgba(227,191,178,0.3)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: "white", color: "var(--color-primary)" }}
                >
                  <span className="material-symbols-outlined text-4xl">add</span>
                </div>
                <p
                  className="text-xl font-bold"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
                >
                  Nouveau plat
                </p>
                <p
                  className="text-xs mt-2 text-center px-8 uppercase tracking-widest font-bold"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Ajouter dans {activeCategory.name}
                </p>
              </button>
            </div>
          )}

          {!activeCategory && (
            <div className="text-center py-20" style={{ color: "var(--color-on-surface-variant)" }}>
              <span className="material-symbols-outlined text-6xl opacity-20">restaurant_menu</span>
              <p className="mt-4 font-bold">Sélectionnez une catégorie</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showDishModal && activeCategory && (
        <DishModal
          item={editingItem}
          categoryName={activeCategory.name}
          onSave={handleSaveDish}
          onClose={() => { setShowDishModal(false); setEditingItem(null); }}
        />
      )}
      {showCategoryModal && (
        <CategoryModal
          onSave={handleAddCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </div>
  );
}
