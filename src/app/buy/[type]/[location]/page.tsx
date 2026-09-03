import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Property } from "@/lib/types";
import { TypeListing } from "@/components/property/type-listing";
import { getLocation } from "@/lib/locations";

const buyTypes: Record<string, Property["type"][]> = {
  properties: ["house", "compound", "apartment", "land", "office", "commercial"],
  houses: ["house", "compound"],
  apartments: ["apartment"],
  land: ["land"],
  commercial: ["commercial", "office"],
};

const titles: Record<string, (loc: string) => string> = {
  properties: (loc) => `Property for Sale in ${loc}`,
  houses: (loc) => `Houses for Sale in ${loc}`,
  apartments: (loc) => `Apartments for Sale in ${loc}`,
  land: (loc) => `Land for Sale in ${loc}`,
  commercial: (loc) => `Commercial Property for Sale in ${loc}`,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; location: string }>;
}): Promise<Metadata> {
  const { type, location } = await params;
  const loc = getLocation(location);
  if (!loc || !buyTypes[type]) return { title: "Not found" };
  const title = titles[type](loc.name);
  return {
    title,
    description: `${title}, Liberia. Verified options with honest documentation review, matched by a local property agent.`,
    alternates: { canonical: `/buy/${type}/${loc.slug}` },
  };
}

export default async function BuyLocationPage({
  params,
}: {
  params: Promise<{ type: string; location: string }>;
}) {
  const { type, location } = await params;
  const def = buyTypes[type];
  const loc = getLocation(location);
  if (!def || !loc) notFound();
  return (
    <TypeListing
      listingType="buy"
      types={def}
      locationSlug={loc.slug}
      title={titles[type](loc.name)}
    />
  );
}