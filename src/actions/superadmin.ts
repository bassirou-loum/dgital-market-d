"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

async function assertSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== "admin@admin.com") {
    throw new Error("Non autorisé");
  }
  return supabase;
}

export type SubscriptionDuration =
  | "trial_7d"
  | "1m" | "2m" | "3m" | "6m" | "12m"
  | "forever"
  | "none";

function computeDates(plan: "gratuit" | "standard" | "premium", duration: SubscriptionDuration): {
  subscription_status: string;
  subscription_start: string | null;
  subscription_end: string | null;
} {
  const now = new Date();

  if (duration === "none") {
    return { subscription_status: "none", subscription_start: null, subscription_end: null };
  }

  // Plan gratuit = actif sans date de fin
  if (plan === "gratuit" || duration === "forever") {
    return {
      subscription_status: "active",
      subscription_start: now.toISOString(),
      subscription_end: null,
    };
  }

  const end = new Date(now);

  if (duration === "trial_7d") {
    end.setDate(end.getDate() + 7);
    return {
      subscription_status: "trial",
      subscription_start: now.toISOString(),
      subscription_end: end.toISOString(),
    };
  }

  const months: Record<string, number> = { "1m": 1, "2m": 2, "3m": 3, "6m": 6, "12m": 12 };
  end.setMonth(end.getMonth() + months[duration]);

  return {
    subscription_status: "active",
    subscription_start: now.toISOString(),
    subscription_end: end.toISOString(),
  };
}

export async function updateRestaurantSubscription(
  restaurantId: string,
  plan: "gratuit" | "standard" | "premium",
  duration: SubscriptionDuration
) {
  try {
    const supabase = await assertSuperAdmin();
    const dates = computeDates(plan, duration);

    const { error } = await supabase
      .from("restaurants")
      .update({ plan, ...dates })
      .eq("id", restaurantId);

    if (error) return { error: error.message };

    revalidatePath("/superadmin");
    return { success: true };
  } catch (e: any) {
    return { error: e.message ?? "Erreur inconnue" };
  }
}
