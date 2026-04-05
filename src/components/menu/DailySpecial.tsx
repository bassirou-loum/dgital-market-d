import { Restaurant } from "@/types/menu";

interface DailySpecialProps {
  special: NonNullable<Restaurant["dailySpecial"]>;
}

export default function DailySpecial({ special }: DailySpecialProps) {
  return (
    <section className="mb-10">
      <div className="relative w-full h-48 rounded-xl overflow-hidden">
        <img
          src={special.image}
          alt={special.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
          <div>
            <span
              className="text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider mb-2 inline-block"
              style={{ backgroundColor: "var(--color-tertiary-container)" }}
            >
              Spécial du jour
            </span>
            <h2
              className="text-white text-2xl font-bold"
              style={{ fontFamily: "var(--font-headline)" }}
            >
              {special.title}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
