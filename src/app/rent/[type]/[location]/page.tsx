import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Property } from "@/lib/types";
import { TypeListing } from "@/components/property/type-listing";
import { getLocation } from "@/lib/locations";

const rentTypes: Record<string, Property["type"][]> = {
  houses: ["house"],
  rooms: ["room"],
  apartments: ["apartment"],
  compounds: ["compound"],
  commercial: ["commercial", "office"],
  "short-term": ["short-term"],
};

const titles: Record<string, (loc: string) => string> = {
  houses: (loc) => `Houses for Rent in ${loc}`,
  rooms: (loc) => `Rooms for Rent in ${loc}`,
  apartments: (loc) => `Apartments for Rent in ${loc}`,
  compounds: (loc) => `Compounds for Rent in ${loc}`,
  commercial: (loc) => `Commercial Space for Rent in ${loc}`,
  "short-term": (loc) => `Short-Stay Accommodation in ${loc}`,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; location: string }>;
}): Promise<Metadata> {
  const { type, location } = await params;
  const loc = getLocation(location);
  if (!loc || !rentTypes[type]) return { title: "Not found" };
  const title = titles[type](loc.name);
  return {
    title,
    description: `${title}. Verified, available options in ${loc.name}, Liberia — checked and confirmed by a local property agent.`,
    alternates: { canonical: `/rent/${type}/${loc.slug}` },
  };
}

export default async function RentLocationPage({
  params,
}: {
  params: Promise<{ type: string; location: string }>;
}) {
  const { type, location } = await params;
  const def = rentTypes[type];
  const loc = getLocation(location);
  if (!def || !loc) notFound();
  return (
    <TypeListing
      listingType="rent"
      types={def}
      locationSlug={loc.slug}
      title={titles[type](loc.name)}
    />
  );
}