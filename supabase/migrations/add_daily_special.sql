-- Migration : ajout du plat du jour
-- À exécuter dans Supabase Dashboard > SQL Editor

alter table public.menus
  add column if not exists daily_special_title    text,
  add column if not exists daily_special_image_url text;
