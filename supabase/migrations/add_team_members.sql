-- ============================================================
-- Migration : Membres d'équipe (employés)
-- ============================================================

-- Table des membres liés à un restaurant
CREATE TABLE IF NOT EXISTS public.restaurant_members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  text,
  joined_at     timestamptz DEFAULT now(),
  UNIQUE(restaurant_id, user_id)
);

ALTER TABLE public.restaurant_members ENABLE ROW LEVEL SECURITY;

-- Le propriétaire gère les membres de son restaurant
CREATE POLICY "owner_manage_members" ON public.restaurant_members
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.restaurants WHERE id = restaurant_id AND owner_id = auth.uid())
  );

-- Un membre peut lire son propre membership
CREATE POLICY "member_read_own" ON public.restaurant_members
  FOR SELECT USING (user_id = auth.uid());

-- Mettre à jour les RLS items pour inclure les membres
DROP POLICY IF EXISTS "owner_all_items" ON public.items;
CREATE POLICY "owner_or_member_items" ON public.items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.categories c
      JOIN public.menus m ON m.id = c.menu_id
      JOIN public.restaurants r ON r.id = m.restaurant_id
      WHERE c.id = items.category_id AND (
        r.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.restaurant_members rm WHERE rm.restaurant_id = r.id AND rm.user_id = auth.uid())
      )
    )
  );

-- Mettre à jour les RLS categories
DROP POLICY IF EXISTS "owner_all_categories" ON public.categories;
CREATE POLICY "owner_or_member_categories" ON public.categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.menus m
      JOIN public.restaurants r ON r.id = m.restaurant_id
      WHERE m.id = categories.menu_id AND (
        r.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.restaurant_members rm WHERE rm.restaurant_id = r.id AND rm.user_id = auth.uid())
      )
    )
  );

-- Mettre à jour les RLS menus
DROP POLICY IF EXISTS "owner_all_menus" ON public.menus;
CREATE POLICY "owner_or_member_menus" ON public.menus
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = menus.restaurant_id AND (
        r.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.restaurant_members rm WHERE rm.restaurant_id = r.id AND rm.user_id = auth.uid())
      )
    )
  );

-- Mettre à jour les RLS dish_variants
DROP POLICY IF EXISTS "owner_manage_variants" ON public.dish_variants;
CREATE POLICY "owner_or_member_variants" ON public.dish_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.items i
      JOIN public.categories c ON c.id = i.category_id
      JOIN public.menus m ON m.id = c.menu_id
      JOIN public.restaurants r ON r.id = m.restaurant_id
      WHERE i.id = dish_variants.dish_id AND (
        r.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM public.restaurant_members rm WHERE rm.restaurant_id = r.id AND rm.user_id = auth.uid())
      )
    )
  );
