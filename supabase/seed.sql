-- ============================================================
-- SEED — Données de test Digital Maître D'
-- ============================================================
-- Prérequis : avoir exécuté schema.sql + migration add_daily_special.sql
--
-- Comptes de test créés :
--   bistro@test.com     / Test1234!  → Le Petit Bistro      (plan standard)
--   maquis@test.com     / Test1234!  → Maquis Chez Maman    (plan gratuit)
--   premium@test.com    / Test1234!  → Villa Terrasse Dakar  (plan premium)
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- ÉTAPE 1 — UTILISATEURS (auth.users)
-- Le trigger handle_new_user crée automatiquement :
--   restaurant + menu + 4 catégories (Entrées, Plats, Desserts, Boissons)
-- ============================================================

insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  raw_app_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'bistro@test.com',
  crypt('Test1234!', gen_salt('bf')),
  now(),
  '{"restaurant_name": "Le Petit Bistro"}'::jsonb,
  '{"provider":"email","providers":["email"]}'::jsonb,
  now(),
  now(),
  '', '', '', ''
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'maquis@test.com',
  crypt('Test1234!', gen_salt('bf')),
  now(),
  '{"restaurant_name": "Maquis Chez Maman"}'::jsonb,
  '{"provider":"email","providers":["email"]}'::jsonb,
  now(),
  now(),
  '', '', '', ''
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'premium@test.com',
  crypt('Test1234!', gen_salt('bf')),
  now(),
  '{"restaurant_name": "Villa Terrasse Dakar"}'::jsonb,
  '{"provider":"email","providers":["email"]}'::jsonb,
  now(),
  now(),
  '', '', '', ''
)
on conflict (id) do nothing;


-- ============================================================
-- ÉTAPE 2 — INFOS RESTAURANTS (adresse, téléphone)
-- ============================================================

update public.restaurants
set
  address   = '12 Rue du Plateau, Dakar',
  phone     = '+221 77 123 45 67',
  plan      = 'standard'
where slug = 'le-petit-bistro';

update public.restaurants
set
  address   = 'Marché Sandaga, Abidjan',
  phone     = '+225 07 456 78 90',
  plan      = 'gratuit'
where slug = 'maquis-chez-maman';

update public.restaurants
set
  address   = 'Route de la Corniche Ouest, Dakar',
  phone     = '+221 78 999 00 11',
  plan      = 'premium'
where slug = 'villa-terrasse-dakar';


-- ============================================================
-- ÉTAPE 3 — PLAT DU JOUR (Le Petit Bistro)
-- ============================================================

update public.menus
set
  daily_special_title     = 'Thiéboudienne Royal au Poisson Frais',
  daily_special_image_url = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80'
where restaurant_id = (select id from public.restaurants where slug = 'le-petit-bistro');

update public.menus
set
  daily_special_title     = 'Homard Grillé Beurre Citron Vert & Caviar de Dakar',
  daily_special_image_url = 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800&q=80'
where restaurant_id = (select id from public.restaurants where slug = 'villa-terrasse-dakar');


-- ============================================================
-- ÉTAPE 4 — PLATS (Le Petit Bistro)
-- ============================================================

