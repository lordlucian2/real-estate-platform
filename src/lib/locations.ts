import type { Location } from "./types";

export const locations: Location[] = [
  {
    id: "monrovia",
    name: "Monrovia",
    slug: "monrovia",
    type: "city",
    intro:
      "Monrovia is Liberia's capital and economic heart. From the busy commercial districts to quiet residential streets, it offers the widest range of rental and sale options in the country.",
    landmarks: ["Downtown Carey Street", "Public offices", "Freeport of Monrovia", "Central hospitals"],
    highlights: ["Business hubs", "Executive housing", "Commercial spaces"],
  },
  {
    id: "sinkor",
    name: "Sinkor",
    slug: "sinkor",
    type: "district",
    parent: "monrovia",
    intro:
      "Sinkor is one of Monrovia's most desired residential areas — close to ministries, embassies and the airport road, with a growing mix of modern apartments and family houses.",
    landmarks: ["UN Drive", "MBA / Tropicana corridor", "Embassies", "Airport road"],
    highlights: ["Modern apartments", "Family houses", "Executive rentals"],
  },
  {
    id: "paynesville",
    name: "Paynesville",
    slug: "paynesville",
    type: "district",
    parent: "monrovia",
    intro:
      "Paynesville is Monrovia's fastest-growing suburb. It offers spacious houses and compounds at practical prices, plus quick access to the commercial center via the main road.",
    landmarks: ["Paynesville Market", "Red Light junction", "Brewerville road", "Rehab junction"],
    highlights: ["Affordable houses", "Compounds", "Land lots"],
  },
  {
    id: "congo-town",
    name: "Congo Town",
    slug: "congo-town",
    type: "district",
    parent: "monrovia",
    intro:
      "Congo Town blends a lively commercial corridor with quiet side streets full of small apartments and houses — a practical choice for professionals and families.",
    landmarks: ["Congo Town junction", "Ducor road area", "Market areas", "Main commercial street"],
    highlights: ["Apartments", "Shops & offices", "Quick rentals"],
  },
  {
    id: "elwa",
    name: "ELWA",
    slug: "elwa",
    type: "town",
    parent: "monrovia",
    intro:
      "ELWA sits along the airport road with affordable rooms, apartments and houses. It's a growing suburb popular with students and working families.",
    landmarks: ["ELWA Junction", "Airport highway", "Health facilities", "Local markets"],
    highlights: ["Budget rooms", "Family houses", "Growth area"],
  },
  {
    id: "rehab",
    name: "Rehab",
    slug: "rehab",
    type: "town",
    parent: "monrovia",
    intro:
      "Rehab is a settled suburb on the edge of Paynesville, known for peaceful residential streets, affordable family houses and available land.",
    landmarks: ["Rehab junction", "Paynesville border", "School compounds", "Community roads"],
    highlights: ["Residential lots", "Affordable houses", "Quiet streets"],
  },
  {
    id: "new-georgia",
    name: "New Georgia",
    slug: "new-georgia",
    type: "town",
    parent: "monrovia",
    intro:
      "New Georgia is an established suburb with large family compounds and valued residential land, popular with people who want space without leaving Greater Monrovia.",
    landmarks: ["New Georgia road", "Cassava farm corridor", "Community markets"],
    highlights: ["Family compounds", "Land for sale", "Established community"],
  },
  {
    id: "barnesville",
    name: "Barnesville",
    slug: "barnesville",
    type: "town",
    parent: "monrovia",
    intro:
      "Barnesville offers a quieter, greener living environment with larger plots and family houses — a favorite for those who value calm surroundings and space.",
    landmarks: ["Barnesville road", "Green hills", "Family compounds"],
    highlights: ["Quiet living", "Spacious plots", "Family homes"],
  },
  {
    id: "brewerville",
    name: "Brewerville",
    slug: "brewerville",
    type: "town",
    parent: "paynesville",
    intro:
      "Brewerville combines affordable housing with growing commercial activity. It's a practical area for first-time renters and buyers looking for value.",
    landmarks: ["Brewerville highway", "Millsburg road", "Local markets"],
    highlights: ["Affordable homes", "Value plots", "Growing suburb"],
  },
];

export function getLocation(idOrSlug: string): Location | undefined {
  return locations.find((l) => l.id === idOrSlug || l.slug === idOrSlug);
}

export const locationById = new Map(locations.map((l) => [l.id, l]));