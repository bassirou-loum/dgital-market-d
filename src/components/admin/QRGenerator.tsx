"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const COLORS = [
  { value: "#9e3d00", label: "Terracotta" },
  { value: "#1c1b1b", label: "Noir" },
  { value: "#065f46", label: "Vert" },
  { value: "#1e3a8a", label: "Bleu" },
];

export default function QRGenerator({
  restaurantName,
  menuUrl,
}: {
  restaurantName: string;
  menuUrl: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor]           = useState(COLORS[0].value);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [roundedDots, setRoundedDots] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, menuUrl, {
      width: 256,
      margin: 2,
      color: { dark: color, light: "#ffffff" },
      errorCorrectionLevel: includeLogo ? "H" : "M",
    });
  }, [menuUrl, color, includeLogo]);

  function downloadPNG() {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = `qr-${restaurantName.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

      {/* ── QR preview ── */}
      <div className="bg-white rounded-2xl border border-[#EDE8E5] p-8 flex flex-col items-center">
        {/* Card */}
        <div className="bg-[#FAFAF9] rounded-2xl border border-[#EDE8E5] p-8 flex flex-col items-center w-full max-w-xs">
          <div className="relative w-56 h-56 flex items-center justify-center bg-white rounded-xl border border-[#EDE8E5]">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ borderRadius: roundedDots ? "0.5rem" : "0" }}
            />
            {includeLogo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white p-1.5 rounded-lg border border-[#EDE8E5] shadow-sm">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-black"
                    style={{ backgroundColor: color, fontFamily: "var(--font-headline)" }}
                  >
                    R
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-5 text-center">
            <p className="text-base font-black text-[#1C1B1B]" style={{ fontFamily: "var(--font-headline)" }}>
              Menu — Table #01
            </p>
            <p className="text-xs mt-1 font-medium" style={{ color: "#A09088" }}>
              {restaurantName}
            </p>
          </div>
        </div>

        {/* Download buttons */}
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          <button
            onClick={downloadPNG}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
            Télécharger PNG
          </button>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold border border-[#EDE8E5] text-[#1C1B1B] transition-colors hover:bg-[#FAFAF9]"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>picture_as_pdf</span>
            Télécharger PDF
          </button>
        </div>

        {/* Live link */}
        <a
          href={menuUrl}
          target="_blank"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
          style={{ color: "var(--color-primary)" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>open_in_new</span>
          Voir l&apos;aperçu du menu en direct
        </a>
      </div>

      {/* ── Settings panel ── */}
      <div className="space-y-4">

        {/* Customization */}
        <div className="bg-white rounded-2xl border border-[#EDE8E5] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EDE8E5]">
            <h3 className="text-sm font-black text-[#1C1B1B]" style={{ fontFamily: "var(--font-headline)" }}>
              Personnaliser
            </h3>
          </div>

          <div className="px-5 py-5 space-y-5">
            {/* Color picker */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#A09088" }}>
                Couleur du QR
              </p>
              <div className="flex gap-2.5">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setColor(c.value)}
                    title={c.label}
                    className="w-9 h-9 rounded-full transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c.value,
                      outline: color === c.value ? `2px solid ${c.value}` : "none",
                      outlineOffset: "2px",
                      border: "2px solid rgba(255,255,255,0.8)",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#A09088" }}>
                Options
              </p>
              <Toggle
                icon="add_photo_alternate"
                label="Inclure le logo"
                checked={includeLogo}
                onChange={() => setIncludeLogo((v) => !v)}
              />
              <Toggle
                icon="rounded_corner"
                label="Coins arrondis"
                checked={roundedDots}
                onChange={() => setRoundedDots((v) => !v)}
              />
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-[#FFF8F5] rounded-2xl border border-[#F5D5C0] px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined flex-shrink-0 mt-0.5" style={{ fontSize: 18, color: "var(--color-primary)" }}>
              lightbulb
            </span>
            <div>
              <p className="text-sm font-bold text-[#1C1B1B] mb-1">Conseil d&apos;impression</p>
              <p className="text-sm leading-6" style={{ color: "#6B5B53" }}>
                Pour des cartes de table professionnelles, utilisez le format PDF 300 DPI. Cela garantit un scan net même en faible luminosité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toggle({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#EDE8E5] last:border-0">
      <div className="flex items-center gap-2.5">
        <span className="material-symbols-outlined" style={{ fontSize: 18, color: "#A09088" }}>
          {icon}
        </span>
        <span className="text-sm font-medium text-[#1C1B1B]">{label}</span>
      </div>
      <button
        onClick={onChange}
        className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ backgroundColor: checked ? "var(--color-primary)" : "#E0D9D5" }}
        role="switch"
        aria-checked={checked}
      >
        <span
          className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all"
          style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
        />
      </button>
    </div>
  );
}
