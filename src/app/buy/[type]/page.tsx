import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Property } from "@/lib/types";
import { TypeListing } from "@/components/property/type-listing";

const buyTypes: Record<string, { types: Property["type"][]; title: string; seo: string }> = {
  properties: { types: ["house", "compound", "apartment", "land", "office", "commercial"], title: "Property for Sale in Liberia", seo: "Houses, compounds, apartments and land for sale across Greater Monrovia, Liberia." },
  houses: { types: ["house", "compound"], title: "Houses for Sale in Liberia", seo: "Houses and family compounds for sale in Monrovia, Paynesville, Sinkor and suburbs." },
  apartments: { types: ["apartment"], title: "Apartments for Sale in Liberia", seo: "Apartments for sale in Liberia's main cities for home-buyers and investors." },
  land: { types: ["land"], title: "Land for Sale in Liberia", seo: "Residential and commercial land for sale in Brewerville, Rehab and across Liberia — with deed and survey review." },
  commercial: { types: ["commercial", "office"], title: "Commercial Property for Sale in Monrovia", seo: "Commercial buildings and office space for sale in Monrovia for businesses and investors." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const def = buyTypes[type];
  if (!def) return { title: "Not found" };
  return {
    title: def.title,
    description: def.seo,
    alternates: { canonical: `/buy/${type}` },
    openGraph: { title: def.title, description: def.seo },
  };
}

export default async function BuyTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const def = buyTypes[type];
  if (!def) notFound();
  return <TypeListing listingType="buy" types={def.types} title={def.title} />;
}