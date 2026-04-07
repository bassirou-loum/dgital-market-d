import { Restaurant } from "@/types/menu";

export default function DailySpecial({
  special,
}: {
  special: NonNullable<Restaurant["dailySpecial"]>;
}) {
  return (
    <section className="mb-8">
      <div className="relative w-full h-52 rounded-2xl overflow-hidden">
        <img
          src={special.image}
          alt={special.title}
          className="w-full h-full object-cover"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span
            className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white mb-2"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Spécial du jour
          </span>
          <h2
            className="text-xl font-black text-white leading-tight"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {special.title}
          </h2>
        </div>
      </div>
    </section>
  );
}
