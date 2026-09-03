import type { Metadata } from "next";
import { LocationGrid } from "@/components/home/location-grid";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Browse Properties by Location — Greater Monrovia",
  description:
    "Explore available property in Sinkor, Paynesville, Congo Town, ELWA, Rehab, New Georgia, Barnesville, Brewerville and Monrovia — personally verified listings in each area.",
  alternates: { canonical: "/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <section className="texture-dark py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Browse by location"
            tone="dark"
            title="Find Your Area"
            subtitle="Each neighborhood page shows what's actually available there right now — nothing more, nothing stale."
          />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <LocationGrid />
      </section>
    </>
  );
}