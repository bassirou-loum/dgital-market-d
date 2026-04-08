import type { Metadata } from "next";
import { getMyRestaurant, isTeamMember } from "@/lib/dal/restaurant";
import { getTeamMembers } from "@/actions/team";
import SettingsForm from "@/components/admin/SettingsForm";
import TeamSection from "@/components/admin/TeamSection";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Paramètres — Digital Maître D'" };

export default async function SettingsPage() {
  const [restaurant, teamMember] = await Promise.all([getMyRestaurant(), isTeamMember()]);

  // Les employés n'ont pas accès aux settings
  if (teamMember) redirect("/menu-editor");

  const members = await getTeamMembers();

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

      <div className="max-w-2xl space-y-5">
        <SettingsForm restaurant={restaurant} />
        <TeamSection members={members} />
      </div>
    </div>
  );
}
