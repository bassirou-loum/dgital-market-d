import type { Metadata } from "next";
import QRGenerator from "@/components/admin/QRGenerator";
import { getMyRestaurant } from "@/lib/dal/restaurant";

export const metadata: Metadata = { title: "Générateur QR — Digital Maître D'" };

export default async function QRPage() {
  const restaurant = await getMyRestaurant();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const menuUrl = `${baseUrl}/menu/${restaurant.slug}`;

  return (
    <div className="py-8">
      <header className="mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold tracking-tight mb-3"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
        >
          Générateur QR
        </h1>
        <p
          className="text-lg max-w-2xl"
          style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}
        >
          Créez un lien brandé haute résolution entre vos tables et votre expérience culinaire digitale.
        </p>
      </header>

      <QRGenerator restaurantName={restaurant.name} menuUrl={menuUrl} />
    </div>
  );
}
