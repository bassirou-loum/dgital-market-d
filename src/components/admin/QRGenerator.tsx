"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";

const COLORS = [
  { value: "#9e3d00", label: "Terracotta" },
  { value: "#1c1b1b", label: "Noir" },
  { value: "#065f46", label: "Vert" },
  { value: "#1e3a8a", label: "Bleu" },
];

export default function QRGenerator({
  restaurantName,
  menuUrl,
  logoUrl,
}: {
  restaurantName: string;
  menuUrl: string;
  logoUrl?: string | null;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor]           = useState(COLORS[0].value);
  const [includeLogo, setIncludeLogo] = useState(true);
  const [roundedDots, setRoundedDots] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawQR(canvas, menuUrl, { color, rounded: roundedDots, size: 256, errorLevel: includeLogo ? "H" : "M" });
  }, [menuUrl, color, includeLogo, roundedDots]);

  function downloadPNG() {
    if (!canvasRef.current) return;
    const a = document.createElement("a");
    a.download = `qr-${restaurantName.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  }

  function downloadPDF() {
    if (!canvasRef.current) return;

    // Générer un canvas haute résolution (512×512) pour le PDF
    const hiCanvas = document.createElement("canvas");
    drawQR(hiCanvas, menuUrl, { color, rounded: roundedDots, size: 512, errorLevel: includeLogo ? "H" : "M" })
      .then(() => {
      const qrData = hiCanvas.toDataURL("image/png");

      // Format A5 portrait (148 × 210 mm)
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a5" });
      const W = 148;
      const H = 210;

      // Fond blanc
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, W, H, "F");

      // Cadre extérieur
      doc.setDrawColor(220, 213, 208);
      doc.setLineWidth(0.4);
      doc.roundedRect(8, 8, W - 16, H - 16, 4, 4, "S");

      // Logo restaurant (si disponible)
      const logoSize = 12;
      const logoY    = 18;
      if (logoUrl) {
        try {
          doc.addImage(logoUrl, "JPEG", (W - logoSize) / 2, logoY, logoSize, logoSize, undefined, "FAST");
        } catch {
          // logo non chargeable, on ignore
        }
      }
      const titleY = logoUrl ? logoY + logoSize + 6 : 28;

      // Titre restaurant
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(28, 27, 27);
      doc.text(restaurantName, W / 2, titleY, { align: "center" });

      // Sous-titre
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(107, 91, 83);
      doc.text("Scannez pour consulter le menu", W / 2, titleY + 7, { align: "center" });

      // Séparateur
      doc.setDrawColor(237, 232, 229);
      doc.setLineWidth(0.3);
      doc.line(20, titleY + 12, W - 20, titleY + 12);

      // QR code centré
      const qrSize = 90;
      const qrX = (W - qrSize) / 2;
      const qrY  = titleY + 20;
      doc.addImage(qrData, "PNG", qrX, qrY, qrSize, qrSize);

      // Label sous le QR
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(28, 27, 27);
      doc.text("Menu — Table #01", W / 2, qrY + qrSize + 12, { align: "center" });

      // URL en petit
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(160, 144, 136);
      doc.text(menuUrl, W / 2, qrY + qrSize + 20, { align: "center" });

      // Pied de page
      doc.setFontSize(7);
      doc.setTextColor(192, 180, 174);
      doc.text("Digital Maître D'", W / 2, H - 12, { align: "center" });

      const slug = restaurantName.toLowerCase().replace(/\s+/g, "-");
      doc.save(`qr-${slug}.pdf`);
    });
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">

      {/* ── QR preview ── */}
      <div className="bg-white rounded-2xl border border-[#EDE8E5] p-8 flex flex-col items-center">
        {/* Card */}
        <div className="bg-[#FAFAF9] rounded-2xl border border-[#EDE8E5] p-8 flex flex-col items-center w-full max-w-xs">
          <div className="relative w-56 h-56 flex items-center justify-center bg-white rounded-xl border border-[#EDE8E5]">
            <canvas ref={canvasRef} className="w-full h-full" />
            {includeLogo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white p-1.5 rounded-lg border border-[#EDE8E5] shadow-sm">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={restaurantName}
                      className="w-8 h-8 rounded object-cover"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-white text-xs font-black"
                      style={{ backgroundColor: color, fontFamily: "var(--font-headline)" }}
                    >
                      {restaurantName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="mt-5 text-center">
            <p className="text-base font-black text-[#1C1B1B]" style={{ fontFamily: "var(--font-headline)" }}>
              {restaurantName}
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
            onClick={downloadPDF}
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

/* ── Dessin QR manuel (permet les points arrondis) ── */
async function drawQR(
  canvas: HTMLCanvasElement,
  url: string,
  opts: { color: string; rounded: boolean; size: number; errorLevel: "L" | "M" | "Q" | "H" }
) {
  const qr = QRCode.create(url, { errorCorrectionLevel: opts.errorLevel });
  const modules    = qr.modules;
  const count      = modules.size;
  const margin     = 2;
  const total      = count + margin * 2;
  const moduleSize = opts.size / total;

  canvas.width  = opts.size;
  canvas.height = opts.size;
  const ctx = canvas.getContext("2d")!;

  // Fond blanc
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, opts.size, opts.size);

  ctx.fillStyle = opts.color;
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!modules.data[row * count + col]) continue;
      const x = (col + margin) * moduleSize;
      const y = (row + margin) * moduleSize;
      if (opts.rounded) {
        const r = moduleSize * 0.3;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + moduleSize - r, y);
        ctx.arcTo(x + moduleSize, y, x + moduleSize, y + r, r);
        ctx.lineTo(x + moduleSize, y + moduleSize - r);
        ctx.arcTo(x + moduleSize, y + moduleSize, x + moduleSize - r, y + moduleSize, r);
        ctx.lineTo(x + r, y + moduleSize);
        ctx.arcTo(x, y + moduleSize, x, y + moduleSize - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(x, y, moduleSize, moduleSize);
      }
    }
  }
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
