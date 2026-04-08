"use client";

import { useState, useTransition } from "react";
import { Restaurant, MenuCategory, MenuItem, Badge } from "@/types/menu";
import CategorySidebar from "./CategorySidebar";
import DishCard from "./DishCard";
import DishModal from "./DishModal";
import CategoryModal from "./CategoryModal";
import DailySpecialPanel from "./DailySpecialPanel";
import { toggleItemAvailable, saveItem, deleteItem, addCategory } from "@/actions/menu";

function calcPerformance(categories: MenuCategory[]): number {
  const all = categories.flatMap((c) => c.items);
  if (!all.length) return 100;
  return Math.round((all.filter((i) => i.available).length / all.length) * 100);
}

export default function MenuEditorClient({
  restaurant,
  menuId,
  dailySpecialTitle,
  dailySpecialImage,
}: {
  restaurant: Restaurant;
  menuId: string;
  dailySpecialTitle?: string | null;
  dailySpecialImage?: string | null;
}) {
  const [categories,  setCategories]  = useState<MenuCategory[]>(restaurant.categories);
  const [activeCatId, setActiveCatId] = useState(restaurant.categories[0]?.id ?? "");
  const [viewGrid,    setViewGrid]    = useState(true);
  const [isPending,   startTransition] = useTransition();

  const [showDishModal,     setShowDishModal]     = useState(false);
  const [editingItem,       setEditingItem]       = useState<MenuItem | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const activeCategory = categories.find((c) => c.id === activeCatId);
  const performance    = calcPerformance(categories);

  function handleToggleAvailable(itemId: string) {
    const item = categories.flatMap((c) => c.items).find((i) => i.id === itemId);
    if (!item) return;
    const next = !item.available;
    setCategories((prev) =>
      prev.map((cat) => ({ ...cat, items: cat.items.map((i) => i.id === itemId ? { ...i, available: next } : i) }))
    );
    startTransition(() => { toggleItemAvailable(itemId, next); });
  }

  function handleSaveDish(data: Omit<MenuItem, "id"> & { id?: string }) {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== activeCatId) return cat;
        if (data.id) {
          return { ...cat, items: cat.items.map((i) => i.id === data.id ? { ...i, ...data, id: i.id } : i) };
        }
        return { ...cat, items: [...cat.items, { ...data, id: `item-${Date.now()}` }] };
      })
    );
    setShowDishModal(false);
    setEditingItem(null);
    startTransition(() => {
      saveItem(activeCatId, {
        id: data.id, name: data.name, description: data.description,
        price: data.price, currency: data.currency, image_url: data.image,
        available: data.available, badges: data.badges as Badge[],
        variants: data.variants,
      });
    });
  }

  function handleDeleteDish(itemId: string) {
    if (!confirm("Supprimer ce plat ?")) return;
    setCategories((prev) => prev.map((cat) => ({ ...cat, items: cat.items.filter((i) => i.id !== itemId) })));
    startTransition(() => { deleteItem(itemId); });
  }

  function handleAddCategory(name: string) {
    const tempId = `cat-${Date.now()}`;
    setCategories((prev) => [...prev, { id: tempId, name, items: [] }]);
    setActiveCatId(tempId);
    setShowCategoryModal(false);
    startTransition(() => { addCategory(menuId, name); });
  }

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-black tracking-tight text-[#1C1B1B]"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {restaurant.name}
          </h2>
          <p className="text-sm mt-1" style={{ color: "#6B5B53" }}>
            Gérez vos catégories, prix et disponibilités.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold border border-[#EDE8E5] bg-white text-[#1C1B1B] hover:bg-[#FAFAF9] transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>create_new_folder</span>
            Catégorie
          </button>
          <button
            onClick={() => { setEditingItem(null); setShowDishModal(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 17 }}>add</span>
            Ajouter un plat
          </button>
        </div>
      </div>

      {/* ── Plat du jour ── */}
      <DailySpecialPanel
        menuId={menuId}
        currentTitle={dailySpecialTitle ?? null}
        currentImage={dailySpecialImage ?? null}
        allItems={categories.flatMap((c) => c.items)}
      />

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <CategorySidebar
          categories={categories}
          activeId={activeCatId}
          onSelect={setActiveCatId}
          performance={performance}
        />

        {/* Items area */}
        <div className="lg:col-span-9">
          {/* Section header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#1C1B1B]" style={{ fontFamily: "var(--font-headline)" }}>
                {activeCategory?.name ?? "—"}
              </h3>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#F0EDEC", color: "#6B5B53" }}
              >
                {activeCategory?.items.length ?? 0} plats
              </span>
              {isPending && (
                <span className="material-symbols-outlined animate-spin text-sm" style={{ color: "#A09088", fontSize: 16 }}>
                  progress_activity
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#EDE8E5] rounded-xl p-1">
              <button
                onClick={() => setViewGrid(true)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: viewGrid ? "#FFF0E8" : "transparent", color: viewGrid ? "var(--color-primary)" : "#A09088" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>grid_view</span>
              </button>
              <button
                onClick={() => setViewGrid(false)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: !viewGrid ? "#FFF0E8" : "transparent", color: !viewGrid ? "var(--color-primary)" : "#A09088" }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>format_list_bulleted</span>
              </button>
            </div>
          </div>

          {/* Cards */}
          {activeCategory ? (
            <div className={viewGrid
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
              : "flex flex-col gap-3"
            }>
              {activeCategory.items.map((item) => (
                <DishCard
                  key={item.id}
                  item={item}
                  onToggleAvailable={handleToggleAvailable}
                  onEdit={(i) => { setEditingItem(i); setShowDishModal(true); }}
                  onDelete={handleDeleteDish}
                />
              ))}

              {/* Add card */}
              <button
                onClick={() => { setEditingItem(null); setShowDishModal(true); }}
                className="rounded-2xl border-2 border-dashed border-[#E0D9D5] flex flex-col items-center justify-center gap-2 p-6 transition-colors hover:border-[#C64F00] hover:bg-[#FFF8F5] group"
                style={{ minHeight: activeCategory.items.length > 0 ? "180px" : "320px" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: "#FFF0E8" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: "var(--color-primary)" }}>add</span>
                </div>
                <p className="text-sm font-bold text-[#1C1B1B]">Nouveau plat</p>
                <p className="text-xs text-center" style={{ color: "#A09088" }}>
                  Ajouter dans {activeCategory.name}
                </p>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: "#E0D9D5" }}>restaurant_menu</span>
              <p className="mt-3 text-sm font-medium" style={{ color: "#A09088" }}>
                Sélectionnez une catégorie
              </p>
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
