import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Property } from "@/lib/types";
import { TypeListing } from "@/components/property/type-listing";

const rentTypes: Record<string, { types: Property["type"][]; title: string; seo: string }> = {
  houses: { types: ["house"], title: "Houses for Rent in Liberia", seo: "Houses for rent in Monrovia, Paynesville, Sinkor, ELWA and across Greater Monrovia — verified bungalows and family homes for rent by month." },
  rooms: { types: ["room"], title: "Rooms for Rent in Monrovia", seo: "Affordable rooms for rent in Monrovia and its suburbs — occupancy confirmed before you visit." },
  apartments: { types: ["apartment"], title: "Apartments for Rent in Liberia", seo: "Modern apartments for rent in Sinkor, Congo Town, Paynesville and across Greater Monrovia." },
  compounds: { types: ["compound"], title: "Compounds for Rent in Liberia", seo: "Family compounds for rent across Greater Monrovia — multiple bedrooms, yard space and privacy." },
  commercial: { types: ["commercial", "office"], title: "Commercial Properties for Rent in Monrovia", seo: "Shops, offices and commercial spaces for rent in Monrovia — the right location for your business." },
  "short-term": { types: ["short-term"], title: "Short-Term Accommodation in Monrovia", seo: "Furnished short-stay accommodation in Monrovia for trips, relocations and work assignments." },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const def = rentTypes[type];
  if (!def) return { title: "Not found" };
  return {
    title: def.title,
    description: def.seo,
    alternates: { canonical: `/rent/${type}` },
    openGraph: { title: def.title, description: def.seo },
  };
}

export default async function RentTypePage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const def = rentTypes[type];
  if (!def) notFound();
  return <TypeListing listingType="rent" types={def.types} title={def.title} />;
}