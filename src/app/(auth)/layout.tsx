import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Left panel — brand ── */}
      <div
        className="hidden lg:flex lg:w-[480px] xl:w-[520px] flex-col flex-shrink-0 p-10"
        style={{ backgroundColor: "#1C1B1B" }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: 20 }}>restaurant</span>
          </div>
          <span
            className="font-black text-white text-base tracking-tight"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Digital Maître D&apos;
          </span>
        </Link>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center mt-16">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-5"
            style={{ color: "rgba(255,250,247,0.4)" }}
          >
            Menu digital · QR code
          </p>
          <h2
            className="text-3xl xl:text-4xl font-black leading-tight text-white mb-8"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            La carte de votre restaurant, toujours à jour, sans papier.
          </h2>

          <ul className="space-y-5">
            {[
              { icon: "edit_note", text: "Modifiez votre menu en temps réel depuis votre téléphone" },
              { icon: "qr_code_2", text: "QR code prêt à imprimer, généré automatiquement" },
              { icon: "phone_iphone", text: "Vos clients consultent sans télécharger d'application" },
            ].map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <div
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg mt-0.5"
                  style={{ backgroundColor: "rgba(255,250,247,0.08)" }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 17, color: "var(--color-primary-fixed-dim)" }}>
                    {item.icon}
                  </span>
                </div>
                <span className="text-sm leading-6" style={{ color: "rgba(255,250,247,0.65)" }}>
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom */}
        <div className="mt-10">
          <div className="rounded-2xl p-5" style={{ backgroundColor: "rgba(255,250,247,0.05)", border: "1px solid rgba(255,250,247,0.08)" }}>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(i => (
                <span key={i} className="material-symbols-outlined" style={{ fontSize: 14, color: "#FFB595", fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
            </div>
            <p className="text-sm leading-6" style={{ color: "rgba(255,250,247,0.65)" }}>
              &ldquo;On a remplacé nos menus plastifiés en une journée. Les clients scannent et voient les prix à jour instantanément.&rdquo;
            </p>
            <p className="mt-3 text-xs font-bold" style={{ color: "rgba(255,250,247,0.4)" }}>
              Awa D. — Restaurant Le Baobab, Dakar
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile logo */}
        <div className="lg:hidden px-6 pt-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: 18 }}>restaurant</span>
            </div>
            <span className="font-black text-sm tracking-tight" style={{ fontFamily: "var(--font-headline)" }}>
              Digital Maître D&apos;
            </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
