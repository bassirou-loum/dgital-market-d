-- ============================================================
-- Migration : équipe (restaurant_members) + abonnement
-- À exécuter dans Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. Colonnes abonnement sur restaurants
-- ============================================================

alter table public.restaurants
  add column if not exists subscription_status text not null default 'active'
    check (subscription_status in ('none', 'trial', 'active', 'expired')),
  add column if not exists subscription_start  timestamptz,
  add column if not exists subscription_end    timestamptz;

-- Mettre à jour les restaurants existants
update public.restaurants
set subscription_status = 'active', subscription_start = created_at
where subscription_status = 'active' and subscription_start is null;

-- ============================================================
-- 2. Table restaurant_members (employés)
-- ============================================================

create table if not exists public.restaurant_members (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  display_name  text,
  joined_at     timestamptz not null default now(),
  unique(restaurant_id, user_id)
);

alter table public.restaurant_members enable row level security;

-- Le propriétaire gère tous les membres de son restaurant
drop policy if exists "owner_manage_members" on public.restaurant_members;
create policy "owner_manage_members" on public.restaurant_members
  for all using (
    exists (
      select 1 from public.restaurants r
      where r.id = restaurant_members.restaurant_id
        and r.owner_id = auth.uid()
    )
  );

-- Un membre peut lire sa propre entrée
drop policy if exists "member_read_own" on public.restaurant_members;
create policy "member_read_own" on public.restaurant_members
  for select using (auth.uid() = user_id);

-- ============================================================
-- 3. Mise à jour du trigger handle_new_user
--    → ne pas créer de restaurant pour les employés
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  new_restaurant_id uuid;
  new_menu_id       uuid;
  restaurant_name   text;
  base_slug         text;
  final_slug        text;
  counter           integer := 0;
begin
  -- Employés : pas de restaurant automatique
  if (new.raw_user_meta_data->>'is_employee')::boolean = true then
    return new;
  end if;

  restaurant_name := coalesce(new.raw_user_meta_data->>'restaurant_name', 'Mon Restaurant');

  -- Générer un slug unique
  base_slug  := lower(regexp_replace(restaurant_name, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug  := regexp_replace(trim(base_slug), '\s+', '-', 'g');
  final_slug := base_slug;

  while exists (select 1 from public.restaurants where slug = final_slug) loop
    counter    := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;

  -- Créer le restaurant
  insert into public.restaurants (owner_id, name, slug, subscription_status, subscription_start)
  values (new.id, restaurant_name, final_slug, 'active', now())
  returning id into new_restaurant_id;

  -- Créer le menu principal
  insert into public.menus (restaurant_id, name)
  values (new_restaurant_id, 'Menu principal')
  returning id into new_menu_id;

  -- Catégories par défaut
  insert into public.categories (menu_id, name, position) values
    (new_menu_id, 'Entrées',  0),
    (new_menu_id, 'Plats',    1),
    (new_menu_id, 'Desserts', 2),
    (new_menu_id, 'Boissons', 3);

  return new;
end;
$$;

-- ============================================================
-- Vérification
-- ============================================================

select
  'restaurants' as table_name,
  count(*)      as rows
from public.restaurants
union all
select 'restaurant_members', count(*) from public.restaurant_members;
