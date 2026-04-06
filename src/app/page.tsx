import Link from "next/link";

const FEATURES = [
  {
    icon: "menu_book",
    title: "Menus toujours a jour",
    description:
      "Ajoutez vos categories, modifiez vos plats, masquez un produit indisponible et publiez instantanement.",
  },
  {
    icon: "qr_code_2",
    title: "QR code pret a imprimer",
    description:
      "Generez un QR code propre pour chaque restaurant et placez-le sur les tables, comptoirs et emballages.",
  },
  {
    icon: "phone_iphone",
    title: "Experience mobile rapide",
    description:
      "Les clients ouvrent le menu sans application, avec une lecture claire, rapide et adaptee au smartphone.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Creez votre espace restaurant",
    description: "Inscription simple, creation automatique du profil restaurant et du menu principal.",
  },
  {
    number: "02",
    title: "Construisez votre carte",
    description: "Organisez vos entrees, plats, desserts et boissons en quelques minutes.",
  },
  {
    number: "03",
    title: "Partagez via QR code",
    description: "Les clients scannent, consultent et reviennent sans contact et sans support papier.",
  },
];

const PLANS = [
  {
    name: "Gratuit",
    price: "0 FCFA",
    description: "Pour lancer votre premier menu digital.",
    highlight: false,
    features: ["1 menu", "3 categories", "10 plats", "QR code PNG"],
  },
  {
    name: "Standard",
    price: "5 000 FCFA/mois",
    description: "Le meilleur equilibre pour un restaurant actif.",
    highlight: true,
    features: ["3 menus", "50 plats", "Images des plats", "Statistiques basiques"],
  },
  {
    name: "Premium",
    price: "10 000 FCFA/mois",
    description: "Pour une marque forte avec personnalisation avancee.",
    highlight: false,
    features: ["Menus illimites", "Statistiques avancees", "Multi-langue", "Support prioritaire"],
  },
];