-- ENTRÉES
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Salade Yassa', 'Salade fraîche marinée au citron et oignon, servi avec croûtons',       1500, 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', true,  '{"V"}',    0),
  ('Nems au Poulet', 'Rouleaux croustillants garnis de poulet et légumes, sauce sweet chili', 2000, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80', true,  '{}',       1),
  ('Velouté de Patate Douce', 'Velouté onctueux à la patate douce et lait de coco, gingembre frais', 1800, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', true, '{"V","GF"}', 2),
  ('Plateau de Charcuterie', 'Sélection de charcuteries locales et fromages importés',         3500, 'https://images.unsplash.com/photo-1544025162-d76538b438e4?w=400&q=80', false, '{}',       3)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'le-petit-bistro'
  and c.name  = 'Entrées'
on conflict do nothing;

-- PLATS
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Thiéboudienne Royal', 'Riz au poisson sénégalais, légumes mijotés, sauce tomate maison — spécialité du chef', 5500, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', true,  '{"CHEF","GF"}', 0),
  ('Yassa Poulet', 'Poulet mariné grillé, sauce yassa aux oignons caramélisés et citron, riz blanc', 4500, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80', true,  '{"GF"}',        1),
  ('Mafé Bœuf', 'Ragoût de bœuf tendre à la sauce arachide, légumes de saison, couscous maison',    4800, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', true,  '{}',            2),
  ('Grillades Mixtes', 'Assortiment de viandes grillées (bœuf, agneau, poulet), sauce chimichurri',   6500, 'https://images.unsplash.com/photo-1544025162-d76538b438e4?w=400&q=80', true,  '{}',            3),
  ('Poulet Braisé Moutarde', 'Demi-poulet braisé, sauce moutarde à l''ancienne, frites maison',       4200, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80', false, '{}',            4)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'le-petit-bistro'
  and c.name  = 'Plats'
on conflict do nothing;

-- DESSERTS
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Fondant au Chocolat', 'Cœur coulant au chocolat noir 70%, glace vanille bourbon',      2500, 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80', true,  '{"V"}', 0),
  ('Salade de Fruits Tropicaux', 'Mangue, ananas, papaye, passion, menthe fraîche et sirop hibiscus', 1800, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80', true, '{"V","GF"}', 1),
  ('Tiramisu Bissap', 'Tiramisu revisité à la fleur d''hibiscus et biscuits cacao maison',  2200, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', true,  '{"V"}', 2)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'le-petit-bistro'
  and c.name  = 'Desserts'
on conflict do nothing;

-- BOISSONS
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Bissap Maison',     'Infusion de fleurs d''hibiscus, sucre de canne, menthe fraîche', 800,  'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', true, '{"V","GF"}', 0),
  ('Gingembre Frais',   'Jus de gingembre pressé, citron, miel — revitalisant',           800,  'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&q=80', true, '{"V","GF"}', 1),
  ('Diabolo Menthe',    'Limonade artisanale à la menthe fraîche',                         700,  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80', true, '{"V"}',     2),
  ('Eau Minérale 50cl', 'Kirène ou Vichy Célestins',                                       500,  'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', true, '{"V","GF"}', 3),
  ('Café Touba',        'Café sénégalais traditionnel parfumé au djar et à la cannelle',   600,  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', true, '{"V","GF"}', 4),
  ('Jus d''Ananas',     'Ananas frais pressé, sucre de canne',                            900,  'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80', true, '{"V","GF"}', 5)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'le-petit-bistro'
  and c.name  = 'Boissons'
on conflict do nothing;


-- ============================================================
-- ÉTAPE 5 — PLATS (Maquis Chez Maman)
-- ============================================================

-- PLATS
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Alloco Poulet',   'Bananes plantains frites, poulet braisé sauce piment maison',     2500, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80', true, '{"GF"}', 0),
  ('Attiéké Poisson', 'Semoule de manioc, poisson braisé, légumes, sauce tomate pimentée', 2000, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', true, '{"GF"}', 1),
  ('Foutou Soupe',    'Foutou banane, soupe de viande ou poisson, légumes',              2200, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', true, '{}',     2)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'maquis-chez-maman'
  and c.name  = 'Plats'
on conflict do nothing;

-- BOISSONS
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Bière Castel',  '33cl bien fraîche',          800,  'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80', true, '{}',     0),
  ('Sodabi',        'Eau de vie de palme locale',  1000, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', true, '{}',     1),
  ('Eau 50cl',      'Eau minérale fraîche',         300,  'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', true, '{"GF"}', 2)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'maquis-chez-maman'
  and c.name  = 'Boissons'
on conflict do nothing;


-- ============================================================
-- ÉTAPE 6 — PLATS (Villa Terrasse Dakar — Premium)
-- ============================================================

-- ENTRÉES
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Huîtres de Joal',        'Huîtres fraîches de Joal-Fadiouth, mignonette au poivre rose, citron caviar',         8500,  'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80', true,  '{"GF","CHEF"}', 0),
  ('Carpaccio de Thon Rouge', 'Thon rouge de l''Atlantique, avocat, sésame noir, vinaigrette yuzu-gingembre',         6500,  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80', true,  '{"GF"}',        1),
  ('Velouté de Homard',       'Bisque de homard maison, crème légère, pointe de piment de Cayenne',                   7000,  'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80', true,  '{"GF"}',        2),
  ('Foie Gras Poêlé',         'Foie gras de canard poêlé, chutney de mangue et piment, pain brioché maison',          9500,  'https://images.unsplash.com/photo-1544025162-d76538b438e4?w=400&q=80', true,  '{"CHEF"}',      3),
  ('Salade César Royale',     'Romaine croquante, parmesan 36 mois, anchois de Méditerranée, croûtons au beurre',     5500,  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', false, '{}',            4)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'villa-terrasse-dakar'
  and c.name  = 'Entrées'
on conflict do nothing;

-- PLATS
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Homard Grillé Beurre Citron', 'Homard entier grillé, beurre nantais au citron vert, riz pilaf aux herbes',        28000, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80', true,  '{"CHEF","GF"}', 0),
  ('Filet de Bœuf Wagyu',         'Filet de bœuf Wagyu A4, sauce Périgueux aux truffes, gratin dauphinois',           35000, 'https://images.unsplash.com/photo-1544025162-d76538b438e4?w=400&q=80', true,  '{"CHEF"}',      1),
  ('Thiéboudienne Gastronomique', 'Réinterprétation du plat national : poisson de ligne, riz au safran, légumes confits', 18000, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80', true, '{"CHEF","GF"}', 2),
  ('Langouste Thermidor',         'Langouste de l''Atlantique, sauce thermidor, gruyère affiné, légumes de saison',   24000, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80', true,  '{"GF"}',        3),
  ('Magret de Canard Rôti',       'Magret rôti, jus de tamarin et miel d''acacia, purée de patate douce vanillée',    16500, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=400&q=80', true,  '{}',            4),
  ('Risotto aux Truffes Noires',  'Risotto Carnaroli, truffe noire du Périgord, parmesan Reggiano, beurre de truffes', 15000, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&q=80', false, '{"V","CHEF"}',  5)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'villa-terrasse-dakar'
  and c.name  = 'Plats'
on conflict do nothing;

-- DESSERTS
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Soufflé au Chocolat Valrhona', 'Soufflé chaud au chocolat Guanaja 70%, glace vanille de Madagascar',              7500,  'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80', true,  '{"V","CHEF"}', 0),
  ('Mille-Feuille Caramel Beurre', 'Pâte feuilletée caramélisée, crème diplomate, caramel beurre salé breton',        6000,  'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80', true,  '{"V"}',        1),
  ('Assiette de Fromages Affinés', 'Sélection de 5 fromages affinés, confiture de figues, pain aux noix maison',      8000,  'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400&q=80', true,  '{}',           2),
  ('Île Flottante Hibiscus',       'Blancs en neige pochés, crème anglaise à l''hibiscus, caramel au miel d''acacia', 5000,  'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=80', true,  '{"V","GF"}',   3)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'villa-terrasse-dakar'
  and c.name  = 'Desserts'
on conflict do nothing;

-- BOISSONS
insert into public.items (category_id, name, description, price, currency, image_url, available, badges, position)
select
  c.id,
  v.name, v.description, v.price, 'FCFA', v.image_url, v.available, v.badges::text[], v.position
from public.categories c
join public.menus m on m.id = c.menu_id
join public.restaurants r on r.id = m.restaurant_id
cross join (values
  ('Champagne Moët & Chandon',  'Brut Impérial — flûte 15cl',                                                    18000, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80', true,  '{"GF"}',     0),
  ('Bordeaux Grand Cru',        'Château Margaux 2018 — verre 12cl',                                             22000, 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80', true,  '{"GF","V"}', 1),
  ('Cocktail Signature Terrasse','Rhum agricole, bissap infusé, citron vert, sirop de canne, gingembre frais',    6500,  'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80', true,  '{"V"}',      2),
  ('Eau Evian 75cl',            'Eau minérale naturelle des Alpes',                                               3500,  'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80', true,  '{"GF","V"}', 3),
  ('Thé de Chine Grand Cru',    'Sélection de thés rares, service à la française',                                4000,  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', true,  '{"GF","V"}', 4),
  ('Café Blue Mountain',        'Café de la Jamaïque, torréfaction artisanale, servi avec mignardises',           5500,  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', true,  '{"GF","V"}', 5)
) as v(name, description, price, image_url, available, badges, position)
where r.slug = 'villa-terrasse-dakar'
  and c.name  = 'Boissons'
on conflict do nothing;


-- ============================================================
-- ÉTAPE 7 — STATISTIQUES DE VUES (pour le dashboard)
-- ============================================================

insert into public.menu_views (restaurant_id, viewed_at)
select
  r.id,
  now() - (random() * interval '30 days')
from
  public.restaurants r,
  generate_series(1, 40) gs
where r.slug = 'le-petit-bistro';

insert into public.menu_views (restaurant_id, viewed_at)
select
  r.id,
  now() - (random() * interval '30 days')
from
  public.restaurants r,
  generate_series(1, 18) gs
where r.slug = 'maquis-chez-maman';

insert into public.menu_views (restaurant_id, viewed_at)
select
  r.id,
  now() - (random() * interval '30 days')
from
  public.restaurants r,
  generate_series(1, 120) gs
where r.slug = 'villa-terrasse-dakar';


-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================

select
  r.name        as restaurant,
  r.slug        as slug,
  r.plan        as plan,
  count(distinct c.id) as categories,
  count(distinct i.id) as plats
from public.restaurants r
left join public.menus       m on m.restaurant_id = r.id
left join public.categories  c on c.menu_id       = m.id
left join public.items       i on i.category_id   = c.id
group by r.name, r.slug, r.plan
order by r.name;
