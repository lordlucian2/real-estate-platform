export type ListingType = "rent" | "buy" | "short-term";

export type PropertyType =
  | "house"
  | "room"
  | "apartment"
  | "compound"
  | "office"
  | "commercial"
  | "land"
  | "short-term";

export type VerificationStatus =
  | "verified"
  | "recently_checked"
  | "owner_submitted"
  | "unavailable";

export type AvailabilityStatus = "available" | "unavailable";

export type PropertyStatus =
  | "available"
  | "unavailable"
  | "rented"
  | "sold"
  | "archived";

export interface PropertyImage {
  url: string;
  alt: string;
  /** Order within the gallery */
  order: number;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  type: PropertyType;
  listingType: ListingType;
  description: string;
  price: number;
  currency: string;
  locationId: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  size?: number;
  sizeUnit?: string;
  furnished: boolean;
  amenities: string[];
  features: string[];
  rules: string[];
  landmarks: string[];
  agentNotes: string;
  availabilityStatus: AvailabilityStatus;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
  status: PropertyStatus;
  featured: boolean;
  images: PropertyImage[];
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  seo?: {
    title?: string;
    description?: string;
  };
}

/** Client "Tell me what you need" requests */
export type RequestStatus =
  | "new"
  | "searching"
  | "matches_found"
  | "viewing_scheduled"
  | "closed";

export type RequestPurpose = "personal" | "family" | "business" | "investment";

export interface PropertyRequest {
  id: string;
  name: string;
  needType: PropertyType | "property_to_buy";
  purpose: RequestPurpose;
  locations: string[];
  budgetMin?: number;
  budgetMax?: number;
  budget?: number;
  currency: string;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: "yes" | "no" | "either";
  timeline: string;
  specialRequirements: string[];
  whatsapp?: string;
  phone?: string;
  email?: string;
  status: RequestStatus;
  matchedPropertyIds: string[];
  matchScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  propertyTitle: string;
  score: number;
  reasons: string[];
}

/** Viewing requests */
export interface ViewingRequest {
  id: string;
  propertyId: string;
  preferredDate?: string;
  preferredTime?: string;
  name: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  notes?: string;
  status: "new" | "contacted" | "confirmed" | "done" | "lost";
  createdAt: string;
}

/** Lead management */
export type LeadStage =
  | "new"
  | "contacted"
  | "viewing"
  | "negotiation"
  | "closed"
  | "lost";

export interface Lead {
  id: string;
  name: string;
  source: "whatsapp" | "web_form" | "property_request" | "viewing" | "referral" | "other";
  stage: LeadStage;
  interest: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

/** Owner / landlord submissions */
export type SubmissionStatus = "pending_review" | "contacted" | "verified" | "rejected";

export interface OwnerSubmission {
  id: string;
  ownerName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  propertyType: PropertyType;
  listingType: ListingType;
  locationId: string;
  price: number;
  currency: string;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  availability: string;
  photoUrls: string[];
  notes?: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: "city" | "district" | "town";
  parent?: string;
  intro: string;
  landmarks: string[];
  highlights: string[];
}

export type TestimonialType =
  | "Rental"
  | "Sale"
  | "Room"
  | "Commercial"
  | "Land"
  | "Apartment";

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  propertyType: TestimonialType;
  location: string;
  rating: number;
  date: string;
}

