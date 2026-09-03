import type { AgentProfile } from "./types";

/**
 * CENTRAL SITE CONFIG — edit agent contact details, brand name and
 * the WhatsApp number used across the whole platform here.
 */
export const site = {
  name: "Eric — Your Property Agent in Liberia",
  shortName: "Eric Realty",
  brandLine: "Your Property Agent in Liberia",
  tagline: "Find a Place That Fits Your Life.",
  city: "Monrovia, Liberia",
  currency: "USD",
  domain: "https://ericrealty.example",
  whatsappNumber: "231770000000",
  phoneDisplay: "+231 77 000 0000",
  /** Business hours shown across the site */
  hours: "Mon – Sat · 8:00 AM – 6:00 PM",
};

export const agent: AgentProfile = {
  name: "Eric N.",
  tagline: "Real Estate Agent · Monrovia, Liberia",
  phone: site.phoneDisplay,
  whatsapp: site.whatsappNumber,
  email: "eric@example.com",
  photo: "",
  credential: "Licensed property agent serving Greater Monrovia",
  areasServed: [
    "Monrovia",
    "Sinkor",
    "Paynesville",
    "Congo Town",
    "ELWA",
    "Rehab",
    "New Georgia",
    "Barnesville",
    "Brewerville",
  ],
  experienceYears: 8,
  bio: "I help Liberians and returning residents find houses, rooms, apartments, land and commercial spaces that actually fit their budget and lifestyle. I personally verify every property I list, talk to owners, and work with you until you secure the right place.",
  philosophy:
    "I don't believe you should scroll through endless options or waste weeks chasing listings that are already gone. My job is simple: understand what you need, find the right options, verify them, and walk with you to the end of the deal.",
  services: [
    {
      title: "House & Apartment Rentals",
      description:
        "Verified homes matched to your budget, location and family size — from 1-bedroom apartments to large family compounds.",
    },
    {
      title: "Room Rentals",
      description:
        "Simple, budget-friendly rooms with honest availability. I confirm occupancy before you visit so you don't travel for nothing.",
    },
    {
      title: "Property Sales",
      description:
        "Houses, compounds and buildings for sale across Monrovia and its suburbs — screened for clean, transferable titles.",
    },
    {
      title: "Commercial Properties",
      description:
        "Offices, shops and workspaces for businesses that need the right location, parking and visibility.",
    },
    {
      title: "Land",
      description:
        "Residential and commercial land lots. I help you verify documentation and understand what you are buying.",
    },
    {
      title: "Property Sourcing",
      description:
        "Tell me exactly what you need and I will find it — including off-market places that are never listed publicly.",
    },
  ],
};

export const whatsappHelpers = {
  /** Link to open WhatsApp with the property asking template */
  propertyInquiry(propertyTitle: string): string {
    const text = `Hello, I am interested in the "${propertyTitle}" listed on your website. Is it still available?`;
    return whatsappLink(text);
  },
  findMeAProperty(): string {
    const text = `Hello ${agent.name}, I need help finding a property. Can you assist me?`;
    return whatsappLink(text);
  },
  listMyProperty(): string {
    const text = `Hello ${agent.name}, I have a property I would like to market. Can we talk?`;
    return whatsappLink(text);
  },
};

export function whatsappLink(message: string): string {
  const clean = site.whatsappNumber.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}