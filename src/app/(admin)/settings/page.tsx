import type { Metadata } from "next";
import { getMyRestaurant } from "@/lib/dal/restaurant";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = { title: "Paramètres — Digital Maître D'" };

export default async function SettingsPage() {
  const restaurant = await getMyRestaurant();

  return (
    <div className="py-8">
      <header className="mb-10">
        <h1
          className="text-4xl font-black tracking-tight mb-2"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
        >
          Paramètres
        </h1>
        <p style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
          Gérez le profil de votre restaurant et votre abonnement.
        </p>
      </header>

      <SettingsForm restaurant={restaurant} />
    </div>
  );
}
