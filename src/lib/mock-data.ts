import { Restaurant } from "@/types/menu";

export const mockRestaurant: Restaurant = {
  id: "1",
  slug: "le-petit-bistro",
  name: "Le Petit Bistro",
  address: "12 Rue de la Paix, Paris",
  dailySpecial: {
    title: "Canard Confit à la Réduction de Cerise",
    image: "https://images.unsplash.com/photo-1544025162-d76594e81823?w=800&q=80",
  },
  categories: [
    {
      id: "entrees",
      name: "Entrées",
      items: [
        {
          id: "1",
          name: "Betterave & Chèvre",
          description: "Betteraves rôties, chèvre fouetté, noix torréfiées et réduction balsamique au miel.",
          price: 9200,
          currency: "FCFA",
          image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
          available: true,
          badges: ["V"],
        },
        {
          id: "2",
          name: "Soupe à l'Oignon Classique",
          description: "Oignons caramélisés dans un bouillon de bœuf riche, gratiné au Gruyère.",
          price: 7800,
          currency: "FCFA",
          image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&q=80",
          available: true,
        },
      ],
    },
    {
      id: "plats",
      name: "Plats",
      items: [
        {
          id: "3",
          name: "Steak Frites",
          description: "Entrecôte élevée à l'herbe, frites maison à la truffe et beurre maître d'hôtel.",
          price: 20800,
          currency: "FCFA",
          image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80",
          available: true,
        },
        {
          id: "4",
          name: "Saint-Jacques Poêlées",
          description: "Noix de Saint-Jacques, purée de chou-fleur, lardons croustillants et beurre noisette.",
          price: 18500,
          currency: "FCFA",
          image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
          available: true,
          badges: ["GF"],
        },
      ],
    },
    {
      id: "desserts",
      name: "Desserts",
      items: [
        {
          id: "5",
          name: "Crème Brûlée",
          description: "Crème vanille onctueuse sous une croûte de caramel craquante.",
          price: 5500,
          currency: "FCFA",
          image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600&q=80",
          available: true,
          badges: ["V"],
        },
        {
          id: "6",
          name: "Fondant au Chocolat",
          description: "Cœur coulant au chocolat noir 70%, boule de glace vanille.",
          price: 6200,
          currency: "FCFA",
          image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
          available: false,
        },
      ],
    },
    {
      id: "boissons",
      name: "Boissons",
      items: [
        {
          id: "7",
          name: "Bissap Frais",
          description: "Infusion d'hibiscus maison, menthe et sucre de canne.",
          price: 2500,
          currency: "FCFA",
          available: true,
          badges: ["V", "GF"],
        },
        {
          id: "8",
          name: "Eau Minérale",
          description: "Plate ou gazeuse, 50cl.",
          price: 1500,
          currency: "FCFA",
          available: true,
        },
      ],
    },
  ],
};
