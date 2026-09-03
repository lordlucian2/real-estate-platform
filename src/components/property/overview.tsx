import { Building2, Home as HomeIcon, KeyRound, Landmark, Sofa, Store, TreePine } from "lucide-react";
import Link from "next/link";
import { getAllProperties } from "@/lib/store";
import { PropertyCard } from "@/components/property/property-card";

async function OverviewPage({
  listingType,
  displayType,
  hero,
  categories,
}: {
  listingType: "rent" | "buy";
  displayType: "Rent" | "Buy";
  hero: { eyebrow: string; title: string; subtitle: string };
  categories: { href: string; label: string; icon: React.ElementType; blurb: string }[];
}) {
  const featured = (await getAllProperties())
    .filter((p) => p.listingType === listingType && p.availabilityStatus === "available")
    .sort((a, b) => (a.lastVerifiedAt < b.lastVerifiedAt ? 1 : -1))
    .slice(0, 3);

  return (
    <>
      <section className="texture-dark py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">{hero.eyebrow}</p>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-5xl">
            {hero.title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream-50/70">{hero.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl font-semibold text-navy-900">
          Browse by type
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-center gap-3 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-500/50 hover:shadow-lg"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                <c.icon size={20} />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-navy-900">{c.label}</span>
                <span className="block text-xs text-ink-400">{c.blurb}</span>
              </span>
            </Link>
          ))}
        </div>

        {featured.length > 0 ? (
          <div className="mt-14">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold text-navy-900">
                Fresh {displayType.toLowerCase()} picks
              </h2>
              <Link href="/properties" className="text-sm font-semibold text-gold-700 hover:underline">
                View all →
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((p, i) => (
                <PropertyCard key={p.id} property={p} priority={i < 3} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}

export const rentOverview = {
  listingType: "rent" as const,
  displayType: "Rent" as const,
  hero: {
    eyebrow: "For rent",
    title: `Rent in Liberia, Minus the Run-Around`,
    subtitle: `Houses, rooms, apartments and family compounds for rent across Greater Monrovia — verified as available before you ever travel to view.`,
  },
  categories: [
    { href: "/rent/houses", label: "Houses for Rent", icon: HomeIcon, blurb: "Family homes with yards" },
    { href: "/rent/rooms", label: "Rooms for Rent", icon: Sofa, blurb: "Budget-friendly rooms" },
    { href: "/rent/apartments", label: "Apartments", icon: Building2, blurb: "Modern flats" },
    { href: "/rent/compounds", label: "Compounds", icon: TreePine, blurb: "Large family enclosures" },
    { href: "/rent/commercial", label: "Commercial Space", icon: Store, blurb: "Shops & offices" },
    { href: "/rent/short-term", label: "Short-Stay", icon: KeyRound, blurb: "Furnished stays" },
  ],
};

export const buyOverview = {
  listingType: "buy" as const,
  displayType: "Buy" as const,
  hero: {
    eyebrow: "For sale",
    title: `Buy Property in Liberia With Confidence`,
    subtitle: `Houses, compounds, apartments and land for sale in and around Monrovia — with honest documentation review before you commit.`,
  },
  categories: [
    { href: "/buy/houses", label: "Houses for Sale", icon: HomeIcon, blurb: "Homes & compounds" },
    { href: "/buy/land", label: "Land for Sale", icon: Landmark, blurb: "Plots & lots" },
    { href: "/buy/apartments", label: "Apartments", icon: Building2, blurb: "Units & investments" },
    { href: "/buy/commercial", label: "Commercial", icon: Store, blurb: "Buildings & offices" },
  ],
};

export default OverviewPage;