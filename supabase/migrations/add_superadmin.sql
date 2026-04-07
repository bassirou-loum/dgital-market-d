-- ============================================================
-- Migration : Super Admin + Subscriptions
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Ajouter les colonnes subscription + owner_email à restaurants
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS owner_email       text,
  ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'none'
    CHECK (subscription_status IN ('none', 'trial', 'active', 'expired')),
  ADD COLUMN IF NOT EXISTS subscription_start timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_end   timestamptz;

-- 2. Backfill owner_email depuis auth.users (pour les restaurants existants)
UPDATE public.restaurants r
SET owner_email = u.email
FROM auth.users u
WHERE u.id = r.owner_id;

-- 3. Mettre à jour le trigger pour stocker l'email à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_restaurant_id uuid;
  new_menu_id       uuid;
  restaurant_name   text;
  base_slug         text;
  final_slug        text;
  counter           integer := 0;
BEGIN
  -- Ne pas créer de restaurant pour le super admin
  IF new.email = 'admin@admin.com' THEN
    RETURN new;
  END IF;

  restaurant_name := coalesce(new.raw_user_meta_data->>'restaurant_name', 'Mon Restaurant');

  base_slug  := lower(regexp_replace(restaurant_name, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug  := regexp_replace(trim(base_slug), '\s+', '-', 'g');
  final_slug := base_slug;

  WHILE exists (SELECT 1 FROM public.restaurants WHERE slug = final_slug) LOOP
    counter    := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  INSERT INTO public.restaurants (owner_id, name, slug, owner_email)
  VALUES (new.id, restaurant_name, final_slug, new.email)
  RETURNING id INTO new_restaurant_id;

  INSERT INTO public.menus (restaurant_id, name)
  VALUES (new_restaurant_id, 'Menu principal')
  RETURNING id INTO new_menu_id;

  INSERT INTO public.categories (menu_id, name, position) VALUES
    (new_menu_id, 'Entrées',  0),
    (new_menu_id, 'Plats',    1),
    (new_menu_id, 'Desserts', 2),
    (new_menu_id, 'Boissons', 3);

  RETURN new;
END;
$$;

-- 4. RLS policies pour le super admin
--    (voir tous les restaurants + les modifier)
DROP POLICY IF EXISTS "superadmin_all_restaurants" ON public.restaurants;
CREATE POLICY "superadmin_all_restaurants" ON public.restaurants
  FOR ALL USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@admin.com'
  );

DROP POLICY IF EXISTS "superadmin_read_views" ON public.menu_views;
CREATE POLICY "superadmin_read_views" ON public.menu_views
  FOR SELECT USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'admin@admin.com'
  );

-- 5. Créer le compte super admin
--    Mot de passe : Admin2025!
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_user_meta_data, raw_app_meta_data,
  created_at, updated_at,
  confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'admin@admin.com',
  crypt('Admin2025!', gen_salt('bf')),
  now(),
  '{"is_superadmin": true}'::jsonb,
  '{"provider":"email","providers":["email"]}'::jsonb,
  now(), now(), '', '', '', ''
) ON CONFLICT (id) DO NOTHING;
