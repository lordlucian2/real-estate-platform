import { getAllProperties } from "./store";
import { getLocation } from "./locations";
import type { Property, PropertyRequest } from "./types";

export interface MatchResult {
  property: Property;
  score: number;
  reasons: string[];
  warnings: string[];
}

const AMENITY_WEIGHT = 5;
const MAX_AMENITY_SCORE = 20;

function normLoc(input: string): string {
  return input.toLowerCase().trim().replace(/[\s-]+/g, " ");
}

/** Score a single property against a client request */
export function scoreProperty(property: Property, request: PropertyRequest): MatchResult | null {
  if (property.availabilityStatus !== "available") return null;
  if (property.status !== "available") return null;

  let score = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  const addReason = (r: string) => {
    reasons.push(r);
  };

  /* Location */
  const reqLocs = request.locations.map(normLoc);
  const propLoc = normLoc(property.locationId);
  const propLocObj = getLocation(property.locationId);
  const propBelongsTo = propLocObj
    ? [normLoc(propLocObj.id), normLoc(propLocObj.name), normLoc(propLocObj.parent ?? "")]
    : [];

  if (reqLocs.some((l) => l === propLoc || propBelongsTo.includes(l))) {
    score += 28;
    addReason("Preferred location");
  } else if (reqLocs.length === 0) {
    score += 18;
  } else {
    warnings.push("Location not in your preferred areas");
  }

  /* Property type */
  const need = request.needType;
  if (need === "property_to_buy") {
    if (property.listingType === "buy") score += 12;
  } else if (need === property.type) {
    score += 14;
  } else if (
    need === "house" &&
    (property.type === "compound" || property.type === "apartment")
  ) {
    score += 6;
  } else if (need === "room" && property.type === "apartment") {
    score += 3;
  } else {
    warnings.push("Different property type than requested");
  }

  /* Budget */
  const budgetSort = {
    rent: "monthly",
    "short-term": "monthly",
    buy: "one-off",
  }[property.listingType];

  const hasMin = typeof request.budgetMin === "number" && request.budgetMin > 0;
  const hasMax = typeof request.budgetMax === "number" && request.budgetMax > 0;

  if (hasMax && hasMin) {
    if (property.price >= request.budgetMin! && property.price <= request.budgetMax!) {
      score += 24;
      addReason(`Within budget ($${request.budgetMin}–$${request.budgetMax})`);
    } else if (property.price <= request.budgetMax! * 1.15) {
      score += 10;
      warnings.push(`Slightly above your top budget (${property.price})`);
    } else {
      warnings.push(`Price (${property.price}) outside your budget`);
    }
  } else if (hasMax) {
    if (property.price <= request.budgetMax!) {
      score += 24;
      addReason(`Within your budget`);
    } else {
      warnings.push(`Price (${property.price}) above your budget`);
    }
  } else if (hasMin) {
    if (property.price >= request.budgetMin!) {
      score += 16;
    }
  } else {
    score += 12;
    void budgetSort;
  }

  /* Bedrooms */
  const wantBeds = request.bedrooms ?? 0;
  if (wantBeds > 0) {
    if (property.bedrooms === wantBeds) {
      score += 14;
      addReason(`${wantBeds} bedroom${wantBeds > 1 ? "s" : ""}`);
    } else if (property.bedrooms >= wantBeds) {
      score += 8;
      addReason(`${property.bedrooms} bedrooms (larger than requested)`);
    } else {
      warnings.push("Fewer bedrooms than requested");
    }
  }

  /* Furnished */
  if (request.furnished === "yes" && !property.furnished) {
    warnings.push("Property is unfurnished");
  } else if (request.furnished === "yes" && property.furnished) {
    score += 6;
    addReason("Furnished");
  } else if (request.furnished === "no" && property.furnished) {
    warnings.push("Property comes furnished");
  }

  /* Amenities */
  if (request.specialRequirements.length > 0) {
    const matched = request.specialRequirements.filter((a) => property.amenities.includes(a));
    score += Math.min(matched.length * AMENITY_WEIGHT, MAX_AMENITY_SCORE);
    if (matched.length > 0) {
      addReason(`${matched.join(", ")} included`);
    }
  }

  /* Availability freshness — bump recently verified listings slightly */
  if (property.verificationStatus === "verified") score += 2;

  if (reasons.length === 0) reasons.push("Multiple suitable matches to compare");

  const finalScore = Math.min(score, 99);
  return { property, score: finalScore, reasons, warnings };
}

/** Rank available properties against a request, best match first */
export async function matchRequestToProperties(
  request: PropertyRequest,
  limit = 6,
): Promise<MatchResult[]> {
  const props = await getAllProperties();
  return props
    .map((p) => scoreProperty(p, request))
    .filter((m): m is MatchResult => m !== null && m.score >= 15)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}