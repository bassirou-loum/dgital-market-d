import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Créer un compte — Lëkkal Digital" };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
