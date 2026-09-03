import { Hero } from "@/components/home/hero";
import {
  FeaturedProperties,
  RecentlyVerified,
  NeedsHelp,
  HowItWorks,
  WhyMe,
  TestimonialsSection,
  BrowseByType,
  OwnerCTA,
} from "@/components/home/sections";
import { LocationGrid } from "@/components/home/location-grid";
import { WhatsAppBand } from "@/components/home/whatsapp-band";
import { getSettings, getLocationsCms, getPropertyTypes } from "@/lib/cms";
import type { HomeData, HomeSectionCfg } from "@/lib/types";

export async function SectionRenderer({ section, home, settings, locations }: {
  section: HomeSectionCfg;
  home: HomeData;
  settings: Awaited<ReturnType<typeof getSettings>>;
  locations: Awaited<ReturnType<typeof getLocationsCms>>;
}) {
  if (!section.enabled) return null;
  switch (section.key) {
    case "hero":
      return <Hero hero={home.hero} settings={settings} />;
    case "featured":
      return <FeaturedProperties cfg={section} />;
    case "needs-help":
      return <NeedsHelp cfg={section} />;
    case "browse-types":
      return (
        <BrowseByType
          cfg={section}
          types={(await getPropertyTypes())
            .filter((t) => t.enabled)
            .sort((a, b) => a.order - b.order)
            .map((t) => ({ href: t.slug || `/${t.listingTypes[0]}/${t.type}`, label: t.plural || t.label }))}
        />
      );
    case "how-it-works":
      return <HowItWorks cfg={section} />;
    case "locations":
      return (
        <section className="texture-dark py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="mb-3 text-xs font-bold tracking-[0.2em] uppercase text-gold-300">
                  {section.eyebrow ?? "Browse by location"}
                </p>
                <h2 className="font-display text-3xl leading-tight tracking-tight text-cream-50 sm:text-4xl">
                  {section.title ?? "Properties across Greater Monrovia"}
                </h2>
                {section.description ? (
                  <p className="mt-4 text-base leading-relaxed text-cream-50/70">{section.description}</p>
                ) : null}
              </div>
            </div>
            <div className="mt-8">
              <LocationGrid cmsLocations={locations} />
            </div>
          </div>
        </section>
      );
    case "recently-verified":
      return <RecentlyVerified cfg={section} />;
    case "why-me":
      return <WhyMe cfg={section} />;
    case "testimonials":
      return <TestimonialsSection cfg={section} />;
    case "owner-cta":
      return <OwnerCTA cfg={section} />;
    case "whatsapp-band":
      return <WhatsAppBand cfg={section} settings={settings} />;
    default:
      return null;
  }
}