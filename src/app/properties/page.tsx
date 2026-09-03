import type { Metadata } from "next";
import { getAllProperties } from "@/lib/store";
import { getLocation } from "@/lib/locations";
import { PropertyBrowser } from "@/components/property/property-browser";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Available Properties in Liberia — Houses, Rooms, Apartments, Land",
  description:
    "Browse verified houses for rent, rooms, apartments, land and commercial properties across Monrovia, Paynesville, Sinkor, Congo Town, ELWA and more. Every listing shows when it was last verified.",
  alternates: { canonical: "/properties" },
};

const KNOWN_SLUGS = [
  "monrovia",
  "sinkor",
  "paynesville",
  "congo-town",
  "elwa",
  "rehab",
  "new-georgia",
  "barnesville",
  "brewerville",
];

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ listing?: string; location?: string }>;
}) {
  const params = await searchParams;

  const initialLocation =
    params.location && !KNOWN_SLUGS.includes(params.location)
      ? (getLocation(params.location)?.id ?? "")
      : params.location ?? "";

  const props = await getAllProperties();

  return (
    <>
<section className="texture-dark py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="The marketplace"
            tone="dark"
            title="Available Properties"
            subtitle={
              <>
                A curated, small inventory — because every listing here is
                personally managed and its availability confirmed. Filter by
                what matters to you.
              </>
            }
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <PropertyBrowser
          properties={props}
          initialListing={params.listing}
          initialLocation={initialLocation}
        />
      </section>
    </>
  );
}
export const dynamic = "force-dynamic";
