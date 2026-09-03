import Link from "next/link";
import type { PropertyType } from "@/lib/types";
import { getAllProperties } from "@/lib/store";
import { typeLabels } from "@/lib/data";

const typeCards: {
  type: PropertyType;
  href: string;
  blurb: string;
  icon: string;
  accent: string;
}[] = [
  {
    type: "house",
    href: "/rent/houses",
    blurb: "Family homes with yards and space",
    icon: "H",
    accent: "from-gold-400/90 to-gold-600/90",
  },
  {
    type: "room",
    href: "/rent/rooms",
    blurb: "Budget-friendly rooms, verified as free",
    icon: "R",
    accent: "from-navy-500 to-navy-800",
  },
  {
    type: "apartment",
    href: "/rent/apartments",
    blurb: "Modern flats close to work",
    icon: "A",
    accent: "from-slate-500 to-navy-900",
  },
  {
    type: "compound",
    href: "/rent/compounds",
    blurb: "Large enclosures for families",
    icon: "C",
    accent: "from-amber-500 to-gold-700",
  },
  {
    type: "commercial",
    href: "/rent/commercial",
    blurb: "Shops, offices and workspaces",
    icon: "B",
    accent: "from-emerald-600 to-navy-900",
  },
  {
    type: "land",
    href: "/buy/land",
    blurb: "Residential and commercial lots",
    icon: "L",
    accent: "from-green-700 to-navy-900",
  },
];

export async function TypeGrid() {
  const counts = (await getAllProperties()).reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {typeCards.map((card) => (
        <Link
          key={card.type}
          href={card.href}
          className="group relative overflow-hidden rounded-2xl border border-ink-900/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex items-start justify-between">
            <span
              className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} font-display text-lg font-bold text-white shadow-lg`}
            >
              {card.icon}
            </span>
            <span className="text-xs font-bold text-ink-400">
              {counts[card.type] ?? 0} listed
            </span>
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-navy-900 group-hover:text-gold-600">
            {typeLabels[card.type]}{card.type === "land" ? "" : "s"}
          </h3>
          <p className="mt-1 text-sm text-ink-500">{card.blurb}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold-600">
            Browse
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      ))}
    </div>
  );
}