export type Badge = "V" | "GF" | "VG" | "SPICY" | "NEW" | "CHEF";

export interface ItemVariant {
  id?: string;
  name: string;
  price: number;
  position: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  available: boolean;
  badges?: Badge[];
  variants?: ItemVariant[];
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  address: string;
  logo?: string;
  coverImage?: string;
  dailySpecial?: {
    title: string;
    image: string;
  };
  categories: MenuCategory[];
}