export default function Home() {
  return (
    <main
      style={{
        background:
          "radial-gradient(circle at top left, rgba(198,79,0,0.16), transparent 32%), radial-gradient(circle at 85% 10%, rgba(0,114,228,0.12), transparent 28%), linear-gradient(180deg, #fffaf7 0%, #fcf9f8 42%, #f6f1ee 100%)",
        minHeight: "100vh",
      }}
    >
      <section className="px-6 pt-6 pb-20 md:px-10 lg:px-16">
        <div
          className="mx-auto max-w-7xl rounded-[2rem] border p-4 md:p-6"
          style={{
            backgroundColor: "rgba(255,255,255,0.72)",
            borderColor: "rgba(227,191,178,0.45)",
            backdropFilter: "blur(18px)",
            boxShadow: "0 20px 60px rgba(90,65,56,0.08)",
          }}
        >
          <header className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))" }}
              >
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <div>
                <p className="text-lg font-black tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
                  Digital Maitre D&apos;
                </p>
                <p className="text-sm" style={{ color: "var(--color-on-surface-variant)" }}>
                  Menus QR code pour restaurants, cafes et maquis
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-3 text-sm font-bold">
              <Link
                href="/menu/le-petit-bistro"
                className="rounded-full px-4 py-2 transition-opacity hover:opacity-75"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Voir la demo
              </Link>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 transition-opacity hover:opacity-75"
                style={{ color: "var(--color-on-surface)" }}
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-full px-5 py-3 text-white"
                style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))" }}
              >
                Creer un compte
              </Link>
            </nav>
          </header>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <section className="max-w-3xl">
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.82)",
                  color: "var(--color-primary)",
                  border: "1px solid rgba(198,79,0,0.12)",
                }}
              >
                <span className="material-symbols-outlined text-base">qr_code_scanner</span>
                La carte digitale qui travaille pour votre salle
              </div>

              <h1
                className="text-5xl font-black leading-none tracking-tight md:text-7xl"
                style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
              >
                Remplacez les menus papier par une experience QR elegante.
              </h1>

              <p
                className="mt-6 max-w-2xl text-lg leading-8 md:text-xl"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Digital Maitre D&apos; aide les restaurants a publier un menu mobile, le mettre a jour en temps reel
                et partager un QR code pret a imprimer en quelques clics.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition-transform hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-container))" }}
                >
                  Commencer maintenant
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <Link
                  href="/menu/le-petit-bistro"
                  className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    color: "var(--color-on-surface)",
                    border: "1px solid rgba(143,112,102,0.2)",
                  }}
                >
                  Voir un menu public
                  <span className="material-symbols-outlined text-lg">open_in_new</span>
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { value: "< 3 min", label: "pour publier un premier menu" },
                  { value: "100%", label: "pense pour le mobile" },
                  { value: "0 app", label: "a installer cote client" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-3xl p-5"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.82)",
                      border: "1px solid rgba(227,191,178,0.35)",
                    }}
                  >
                    <div className="text-3xl font-black" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
                      {stat.value}
                    </div>
                    <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-on-surface-variant)" }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative">
              <div
                className="absolute -left-6 top-10 h-24 w-24 rounded-full blur-3xl"
                style={{ backgroundColor: "rgba(198,79,0,0.18)" }}
              />
              <div
                className="absolute bottom-2 right-0 h-28 w-28 rounded-full blur-3xl"
                style={{ backgroundColor: "rgba(0,114,228,0.14)" }}
              />

              <div className="relative mx-auto max-w-lg space-y-5">
                <div
                  className="rounded-[2rem] p-5"
                  style={{
                    backgroundColor: "#201815",
                    color: "#fff9f5",
                    boxShadow: "0 24px 70px rgba(28,27,27,0.28)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/60">Menu public</p>
                      <h2 className="mt-2 text-2xl font-black" style={{ fontFamily: "var(--font-headline)" }}>
                        Le Petit Bistro
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]">
                      En ligne
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    {[
                      ["Plat du jour", "Thieboudienne Royal", "5 500 FCFA"],
                      ["Signature", "Yassa Poulet", "4 500 FCFA"],
                      ["Boisson", "Bissap Maison", "800 FCFA"],
                    ].map(([tag, name, price]) => (
                      <div key={name} className="rounded-3xl bg-white/8 p-4">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-white/50">{tag}</p>
                        <div className="mt-2 flex items-end justify-between gap-4">
                          <div>
                            <p className="text-base font-bold">{name}</p>
                            <p className="text-sm text-white/65">Visible instantanement apres modification</p>
                          </div>
                          <p className="text-sm font-extrabold text-[#ffb595]">{price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-[0.82fr_1.18fr]">
                  <div
                    className="rounded-[2rem] p-5"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.92)",
                      border: "1px solid rgba(227,191,178,0.45)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: "var(--color-outline)" }}>
                        QR code
                      </p>
                      <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>
                        download
                      </span>
                    </div>
                    <div className="mt-4 rounded-[1.5rem] bg-white p-4 shadow-sm">
                      <div className="grid grid-cols-5 gap-1">
                        {Array.from({ length: 25 }).map((_, index) => (
                          <span
                            key={index}
                            className="aspect-square rounded-sm"
                            style={{
                              backgroundColor:
                                [0, 1, 3, 5, 6, 8, 10, 11, 12, 14, 15, 18, 20, 21, 23, 24].includes(index)
                                  ? "var(--color-on-surface)"
                                  : "#efe8e4",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-6" style={{ color: "var(--color-on-surface-variant)" }}>
                      Un lien direct vers votre menu, pret pour les tables et les vitrines.
                    </p>
                  </div>

                  <div
                    className="rounded-[2rem] p-6"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(227,191,178,0.45)",
                    }}
                  >
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: "var(--color-outline)" }}>
                      Tableau de bord
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="rounded-3xl p-4" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--color-outline)" }}>
                          Scans
                        </p>
                        <p className="mt-2 text-4xl font-black" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
                          128
                        </p>
                      </div>
                      <div className="rounded-3xl p-4" style={{ backgroundColor: "var(--color-surface-container-low)" }}>
                        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: "var(--color-outline)" }}>
                          Plats actifs
                        </p>
                        <p className="mt-2 text-4xl font-black" style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}>
                          24
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-3xl p-4" style={{ backgroundColor: "#fff3eb" }}>
                      <p className="text-sm font-bold" style={{ color: "var(--color-primary)" }}>
                        Mise a jour rapide
                      </p>
                      <p className="mt-2 text-sm leading-6" style={{ color: "var(--color-on-surface-variant)" }}>
                        Desactivez un plat, changez un prix ou mettez en avant le special du jour sans reimprimer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: "var(--color-primary)" }}>
                Pourquoi ce produit
              </p>
              <h2 className="mt-3 text-4xl font-black md:text-5xl" style={{ fontFamily: "var(--font-headline)" }}>
                Concu pour les equipes qui veulent aller vite sans sacrifier l&apos;image.
              </h2>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[2rem] p-8"
                style={{
                  backgroundColor: "rgba(255,255,255,0.76)",
                  border: "1px solid rgba(227,191,178,0.45)",
                  boxShadow: "0 16px 40px rgba(90,65,56,0.04)",
                }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "#fff0e6", color: "var(--color-primary)" }}
                >
                  <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                </div>
                <h3 className="mt-6 text-2xl font-black" style={{ fontFamily: "var(--font-headline)" }}>
                  {feature.title}
                </h3>
                <p className="mt-4 text-base leading-7" style={{ color: "var(--color-on-surface-variant)" }}>
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.22em]" style={{ color: "var(--color-primary)" }}>
              Comment ca marche
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl" style={{ fontFamily: "var(--font-headline)" }}>
              Trois etapes pour passer du menu papier au menu vivant.
            </h2>
          </div>

          <div className="grid gap-5">
            {STEPS.map((step) => (
              <article
                key={step.number}
                className="grid gap-5 rounded-[2rem] p-6 md:grid-cols-[88px_1fr]"
                style={{
                  backgroundColor: "rgba(255,255,255,0.82)",
                  border: "1px solid rgba(227,191,178,0.4)",
                }}
              >
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-black"
                  style={{
                    background: "linear-gradient(135deg, #fff0e6, #ffd9c2)",
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-headline)",
                  }}
                >
                  {step.number}
                </div>
                <div>
                  <h3 className="text-2xl font-black" style={{ fontFamily: "var(--font-headline)" }}>
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-7" style={{ color: "var(--color-on-surface-variant)" }}>
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl rounded-[2rem] p-8 md:p-10" style={{ backgroundColor: "#201815", color: "#fffaf7" }}>
          <div className="mb-8 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/55">Tarifs</p>
            <h2 className="mt-3 text-4xl font-black md:text-5xl" style={{ fontFamily: "var(--font-headline)" }}>
              Commencez gratuitement, evoluez quand votre salle accelere.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.name}
                className="rounded-[2rem] p-6"
                style={{
                  backgroundColor: plan.highlight ? "#fff3eb" : "rgba(255,255,255,0.06)",
                  color: plan.highlight ? "var(--color-on-surface)" : "#fffaf7",
                  border: plan.highlight ? "1px solid rgba(198,79,0,0.18)" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: plan.highlight ? "0 16px 44px rgba(198,79,0,0.12)" : "none",
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black" style={{ fontFamily: "var(--font-headline)" }}>
                    {plan.name}
                  </h3>
                  {plan.highlight && (
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.22em]"
                      style={{ backgroundColor: "var(--color-primary)", color: "white" }}
                    >
                      Recommande
                    </span>
                  )}
                </div>
                <p className="mt-4 text-3xl font-black" style={{ fontFamily: "var(--font-headline)", color: plan.highlight ? "var(--color-primary)" : "#ffb595" }}>
                  {plan.price}
                </p>
                <p className="mt-3 text-sm leading-6" style={{ color: plan.highlight ? "var(--color-on-surface-variant)" : "rgba(255,250,247,0.72)" }}>
                  {plan.description}
                </p>
                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                      <span className="material-symbols-outlined text-base" style={{ color: plan.highlight ? "var(--color-primary)" : "#ffb595" }}>
                        check_circle
                      </span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 pt-8 md:px-10 lg:px-16">
        <div
          className="mx-auto max-w-7xl rounded-[2rem] p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #9e3d00 0%, #c64f00 58%, #7e3000 100%)",
            color: "white",
          }}
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/70">Pret a lancer</p>
          <h2 className="mt-4 text-4xl font-black md:text-6xl" style={{ fontFamily: "var(--font-headline)" }}>
            Donnez a votre restaurant une carte QR a la hauteur de votre cuisine.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/82">
            Creez votre compte, ajoutez vos plats et partagez votre menu digital des aujourd&apos;hui.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] transition-transform hover:scale-[1.01]"
              style={{ color: "var(--color-primary)" }}
            >
              Ouvrir mon espace
              <span className="material-symbols-outlined text-lg">north_east</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em]"
              style={{ border: "1px solid rgba(255,255,255,0.28)", color: "white" }}
            >
              J&apos;ai deja un compte
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
