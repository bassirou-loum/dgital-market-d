"use client";
import Link from "next/link";
import { useState } from "react";

const FEATURES = [
  {
    icon: "edit_note",
    title: "Mise à jour instantanée",
    description:
      "Modifiez un prix, masquez un plat épuisé ou ajoutez le spécial du jour depuis votre téléphone. Vos clients voient le changement en temps réel.",
  },
  {
    icon: "qr_code_2",
    title: "QR code prêt à l'emploi",
    description:
      "Un QR code généré automatiquement pour chaque restaurant. Imprimez-le, posez-le sur les tables — c'est tout.",
  },
  {
    icon: "phone_iphone",
    title: "Zéro application client",
    description:
      "Vos clients ouvrent votre menu directement depuis leur appareil photo. Pas de téléchargement, pas de friction.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Créez votre espace",
    body: "Inscription en 2 minutes. Votre profil restaurant et votre premier menu sont prêts immédiatement.",
  },
  {
    n: "02",
    title: "Construisez votre carte",
    body: "Ajoutez vos catégories et vos plats avec prix, descriptions et photos. Aussi simple qu'une liste.",
  },
  {
    n: "03",
    title: "Partagez via QR code",
    body: "Imprimez votre QR code, placez-le sur les tables. Vos clients scannent et consultent le menu.",
  },
];

