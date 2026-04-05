import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Créer un compte — Digital Maître D'" };

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
