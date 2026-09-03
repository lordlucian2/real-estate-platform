import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { locations } from "@/lib/locations";
import { getAllProperties } from "@/lib/store";
import type { LocationConfig } from "@/lib/types";

export async function LocationGrid({ cmsLocations }: { cmsLocations?: LocationConfig[] }) {
  const props = await getAllProperties();
  const counts = props.reduce<Record<string, number>>((acc, p) => {
    acc[p.locationId] = (acc[p.locationId] ?? 0) + 1;
    return acc;
  }, {});
  const list = (cmsLocations?.filter((l) => l.active) ?? locations);

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {list.map((loc) => {
        const count = counts[loc.id] ?? 0;
        return (
          <Link
            key={loc.id}
            href={`/locations/${loc.slug}`}
            className="group relative overflow-hidden rounded-2xl texture-card border border-white/8 bg-navy-850 p-5 transition-all hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-xl sm:p-6"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg font-semibold text-cream-50 group-hover:text-gold-300">
                {loc.name}
              </h3>
              <ArrowUpRight
                size={18}
                className="text-cream-50/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-300"
              />
            </div>
            <p className="mt-1 text-[13px] text-cream-50/50">
              {"type" in loc && loc.type === "city" ? "Capital district" : "type" in loc && loc.type === "town" ? "Suburb" : "Neighborhood"}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-gold-200">
              {count > 0 ? `${count} propert${count === 1 ? "y" : "ies"} available` : "Browse area"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}