export interface PropertyAlert {
  id: string;
  name: string;
  channel: "whatsapp" | "email";
  contact: string;
  locations: string[];
  budgetMax?: number;
  propertyType?: string;
  bedrooms?: number;
  active: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  contact: string;
  channel: "whatsapp" | "email" | "phone";
  body: string;
  direction: "inbound" | "outbound";
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface AdminTask {
  id: string;
  title: string;
  category: "property" | "request" | "viewing" | "owner" | "lead" | "general";
  status: "todo" | "in_progress" | "done";
  dueAt?: string;
  createdAt: string;
}

export interface AgentProfile {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo: string;
  credential: string;
  areasServed: string[];
  experienceYears: number;
  bio: string;
  philosophy: string;
  services: { title: string; description: string }[];
}

/* ═══════════════════════ CMS / ADMIN ═══════════════════════ */

export type AdminRole = "owner" | "admin" | "editor";

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  role: AdminRole;
  active: boolean;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminSession {
  token: string;
  userId: string;
  name: string;
  role: AdminRole;
  createdAt: string;
  expiresAt: string;
}

export interface CtaConfig {
  label: string;
  href?: string;
  whatsapp?: boolean;
  message?: string;
  enabled: boolean;
}

export interface SiteSettings {
  general: {
    name: string;
    shortName: string;
    brandLine: string;
    tagline: string;
    city: string;
    address: string;
    email: string;
    phone: string;
    hours: string;
    currency: string;
    country: string;
    timezone: string;
    domain: string;
  };
  agent: {
    name: string;
    tagline: string;
    phone: string;
    whatsapp: string;
    email: string;
    photo: string;
    credential: string;
    experienceYears: number;
    areasServed: string[];
    bio: string;
    philosophy: string;
    services: { title: string; description: string }[];
  };
  whatsapp: {
    number: string;
    enabled: boolean;
    templates: {
      propertyInquiry: string;
      viewing: string;
      propertyRequest: string;
      generic: string;
      owner: string;
    };
  };
  social: {
    facebook: string;
    instagram: string;
    tiktok: string;
    youtube: string;
    linkedin: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
    robotsEnabled: boolean;
    sitemapEnabled: boolean;
  };
  appearance: {
    radius: "sm" | "md" | "lg";
    buttonStyle: "pill" | "soft" | "sharp";
    headingFont: string;
    bodyFont: string;
    spacing: "compact" | "comfortable" | "large";
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
  };
  topBar: {
    enabled: boolean;
    phone: string;
    hours: string;
    serviceArea: string[];
  };
  footer: {
    about: string;
    columns: { id: string; title: string; links: { label: string; href: string }[] }[];
    copyright: string;
    note: string;
  };
  notifications: {
    email: string;
    whatsapp: boolean;
    onNewRequest: boolean;
    onOwnerSubmission: boolean;
    onViewing: boolean;
  };
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  enabled: boolean;
}

export interface NavigationData {
  items: NavItem[];
  listProperty: { enabled: boolean; label: string };
  headerCta: CtaConfig;
  whatsappButton: { enabled: boolean; message: string };
  logo: { mark: string; name: string; tagline: string };
}

export interface HeroCms {
  eyebrow: string;
  title: string;
  highlighted: string;
  description: string;
  primaryCta: CtaConfig;
  secondaryCta: CtaConfig;
  trustBadges: string[];
  background: "gradient" | "image" | "solid";
  image: string;
  solidColor: string;
}

export interface HomeSectionCfg {
  key: string;
  enabled: boolean;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaHref?: string;
  data?: Record<string, unknown>;
}

export interface HomeData {
  status: "draft" | "published";
  updatedAt: string;
  hero: HeroCms;
  sections: HomeSectionCfg[];
}

export interface PropertyTypeConfig {
  id: string;
  type: PropertyType;
  label: string;
  plural: string;
  description: string;
  icon: string;
  image: string;
  slug: string;
  listingTypes: ListingType[];
  enabled: boolean;
  order: number;
  featured: boolean;
}

export interface LocationConfig extends Location {
  description: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  kind: "image" | "document" | "other";
  folder: string;
  size: number;
  uploadedAt: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: string;
  entity: string;
  entityId?: string;
  summary: string;
  before?: string;
  after?: string;
}

export interface Revision {
  id: string;
  entity: string;
  entityId: string;
  label: string;
  snapshot: unknown;
  at: string;
  actor: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

export interface CustomPageSection {
  id: string;
  kind:
    | "hero"
    | "text"
    | "image"
    | "property-grid"
    | "property-search"
    | "property-types"
    | "locations"
    | "testimonials"
    | "how-it-works"
    | "cta"
    | "faq"
    | "contact-form"
    | "whatsapp-cta"
    | "html";
  enabled: boolean;
  title?: string;
  subtitle?: string;
  data?: Record<string, unknown>;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  published: boolean;
  sections: CustomPageSection[];
  createdAt: string;
  updatedAt: string;
}