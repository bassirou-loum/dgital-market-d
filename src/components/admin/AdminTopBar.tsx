"use client";

export default function AdminTopBar() {
  return (
    <header
      className="fixed top-0 w-full z-30 border-b-0"
      style={{
        backgroundColor: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 1px 3px rgba(90,65,56,0.06)",
      }}
    >
      <div className="flex justify-between items-center px-6 py-4 max-w-screen-2xl mx-auto md:pl-72">
        <span
          className="text-2xl font-black tracking-tight"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Digital Maître D&apos;
        </span>

        <div className="hidden lg:flex items-center gap-8">
          {["Dashboard", "Analytics", "Support"].map((item, i) => (
            <a
              key={item}
              href="#"
              className="font-bold text-lg transition-colors pb-1"
              style={{
                fontFamily: "var(--font-headline)",
                color: i === 0 ? "var(--color-primary)" : "#78716c",
                borderBottom: i === 0 ? "2px solid var(--color-primary)" : "2px solid transparent",
              }}
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm"
              style={{ color: "#a8a29e" }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 rounded-full text-sm outline-none focus:ring-2 w-56"
              style={{
                backgroundColor: "#f0eded",
                fontFamily: "var(--font-body)",
                color: "var(--color-on-surface)",
              }}
            />
          </div>
          <button
            className="p-2 rounded-lg transition-all active:scale-95"
            style={{ color: "#78716c" }}
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            className="p-2 rounded-lg transition-all active:scale-95"
            style={{ color: "#78716c" }}
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}
