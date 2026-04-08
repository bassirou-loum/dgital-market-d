import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function EnAttentePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Si entre-temps le super admin a activé l'abonnement, rediriger
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("subscription_status, subscription_end")
    .eq("owner_id", user.id)
    .single();

  if (restaurant?.subscription_status === "active" || restaurant?.subscription_status === "trial") {
    redirect("/dashboard");
  }

  const isExpired = restaurant?.subscription_status === "expired";

  async function handleSignOut() {
    "use server";
    const supabase2 = await createClient();
    await supabase2.auth.signOut();
    redirect("/login");
  }

  return (
    <div
      className="min-h-dvh flex items-center justify-center px-5"
      style={{ backgroundColor: "#F6F4F2", fontFamily: "var(--font-body)" }}
    >
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: isExpired ? "#FFF0E8" : "#F6F4F2", border: "1px solid #EDE8E5" }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 36, color: isExpired ? "#C64F00" : "#A09088" }}
          >
            {isExpired ? "warning" : "hourglass_empty"}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: "#1C1B1B", fontFamily: "var(--font-headline)" }}
        >
          {isExpired ? "Abonnement expiré" : "Compte en attente d'activation"}
        </h1>

        {/* Description */}
        <p className="text-sm leading-relaxed mb-8" style={{ color: "#6B5B53" }}>
          {isExpired
            ? "Votre abonnement a expiré. Contactez-nous pour renouveler et continuer à utiliser votre menu digital."
            : "Votre compte a bien été créé. Un administrateur va valider votre accès et activer votre abonnement sous peu."}
        </p>

        {/* Contact card */}
        <div
          className="rounded-2xl p-5 mb-6 text-left"
          style={{ backgroundColor: "#fff", border: "1px solid #EDE8E5" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#A09088" }}>
            Nous contacter
          </p>
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#C64F00" }}>mail</span>
            <span className="text-sm font-medium" style={{ color: "#1C1B1B" }}>contact@lëkkal.sn</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#C64F00" }}>phone</span>
            <span className="text-sm font-medium" style={{ color: "#1C1B1B" }}>+221 77 000 00 00</span>
          </div>
        </div>

        {/* Sign out */}
        <form action={handleSignOut}>
          <button
            type="submit"
            className="text-sm font-semibold"
            style={{ color: "#A09088" }}
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
