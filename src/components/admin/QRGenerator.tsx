"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const ACCENT_COLORS = [
  { value: "#9e3d00", label: "Terracotta" },
  { value: "#1c1b1b", label: "Noir" },
  { value: "#f5c6a0", label: "Crème" },
  { value: "#065f46", label: "Vert" },
];

interface QRGeneratorProps {
  restaurantName: string;
  menuUrl: string;
}

export default function QRGenerator({ restaurantName, menuUrl }: QRGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].value);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [roundedDots, setRoundedDots] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, menuUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: accentColor,
        light: "#ffffff",
      },
      errorCorrectionLevel: includeLogo ? "H" : "M",
    });
  }, [menuUrl, accentColor, includeLogo]);

  const downloadPNG = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `qr-${restaurantName.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* QR Display */}
      <section
        className="lg:col-span-7 rounded-3xl p-8 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: "var(--color-surface-container-low)" }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #8f7066 1px, transparent 0)",
            backgroundSize: "12px 12px",
          }}
        />

        <div
          className="relative z-10 bg-white p-8 rounded-[2rem]"
          style={{
            boxShadow: "0 20px 40px rgba(90,65,56,0.06)",
            border: "1px solid rgba(227,191,178,0.1)",
          }}
        >
          <div
            className="relative w-64 h-64 flex items-center justify-center overflow-hidden rounded-xl"
            style={{ backgroundColor: "#f8f8f8", border: "1px solid #f0f0f0" }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ borderRadius: roundedDots ? "0.5rem" : "0" }}
            />
            {includeLogo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className="bg-white p-1.5 rounded-lg shadow-md"
                  style={{ border: "1px solid #f0eded" }}
                >
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: accentColor, fontFamily: "var(--font-headline)" }}
                  >
                    R
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <p
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-headline)", color: "#1c1b1b" }}
            >
              Menu — Table #01
            </p>
            <p
              className="text-[10px] uppercase tracking-[0.2em] mt-1"
              style={{ fontFamily: "var(--font-label)", color: "#a8a29e" }}
            >
              {restaurantName}
            </p>
          </div>
        </div>

        {/* Download buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center relative z-10">
          <button
            onClick={downloadPNG}
            className="flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-95"
            style={{
              backgroundColor: "var(--color-primary-container)",
              fontFamily: "var(--font-label)",
            }}
          >
            <span className="material-symbols-outlined">download</span>
            Télécharger PNG
          </button>
          <button
            className="flex items-center gap-2 px-8 py-4 rounded-full font-bold transition-all active:scale-95"
            style={{
              backgroundColor: "var(--color-surface-container-highest)",
              color: "var(--color-on-surface)",
              fontFamily: "var(--font-label)",
            }}
          >
            <span className="material-symbols-outlined">picture_as_pdf</span>
            Télécharger PDF
          </button>
        </div>
      </section>

      {/* Customization Panel */}
      <aside className="lg:col-span-5 space-y-6">
        <div
          className="rounded-3xl p-8"
          style={{
            backgroundColor: "var(--color-surface-container-lowest)",
            boxShadow: "0 4px 20px rgba(90,65,56,0.04)",
            border: "1px solid rgba(227,191,178,0.05)",
          }}
        >
          <h3
            className="text-2xl font-bold mb-6"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
          >
            Personnaliser
          </h3>

          {/* Color picker */}
          <div className="mb-6">
            <label
              className="block text-[10px] uppercase tracking-widest mb-3"
              style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
            >
              Couleur du cadre
            </label>
            <div className="flex gap-3">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setAccentColor(c.value)}
                  className="w-10 h-10 rounded-full transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c.value,
                    border: accentColor === c.value ? "4px solid white" : "2px solid transparent",
                    outline: accentColor === c.value ? `2px solid ${c.value}` : "none",
                  }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <label
              className="block text-[10px] uppercase tracking-widest mb-2"
              style={{ fontFamily: "var(--font-label)", color: "var(--color-on-surface-variant)" }}
            >
              Configuration
            </label>

            {/* Include logo */}
            <div
              className="flex items-center justify-between p-4 rounded-2xl"
              style={{ backgroundColor: "var(--color-surface-container-low)" }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>
                  add_photo_alternate
                </span>
                <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  Inclure le logo
                </span>
              </div>
              <button
                onClick={() => setIncludeLogo(!includeLogo)}
                className="w-10 h-5 rounded-full relative transition-colors"
                style={{ backgroundColor: includeLogo ? "var(--color-primary)" : "#d4d0cf" }}
              >
                <div
                  className="absolute top-1 w-3 h-3 bg-white rounded-full transition-all"
                  style={{ left: includeLogo ? "calc(100% - 16px)" : "4px" }}
                />
              </button>
            </div>

            {/* Rounded dots */}
            <div
              className="flex items-center justify-between p-4 rounded-2xl"
              style={{ backgroundColor: "var(--color-surface-container-low)" }}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: "var(--color-primary)" }}>
                  rounded_corner
                </span>
                <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  Coins arrondis
                </span>
              </div>
              <button
                onClick={() => setRoundedDots(!roundedDots)}
                className="w-10 h-5 rounded-full relative transition-colors"
                style={{ backgroundColor: roundedDots ? "var(--color-primary)" : "#d4d0cf" }}
              >
                <div
                  className="absolute top-1 w-3 h-3 bg-white rounded-full transition-all"
                  style={{ left: roundedDots ? "calc(100% - 16px)" : "4px" }}
                />
              </button>
            </div>
          </div>

          <div className="pt-5">
            <a
              href={menuUrl}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-8 transition-all"
              style={{
                color: "var(--color-primary)",
                textDecorationColor: "rgba(158,61,0,0.3)",
                fontFamily: "var(--font-body)",
              }}
            >
              Voir l&apos;aperçu du menu en direct
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Print tip */}
        <div
          className="rounded-3xl p-8 relative overflow-hidden group"
          style={{ backgroundColor: "var(--color-surface-container-low)" }}
        >
          <div className="relative z-10">
            <h4
              className="text-lg font-bold mb-2"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              Conseil d&apos;impression
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}>
              Pour des cartes de table professionnelles, utilisez le format PDF 300 DPI. Cela garantit un scan net même en faible luminosité.
            </p>
          </div>
          <span
            className="material-symbols-outlined absolute -right-4 -bottom-4 text-9xl opacity-5 group-hover:rotate-12 transition-transform duration-500"
            style={{ color: "var(--color-on-surface)" }}
          >
            print
          </span>
        </div>
      </aside>
    </div>
  );
}
