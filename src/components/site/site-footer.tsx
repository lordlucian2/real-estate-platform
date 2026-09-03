import Link from "next/link";
import { Heart, Home, Mail, MapPin, MessageSquare, Phone, Search } from "lucide-react";
import { site, agent, whatsappLink } from "@/lib/site";
import { locations } from "@/lib/locations";
import { BrandMark } from "@/components/site/site-header";
import type { LocationConfig, SiteSettings } from "@/lib/types";

const exploreFallback = [
  { href: "/properties", label: "All Properties" },
  { href: "/rent", label: "Houses for Rent" },
  { href: "/rent/rooms", label: "Rooms for Rent" },
  { href: "/rent/apartments", label: "Apartments for Rent" },
  { href: "/buy", label: "Property for Sale" },
  { href: "/buy/land", label: "Land for Sale" },
  { href: "/services", label: "What I Help With" },
];

export function SiteFooter({
  settings,
  cmsLocations,
}: {
  settings?: SiteSettings;
  cmsLocations?: LocationConfig[];
}) {
  const foot = settings?.footer;
  const explore = foot?.columns?.find((c) => c.id === "explore")?.links?.length
    ? foot.columns.find((c) => c.id === "explore")!.links
    : exploreFallback;
  const locationLinks = (cmsLocations?.filter((l) => l.active) ?? locations).slice(0, 8);

  return (
    <footer className="texture-dark text-cream-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandMark dark />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-50/60">
              {foot?.about ??
                `${site.brandLine}. Personally verified properties, sensible
              matching and honest advice — so you find the right place without
              wasting your time.`}
            </p>
            <div className="mt-4 flex flex-col gap-1.5 text-sm text-cream-50/70">
              <a href={`tel:${(settings?.general?.phone ?? site.phoneDisplay).replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-gold-300">
                <Phone size={14} className="text-gold-400" /> {settings?.general?.phone ?? site.phoneDisplay}
              </a>
              <a href={`mailto:${settings?.general?.email ?? agent.email}`} className="flex items-center gap-2 hover:text-gold-300">
                <Mail size={14} className="text-gold-400" /> {settings?.general?.email ?? agent.email}
              </a>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-gold-400" /> {settings?.general?.city ?? site.city}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-gold-300">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream-50/70 hover:text-gold-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-gold-300">Locations</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {locationLinks.map((l) => (
                <li key={l.id}>
                  <Link href={`/locations/${l.slug}`} className="text-cream-50/70 hover:text-gold-300">
                    Properties in {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-gold-300">Need a hand?</h4>
            <p className="mt-4 text-sm leading-relaxed text-cream-50/60">
              Tell me exactly what you need and I&apos;ll do the searching.
            </p>
            <div className="mt-4 flex flex-col gap-2.5">
              <Link
                href="/find"
                className="flex items-center justify-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-400"
              >
                <MessageSquare size={16} /> Tell Me What You Need
              </Link>
              <a
                href={whatsappLink(`Hello ${agent.name}, I have a property I would like to market. Can we talk?`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-300"
              >
                List Your Property
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-cream-50/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {settings?.general?.shortName ?? site.shortName} · {settings?.general?.brandLine ?? site.brandLine}.</p>
          <p className="text-cream-50/40">{foot?.note ?? "Verified properties · Personal matching · WhatsApp-first service"}</p>
        </div>
      </div>
    </footer>
  );
}

const mobileItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Properties", icon: Search },
  { href: "/find", label: "Requests", icon: MessageSquare },
  { href: "/saved", label: "Saved", icon: Heart },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-5">
        {mobileItems.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-ink-500 active:text-gold-600"
          >
            <item.icon size={20} strokeWidth={1.8} />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}