-- ============================================================
-- Digital Maître D' — Schéma Supabase
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- Extension pour les UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- RESTAURANTS
-- ============================================================
create table public.restaurants (
  id          uuid primary key default uuid_generate_v4(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  address     text,
  phone       text,
  logo_url    text,
  plan        text not null default 'gratuit' check (plan in ('gratuit', 'standard', 'premium')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- MENUS
-- ============================================================
create table public.menus (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name          text not null default 'Menu principal',
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- CATEGORIES
-- ============================================================
create table public.categories (
  id            uuid primary key default uuid_generate_v4(),
  menu_id       uuid not null references public.menus(id) on delete cascade,
  name          text not null,
  position      integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- ITEMS (plats)
-- ============================================================
create table public.items (
  id            uuid primary key default uuid_generate_v4(),
  category_id   uuid not null references public.categories(id) on delete cascade,
  name          text not null,
  description   text,
  price         integer not null default 0,  -- en FCFA (entier)
  currency      text not null default 'FCFA',
  image_url     text,
  available     boolean not null default true,
  badges        text[] default '{}',          -- ['V', 'GF', 'CHEF', ...]
  position      integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- STATISTIQUES DE VUES
-- ============================================================
create table public.menu_views (
  id            uuid primary key default uuid_generate_v4(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  item_id       uuid references public.items(id) on delete set null,
  viewed_at     timestamptz not null default now(),
  user_agent    text
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.restaurants enable row level security;
alter table public.menus       enable row level security;
alter table public.categories  enable row level security;
alter table public.items       enable row level security;
alter table public.menu_views  enable row level security;

-- Restaurants : le propriétaire gère les siennes
create policy "owner_all_restaurants" on public.restaurants
  for all using (auth.uid() = owner_id);

-- Menus : le proprio via le restaurant
create policy "owner_all_menus" on public.menus
  for all using (
    exists (
      select 1 from public.restaurants r
      where r.id = menus.restaurant_id and r.owner_id = auth.uid()
    )
  );

-- Categories
create policy "owner_all_categories" on public.categories
  for all using (
    exists (
      select 1 from public.menus m
      join public.restaurants r on r.id = m.restaurant_id
      where m.id = categories.menu_id and r.owner_id = auth.uid()
    )
  );

-- Items
create policy "owner_all_items" on public.items
  for all using (
    exists (
      select 1 from public.categories c
      join public.menus m on m.id = c.menu_id
      join public.restaurants r on r.id = m.restaurant_id
      where c.id = items.category_id and r.owner_id = auth.uid()
    )
  );

-- Menu public : lecture anonyme via slug restaurant
create policy "public_read_restaurants" on public.restaurants
  for select using (true);

create policy "public_read_menus" on public.menus
  for select using (is_active = true);

create policy "public_read_categories" on public.categories
  for select using (true);

create policy "public_read_items" on public.items
  for select using (true);

-- Vues : insertion anonyme
create policy "anyone_insert_views" on public.menu_views
  for insert with check (true);

create policy "owner_read_views" on public.menu_views
  for select using (
    exists (
      select 1 from public.restaurants r
      where r.id = menu_views.restaurant_id and r.owner_id = auth.uid()
    )
  );

-- ============================================================
-- TRIGGER : updated_at automatique
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_restaurants_updated_at
  before update on public.restaurants
  for each row execute procedure public.set_updated_at();

create trigger set_items_updated_at
  before update on public.items
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- TRIGGER : créer restaurant + menu par défaut à l'inscription
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  new_restaurant_id uuid;
  new_menu_id uuid;
  restaurant_name text;
  base_slug text;
  final_slug text;
  counter integer := 0;
begin
  restaurant_name := coalesce(new.raw_user_meta_data->>'restaurant_name', 'Mon Restaurant');

  -- Générer un slug unique
  base_slug := lower(regexp_replace(restaurant_name, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := regexp_replace(trim(base_slug), '\s+', '-', 'g');
  final_slug := base_slug;

  while exists (select 1 from public.restaurants where slug = final_slug) loop
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  end loop;

  -- Créer le restaurant
  insert into public.restaurants (owner_id, name, slug)
  values (new.id, restaurant_name, final_slug)
  returning id into new_restaurant_id;

  -- Créer le menu principal
  insert into public.menus (restaurant_id, name)
  values (new_restaurant_id, 'Menu principal')
  returning id into new_menu_id;

  -- Créer des catégories par défaut
  insert into public.categories (menu_id, name, position) values
    (new_menu_id, 'Entrées',  0),
    (new_menu_id, 'Plats',    1),
    (new_menu_id, 'Desserts', 2),
    (new_menu_id, 'Boissons', 3);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORAGE — Bucket logos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Seul le propriétaire peut uploader dans son dossier
create policy "owner_upload_logo" on storage.objects
  for insert with check (
    bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "owner_update_logo" on storage.objects
  for update using (
    bucket_id = 'logos' and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Lecture publique des logos
create policy "public_read_logos" on storage.objects
  for select using (bucket_id = 'logos');