const PLAN_FEATURES = [
  "Menus et catégories illimités",
  "Plats illimités avec photos",
  "QR code PNG téléchargeable",
  "Mise à jour en temps réel",
  "Statistiques de vues",
  "Gestion de l'équipe",
  "Support par email",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white" style={{ fontFamily: "var(--font-body)", color: "#1C1B1B" }}>

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#EDE8E5]">
        <div className="mx-auto max-w-6xl px-5 md:px-8 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>restaurant</span>
            </div>
            <span
              className="font-black text-[15px] tracking-tight"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Lëkkal Digital
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#6B5B53]">
            <Link href="#fonctionnalites" className="hover:text-[#1C1B1B] transition-colors">Fonctionnalités</Link>
            <Link href="#comment" className="hover:text-[#1C1B1B] transition-colors">Comment ça marche</Link>
            <Link href="#tarifs" className="hover:text-[#1C1B1B] transition-colors">Tarifs</Link>
            <Link href="/menu/le-petit-bistro" className="hover:text-[#1C1B1B] transition-colors">Démo</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden md:block text-sm font-semibold text-[#1C1B1B] hover:opacity-60 transition-opacity"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold text-white px-4 py-2 rounded-full hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Commencer
            </Link>
            {/* Hamburger mobile */}
            <button
              className="md:hidden p-2 rounded-xl"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 24, color: "#1C1B1B" }}>
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-[#EDE8E5] px-5 py-4 flex flex-col gap-1 bg-white">
            {[
              { href: "#fonctionnalites", label: "Fonctionnalités" },
              { href: "#comment", label: "Comment ça marche" },
              { href: "#tarifs", label: "Tarifs" },
              { href: "/menu/le-petit-bistro", label: "Démo" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="py-3 text-sm font-semibold text-[#1C1B1B] border-b border-[#F0EDEC] last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="py-3 text-sm font-semibold text-[#6B5B53]"
            >
              Connexion
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section className="px-5 md:px-8 pt-20 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-center">

            {/* Left */}
            <div>
              <div
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest mb-7"
                style={{ borderColor: "rgba(198,79,0,0.22)", color: "var(--color-primary)" }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
                Menu digital · QR code
              </div>

              <h1
                className="text-3xl sm:text-[2.75rem] md:text-6xl font-black leading-[1.07] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                La carte de votre restaurant, toujours à jour, sans papier.
              </h1>

              <p className="text-lg leading-8 mb-9 max-w-lg" style={{ color: "#6B5B53" }}>
                Publiez votre menu en ligne, générez un QR code et laissez vos clients le consulter depuis leur téléphone — sans téléchargement, sans contact.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Créer mon menu gratuitement
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </Link>
                <Link
                  href="/menu/le-petit-bistro"
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold hover:bg-stone-50 transition-colors"
                  style={{ borderColor: "#E0D9D5", color: "#1C1B1B" }}
                >
                  Voir un exemple
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
                </Link>
              </div>

              <div
                className="mt-10 pt-8 border-t flex flex-wrap gap-10"
                style={{ borderColor: "#EDE8E5" }}
              >
                {[
                  { v: "< 3 min", l: "pour publier un premier menu" },
                  { v: "100%", l: "pensé pour le mobile" },
                  { v: "0 app", l: "à installer côté client" },
                ].map((s) => (
                  <div key={s.l}>
                    <p
                      className="text-2xl font-black"
                      style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
                    >
                      {s.v}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "#6B5B53" }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — phone mockup */}
            <div className="relative hidden sm:flex justify-center lg:justify-end">
              {/* Floating badge top-right */}
              <div className="absolute -top-2 right-0 bg-white border border-[#EDE8E5] rounded-2xl px-3.5 py-2.5 z-10 shadow-sm">
                <p className="text-xs font-bold text-[#1C1B1B]">128 scans</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#6B5B53" }}>aujourd&apos;hui</p>
              </div>

              {/* Floating badge bottom-left */}
              <div className="absolute -bottom-2 left-0 bg-white border border-[#EDE8E5] rounded-2xl px-3.5 py-2.5 z-10 shadow-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ color: "var(--color-primary)" }}>check_circle</span>
                <p className="text-xs font-bold text-[#1C1B1B]">Menu mis à jour</p>
              </div>

              {/* Phone */}
              <div className="relative w-64 rounded-[2.5rem] border-[7px] border-[#1C1B1B] overflow-hidden bg-[#1C1B1B]" style={{ boxShadow: "0 24px 60px rgba(28,27,27,0.18)" }}>
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-2.5 pb-1.5 bg-[#1C1B1B]">
                  <span className="text-white text-[11px] font-semibold">9:41</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>wifi</span>
                    <span className="material-symbols-outlined text-white" style={{ fontSize: 13 }}>battery_full</span>
                  </div>
                </div>

                {/* Screen */}
                <div className="bg-[#F6F3F2] px-3 pt-3 pb-5 min-h-[440px]">
                  {/* Restaurant header */}
                  <div className="bg-white rounded-2xl p-3 mb-2.5 border border-[#EDE8E5] flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "#FFF0E6" }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: "var(--color-primary)" }}>restaurant</span>
                    </div>
                    <div>
                      <p className="font-black text-[13px] text-[#1C1B1B]">Le Petit Bistro</p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#6B5B53" }}>Dakar · Plateau</p>
                    </div>
                  </div>

                  {/* Category pills */}
                  <div className="flex gap-1.5 mb-2.5 overflow-x-auto hide-scrollbar">
                    {["Plats", "Entrées", "Boissons", "Desserts"].map((cat, i) => (
                      <span
                        key={cat}
                        className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold flex-shrink-0"
                        style={
                          i === 0
                            ? { backgroundColor: "var(--color-primary)", color: "#fff" }
                            : { backgroundColor: "#EDE8E5", color: "#6B5B53" }
                        }
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Items */}
                  {[
                    { name: "Thieboudienne Royal", price: "5 500 F", tag: "Signature" },
                    { name: "Yassa Poulet", price: "4 500 F", tag: "Plat du jour" },
                    { name: "Bissap Maison", price: "800 F", tag: "Boisson" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="bg-white rounded-2xl p-3 mb-2 border border-[#EDE8E5] flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--color-primary)" }}>
                          {item.tag}
                        </p>
                        <p className="text-[13px] font-bold text-[#1C1B1B] mt-0.5 truncate">{item.name}</p>
                      </div>
                      <p className="text-[13px] font-black flex-shrink-0" style={{ color: "var(--color-primary)" }}>
                        {item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGOS STRIP ── */}
      <div className="border-y border-[#EDE8E5] bg-[#FAFAF9] py-5 px-5 md:px-8">
        <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#A09088" }}>
            Simple · Rapide · Sans application
          </p>
          {["Restaurants", "Maquis", "Cafés", "Hôtels", "Food trucks"].map((t) => (
            <span key={t} className="text-sm font-semibold" style={{ color: "#6B5B53" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="fonctionnalites" className="px-5 md:px-8 py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              Pourquoi ce produit
            </p>
            <h2
              className="text-3xl md:text-4xl font-black leading-tight max-w-xl"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Conçu pour les équipes qui veulent aller vite sans sacrifier l&apos;image.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border p-7"
                style={{ borderColor: "#EDE8E5" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: "#FFF0E6" }}
                >
                  <span className="material-symbols-outlined" style={{ color: "var(--color-primary)", fontSize: 22 }}>
                    {f.icon}
                  </span>
                </div>
                <h3 className="text-xl font-black mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                  {f.title}
                </h3>
                <p className="text-[15px] leading-7" style={{ color: "#6B5B53" }}>
                  {f.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="comment" className="px-5 md:px-8 py-24 bg-[#FAFAF9] border-y border-[#EDE8E5]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              Comment ça marche
            </p>
            <h2
              className="text-3xl md:text-4xl font-black leading-tight max-w-xl"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Trois étapes pour passer du menu papier au menu vivant.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div
                    className="hidden md:block absolute top-6 left-[calc(50%+32px)] right-0 h-px"
                    style={{ backgroundColor: "#E0D9D5" }}
                  />
                )}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base mb-6"
                  style={{
                    backgroundColor: "#FFF0E6",
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-headline)",
                  }}
                >
                  {s.n}
                </div>
                <h3 className="text-xl font-black mb-3" style={{ fontFamily: "var(--font-headline)" }}>
                  {s.title}
                </h3>
                <p className="text-[15px] leading-7" style={{ color: "#6B5B53" }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="tarifs" className="px-5 md:px-8 py-24 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--color-primary)" }}
            >
              Tarifs
            </p>
            <h2
              className="text-3xl md:text-4xl font-black leading-tight max-w-xl mx-auto"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              Essayez 7 jours gratuitement, sans carte bancaire.
            </h2>
            <p className="mt-4 text-base max-w-md mx-auto" style={{ color: "#6B5B53" }}>
              Testez toutes les fonctionnalités pendant une semaine. Si vous êtes satisfait, continuez pour seulement <strong style={{ color: "#1C1B1B" }}>7 000 FCFA / mois</strong>.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <article
              className="rounded-2xl border-2 p-8 flex flex-col"
              style={{ borderColor: "var(--color-primary)", backgroundColor: "#FFF8F5" }}
            >
              {/* Badge essai */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black" style={{ fontFamily: "var(--font-headline)" }}>
                  Accès complet
                </h3>
                <span
                  className="text-[11px] font-bold uppercase tracking-widest rounded-full px-3 py-1 text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  7 jours offerts
                </span>
              </div>

              {/* Prix */}
              <div className="mb-1">
                <span
                  className="text-5xl font-black"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
                >
                  7 000
                </span>
                <span className="text-sm ml-2" style={{ color: "#6B5B53" }}>FCFA / mois</span>
              </div>
              <p className="text-sm mb-8" style={{ color: "#A09088" }}>
                après votre période d&apos;essai gratuite de 7 jours
              </p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {PLAN_FEATURES.map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-sm font-medium">
                    <span
                      className="material-symbols-outlined flex-shrink-0"
                      style={{ fontSize: 18, color: "var(--color-primary)" }}
                    >
                      check
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className="block text-center rounded-full py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Démarrer mon essai gratuit
              </Link>

              <p className="text-center text-xs mt-4" style={{ color: "#A09088" }}>
                Aucune carte bancaire requise · Résiliable à tout moment
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-5 md:px-8 py-8 pb-16 bg-white">
        <div
          className="mx-auto max-w-6xl rounded-3xl px-5 sm:px-8 py-12 sm:py-16 text-center"
          style={{ backgroundColor: "#1C1B1B" }}
        >
          <p
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,250,247,0.45)" }}
          >
            Prêt à lancer
          </p>
          <h2
            className="text-3xl md:text-5xl font-black text-white leading-tight max-w-2xl mx-auto mb-5"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Donnez à votre restaurant une carte à la hauteur de votre cuisine.
          </h2>
          <p className="text-base leading-7 mb-8 max-w-lg mx-auto" style={{ color: "rgba(255,250,247,0.65)" }}>
            Créez votre compte, ajoutez vos plats et partagez votre menu digital dès aujourd&apos;hui.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#1C1B1B] bg-white hover:opacity-90 transition-opacity"
            >
              Ouvrir mon espace
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>north_east</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold text-white hover:bg-white/5 transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.18)" }}
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#EDE8E5] px-5 md:px-8 py-8">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: 15 }}>restaurant</span>
            </div>
            <span className="font-black text-sm" style={{ fontFamily: "var(--font-headline)" }}>
              Lëkkal Digital
            </span>
          </div>
          <p className="text-xs" style={{ color: "#A09088" }}>
            © {new Date().getFullYear()} Lëkkal Digital. Tous droits réservés.
          </p>
          <div className="flex gap-5 text-xs font-medium" style={{ color: "#6B5B53" }}>
            <Link href="/login" className="hover:text-[#1C1B1B] transition-colors">Connexion</Link>
            <Link href="/register" className="hover:text-[#1C1B1B] transition-colors">Créer un compte</Link>
            <Link href="/menu/le-petit-bistro" className="hover:text-[#1C1B1B] transition-colors">Démo</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
