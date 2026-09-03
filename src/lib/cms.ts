/**
 * CMS DATA LAYER (server-only)
 *
 * The website is data-driven: public pages read published CMS content from the
 * store and merge it over the defaults below. The admin panel writes the same
 * collections, so no source-code edits are needed to run the site.
 *
 * Production persistence: the former `.data/` JSON documents are stored as rows
 * in a Postgres `KeyValue` table, keyed by the filename they used on disk.
 * Functions that hit the database are now `async`. Public names/types are
 * unchanged, so callers only add `await`.
 */
import "server-only";
import { cookies } from "next/headers";
import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { prisma } from "./prisma";
import { uid } from "./utils";
import { locations as seedLocations } from "./locations";
import { propertyTypeOptions } from "./data";
import type {
  AdminSession,
  AdminTask,
  AdminUser,
  AuditEntry,
  CustomPage,
  FaqItem,
  HomeData,
  HomeSectionCfg,
  LocationConfig,
  MediaItem,
  NavigationData,
  PropertyTypeConfig,
  Revision,
  SiteSettings,
} from "./types";

/* ─── low-level KeyValue document read/write ─── */
async function write(file: string, value: unknown): Promise<void> {
  await prisma.keyValue.upsert({
    where: { key: file },
    create: { key: file, value: value as object },
    update: { value: value as object },
  });
}

async function readOrSeed<T>(file: string, seed: T): Promise<T> {
  const existing = await prisma.keyValue.findUnique({ where: { key: file } });
  if (!existing) {
    await write(file, seed);
    return seed;
  }
  return (existing.value as unknown as T) ?? seed;
}

/* ═════════════════════════ DEFAULT CONTENT ═════════════════════════ */

const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    name: "Eric — Your Property Agent in Liberia",
    shortName: "Eric Realty",
    brandLine: "Your Property Agent in Liberia",
    tagline: "Find a Place That Fits Your Life.",
    city: "Monrovia, Liberia",
    address: "Monrovia, Liberia",
    email: "eric@example.com",
    phone: "+231 77 000 0000",
    hours: "Mon – Sat · 8:00 AM – 6:00 PM",
    currency: "USD",
    country: "Liberia",
    timezone: "Africa/Monrovia",
    domain: "https://ericrealty.example",
  },
  agent: {
    name: "Eric N.",
    tagline: "Real Estate Agent · Monrovia, Liberia",
    phone: "+231 77 000 0000",
    whatsapp: "231770000000",
    email: "eric@example.com",
    photo: "",
    credential: "Licensed property agent serving Greater Monrovia",
    experienceYears: 8,
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
    bio: "I help Liberians and returning residents find houses, rooms, apartments, land and commercial spaces that actually fit their budget and lifestyle. I personally verify every property I list, talk to owners, and work with you until you secure the right place.",
    philosophy:
      "I don't believe you should scroll through endless options or waste weeks chasing listings that are already gone. My job is simple: understand what you need, find the right options, verify them, and walk with you to the end of the deal.",
    services: [
      { title: "House & Apartment Rentals", description: "Verified homes matched to your budget, location and family size — from 1-bedroom apartments to large family compounds." },
      { title: "Room Rentals", description: "Simple, budget-friendly rooms with honest availability. I confirm occupancy before you visit so you don't travel for nothing." },
      { title: "Property Sales", description: "Houses, compounds and buildings for sale across Monrovia and its suburbs — screened for clean, transferable titles." },
      { title: "Commercial Properties", description: "Offices, shops and workspaces for businesses that need the right location, parking and visibility." },
      { title: "Land", description: "Residential and commercial land lots. I help you verify documentation and understand what you are buying." },
      { title: "Property Sourcing", description: "Tell me exactly what you need and I will find it — including off-market places that are never listed publicly." },
    ],
  },
  whatsapp: {
    number: "231770000000",
    enabled: true,
    templates: {
      propertyInquiry:
        "Hello, I am interested in the \"{propertyTitle}\" listed on your website. Is it still available?",
      viewing: "Hello, I would like to request a viewing for the {propertyTitle}.",
      propertyRequest:
        "Hello, I am looking for a {propertyType} in {location} with a budget of {budget}.",
      generic: "Hello {agentName}, I need help finding a property. Can you assist me?",
      owner: "Hello {agentName}, I have a property I would like to market. Can we talk?",
    },
  },
  social: { facebook: "", instagram: "", tiktok: "", youtube: "", linkedin: "" },
  seo: {
    title: "Find a Place That Fits Your Life — Houses, Rooms, Apartments & Land in Liberia",
    description:
      "Houses for rent in Monrovia, rooms in Paynesville, apartments in Sinkor, land and commercial properties across Greater Monrovia — personally verified and matched by a trusted Liberian property agent.",
    keywords: ["Liberia", "Monrovia", "real estate", "houses for rent", "land for sale", "property agent"],
    ogImage: "",
    robotsEnabled: true,
    sitemapEnabled: true,
  },
  appearance: {
    radius: "lg",
    buttonStyle: "pill",
    headingFont: "Fraunces",
    bodyFont: "Inter",
    spacing: "comfortable",
    colors: {
      primary: "#0B1528",
      secondary: "#0E1A30",
      accent: "#F6E7C9",
      background: "#FBF9F4",
      text: "#1C2436",
    },
  },
  topBar: {
    enabled: true,
    phone: "+231 77 000 0000",
    hours: "Mon – Sat · 8:00 AM – 6:00 PM",
    serviceArea: ["Monrovia", "Sinkor", "Paynesville", "Congo Town"],
  },
  footer: {
    about:
      "Personally verified properties, sensible matching and honest advice — so you find the right place without wasting your time.",
    columns: [
      {
        id: "explore",
        title: "Explore",
        links: [
          { label: "All Properties", href: "/properties" },
          { label: "Houses for Rent", href: "/rent" },
          { label: "Rooms for Rent", href: "/rent/rooms" },
          { label: "Apartments for Rent", href: "/rent/apartments" },
          { label: "Property for Sale", href: "/buy" },
          { label: "Land for Sale", href: "/buy/land" },
          { label: "What I Help With", href: "/services" },
        ],
      },
      { id: "locations", title: "Locations", links: [] },
    ],
    copyright: "Eric Realty · Your Property Agent in Liberia.",
    note: "Verified properties · Personal matching · WhatsApp-first service",
  },
  notifications: {
    email: "eric@example.com",
    whatsapp: true,
    onNewRequest: true,
    onOwnerSubmission: true,
    onViewing: true,
  },
};

const DEFAULT_NAVIGATION: NavigationData = {
  items: [
    { id: "home", label: "Home", href: "/", enabled: true },
    { id: "properties", label: "Properties", href: "/properties", enabled: true },
    { id: "rent", label: "Rent", href: "/rent", enabled: true },
    { id: "buy", label: "Buy", href: "/buy", enabled: true },
    { id: "about", label: "About", href: "/about", enabled: true },
    { id: "contact", label: "Contact", href: "/contact", enabled: true },
  ],
  listProperty: { enabled: true, label: "List Property" },
  headerCta: { label: "Find a Property", href: "/find", enabled: true },
  whatsappButton: {
    enabled: true,
    message: "Hello {agentName}, I need help finding a property. Can you assist me?",
  },
  logo: { mark: "E", name: "Eric Realty", tagline: "Your Property Agent in Liberia" },
};

const DEFAULT_HOME: HomeData = {
  status: "published",
  updatedAt: new Date().toISOString(),
  hero: {
    eyebrow: "Your Property Agent in Liberia",
    title: "Find a Place That",
    highlighted: "Fits Your Life.",
    description:
      "Houses, rooms, apartments, land and commercial properties — personally verified, seriously vetted and matched to what you actually need. No wasted trips. No chasing dead listings.",
    primaryCta: { label: "Find a Property", href: "/find", enabled: true },
    secondaryCta: { label: "List Your Property", href: "/list-property", enabled: true },
    trustBadges: ["Personally verified", "8+ Years Serving Greater Monrovia"],
    background: "gradient",
    image: "",
    solidColor: "#0B1528",
  },
  sections: [
    { key: "hero", enabled: true },
    { key: "featured", enabled: true, eyebrow: "Hand-picked", title: "Featured Properties", subtitle: "A few of the options currently available — every one personally confirmed before it goes live.", ctaText: "View all properties", ctaHref: "/properties", data: { limit: 4, propertyIds: [] } },
    {
      key: "needs-help",
      enabled: true,
      eyebrow: "The concierge",
      title: "Can't Find What You're Looking For?",
      description:
        "Tell us what you need and we'll help you search. You get a real person who walks through your budget, location and requirements — then brings you options that actually fit. This is how most of my successful matches begin.",
      ctaText: "Tell Me What You Need",
      ctaHref: "/find",
      data: {
        featurePoints: ["Off-market options", "Owner negotiations", "Viewing arrangements", "No pressure"],
        whatsappCtaEnabled: true,
        whatsappCtaText: "Chat on WhatsApp",
      },
    },
    { key: "browse-types", enabled: true, eyebrow: "Find what you need", title: "Browse by Property Type", subtitle: "Every category is small on purpose — because every listing is personally managed.", data: {} },
    { key: "how-it-works", enabled: true, eyebrow: "How it works", title: "From Request to Keys, in Three Steps", data: {
      steps: [
        { icon: "MessageCircle", title: "Tell Me What You Need", text: "Share your budget, location and requirements through the request form or WhatsApp. It takes two minutes." },
        { icon: "Search", title: "I Find Suitable Options", text: "I search my verified listings and my off-market network, then shortlist the best fits for your review." },
        { icon: "View", title: "View & Decide", text: "I arrange viewings personally and walk with you through every decision until you're satisfied." },
      ],
    } },
    { key: "locations", enabled: true, eyebrow: "Browse by location", title: "Properties across Greater Monrovia", description: "From the commercial energy of downtown Monrovia to the quiet family suburbs of Barnesville and Brewerville.", data: {} },
    { key: "recently-verified", enabled: true, eyebrow: "Fresh & confirmed", title: "Recently Verified", subtitle: "These listings were checked most recently. In a market where listings go stale fast, that recency is the point.", data: {} },
    { key: "why-me", enabled: true, eyebrow: "Why work with me", title: "More than listings. A person you can trust.", data: {
      quote: "I don't believe you should scroll through endless options or waste weeks chasing listings that are already gone.",
    } },
    { key: "testimonials", enabled: true, eyebrow: "What clients say", title: "People who found their place through me", data: {} },
    { key: "owner-cta", enabled: true, eyebrow: "For property owners", title: "Have a Property to Rent or Sell?", description: "Let us help you reach serious renters and buyers. Submit your property once, and I'll verify the details, market it to my client list and handle the inquiries — so you deal with genuine people only.", ctaText: "List Your Property", ctaHref: "/list-property", data: {
      featurePoints: ["Professional photography", "Serious inquiries only", "You stay in control"],
      whatsappCtaText: "Talk to Me First",
    } },
    { key: "whatsapp-band", enabled: true, title: "The fastest way to ask me is WhatsApp.", description: "Send me a message and tell me what you're looking for. I reply personally — usually the same day.", ctaText: "Chat on WhatsApp", data: { secondaryCtaText: "Tell Me What You Need" } },
  ],
};

const DEFAULT_PROPERTY_TYPES: PropertyTypeConfig[] = propertyTypeOptions.map((o, i) => ({
  id: `pt-${i + 1}`,
  type: o.value as PropertyTypeConfig["type"],
  label: o.label,
  plural: o.label,
  description: "",
  icon: "",
  image: "",
  slug: "",
  listingTypes: o.value === "land" ? ["buy"] : o.value === "short-term" ? ["rent", "short-term"] : ["rent", "buy"],
  enabled: true,
  order: i + 1,
  featured: i < 6,
}));

const DEFAULT_FAQS: FaqItem[] = [
  { id: "faq-1", question: "How do I know a listing is still available?", answer: "Every property shows its last verification date. I personally confirm availability before you travel to view.", order: 1, published: true },
  { id: "faq-2", question: "Do I pay you to find a property?", answer: "My fee depends on the arrangement with the owner or landlord. Tell me what you need and I'll be upfront about costs.", order: 2, published: true },
  { id: "faq-3", question: "Can you help me sell or rent my property?", answer: "Yes. Submit your property through the List Your Property form and I'll verify, photograph, market and handle inquiries for you.", order: 3, published: true },
];

/* ═════════════════════════ WHATSAPP ═════════════════════════ */

export function cmsWhatsappLink(settings: SiteSettings, message: string): string {
  const clean = settings.whatsapp.number.replace(/[^0-9]/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
}

export function fillTemplate(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
}

/* ═════════════════════════ SETTINGS ═════════════════════════ */

export async function getSettings(): Promise<SiteSettings> {
  return readOrSeed("settings.json", DEFAULT_SETTINGS);
}

export async function saveSettings(patch: SiteSettings): Promise<SiteSettings> {
  await write("settings.json", patch);
  return patch;
}

/* ═════════════════════════ NAVIGATION ═════════════════════════ */

export async function getNavigation(): Promise<NavigationData> {
  return readOrSeed("navigation.json", DEFAULT_NAVIGATION);
}

export async function saveNavigation(patch: NavigationData): Promise<NavigationData> {
  await write("navigation.json", patch);
  return patch;
}

/* ═════════════════════════ HOME / SECTIONS ═════════════════════════ */

export async function getHomeWorking(): Promise<HomeData> {
  return readOrSeed("home.json", DEFAULT_HOME);
}

export async function getHomePublished(): Promise<HomeData> {
  return readOrSeed("home_published.json", DEFAULT_HOME);
}

export async function saveHomeWorking(home: HomeData): Promise<HomeData> {
  await write("home.json", { ...home, status: "draft", updatedAt: new Date().toISOString() });
  return home;
}

export async function publishHomeWorking(actor: string, label = "Homepage"): Promise<HomeData> {
  const working = await getHomeWorking();
  await write("home_published.json", { ...working, status: "published", updatedAt: new Date().toISOString() });
  await pushRevision("home", "home", label, working, actor);
  await logAudit({ actor, action: "publish", entity: "homepage", summary: `Published ${label}` });
  return working;
}

export function getHomeSection(sections: HomeSectionCfg[], key: string): HomeSectionCfg | undefined {
  return sections.find((s) => s.key === key);
}

/* ═════════════════════════ PROPERTY TYPES ═════════════════════════ */

export async function getPropertyTypes(): Promise<PropertyTypeConfig[]> {
  return readOrSeed("property_types.json", DEFAULT_PROPERTY_TYPES);
}

export async function savePropertyType(type: PropertyTypeConfig): Promise<void> {
  const list = await getPropertyTypes();
  const idx = list.findIndex((t) => t.id === type.id);
  if (idx === -1) list.push(type);
  else list[idx] = type;
  await write("property_types.json", list);
}

export async function deletePropertyType(id: string): Promise<void> {
  await write(
    "property_types.json",
    (await getPropertyTypes()).filter((t) => t.id !== id),
  );
}

/* ═════════════════════════ LOCATIONS ═════════════════════════ */

export async function getLocationsCms(): Promise<LocationConfig[]> {
  const seeded: LocationConfig[] = seedLocations.map((l, i) => ({
    ...l,
    description: l.intro,
    image: "",
    seoTitle: `Properties in ${l.name}`,
    seoDescription: l.intro,
    featured: i < 4,
    active: true,
    order: i + 1,
  }));
  const list = await readOrSeed("locations.json", seeded);
  return list.sort((a, b) => a.order - b.order);
}

export async function saveLocation(loc: LocationConfig): Promise<void> {
  const list = await getLocationsCms();
  const idx = list.findIndex((l) => l.id === loc.id);
  if (idx === -1) list.push(loc);
  else list[idx] = loc;
  await write("locations.json", list);
}

export async function deleteLocation(id: string): Promise<void> {
  await write(
    "locations.json",
    (await getLocationsCms()).filter((l) => l.id !== id),
  );
}

/* ═════════════════════════ MEDIA LIBRARY ═════════════════════════ */

export async function getMedia(): Promise<MediaItem[]> {
  return readOrSeed<MediaItem[]>("media.json", []);
}

export async function addMedia(items: MediaItem[]): Promise<void> {
  await write("media.json", [...(await getMedia()), ...items]);
}

export async function saveMedia(items: MediaItem[]): Promise<void> {
  await write("media.json", items);
}

export async function deleteMediaItem(id: string): Promise<void> {
  const items = await getMedia();
  await write("media.json", items.filter((m) => m.id !== id));
}

export async function renameMediaItem(id: string, name: string): Promise<void> {
  const items = await getMedia();
  const idx = items.findIndex((m) => m.id === id);
  if (idx === -1) return;
  const urlParts = items[idx].url.split("/");
  const oldName = urlParts[urlParts.length - 1];
  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "_") || "file";
  const extensionMatch = oldName.split(".").pop();
  const newName = extensionMatch && safe.includes(".")
    ? safe
    : extensionMatch && !safe.includes(".")
      ? `${safe}.${extensionMatch}`
      : safe;
  items[idx] = { ...items[idx], name: newName, url: items[idx].url.replace(oldName, encodeURIComponent(newName)) };
  await write("media.json", items);
}

/* ═════════════════════════ TASKS ═════════════════════════ */

export async function getTasks(): Promise<AdminTask[]> {
  return readOrSeed<AdminTask[]>("tasks.json", []);
}

export async function saveTask(task: AdminTask): Promise<void> {
  const tasks = await getTasks();
  const idx = tasks.findIndex((t) => t.id === task.id);
  if (idx === -1) tasks.push(task);
  else tasks[idx] = task;
  await write("tasks.json", tasks);
}

export async function deleteTask(id: string): Promise<void> {
  await write("tasks.json", (await getTasks()).filter((t) => t.id !== id));
}

/* ═════════════════════════ FAQs ═════════════════════════ */

export async function getFaqs(): Promise<FaqItem[]> {
  return readOrSeed("faqs.json", DEFAULT_FAQS);
}

export async function saveFaq(faq: FaqItem): Promise<void> {
  const list = await getFaqs();
  const idx = list.findIndex((f) => f.id === faq.id);
  if (idx === -1) list.push(faq);
  else list[idx] = faq;
  await write("faqs.json", list);
}

export async function deleteFaq(id: string): Promise<void> {
  await write(
    "faqs.json",
    (await getFaqs()).filter((f) => f.id !== id),
  );
}

/* ═════════════════════════ CUSTOM PAGES ═════════════════════════ */

export async function getPages(): Promise<CustomPage[]> {
  return readOrSeed<CustomPage[]>("pages.json", []);
}

export async function savePage(page: CustomPage): Promise<void> {
  const list = await getPages();
  const idx = list.findIndex((p) => p.id === page.id);
  if (idx === -1) list.push(page);
  else list[idx] = page;
  await write("pages.json", list);
}

export async function deletePage(id: string): Promise<void> {
  await write(
    "pages.json",
    (await getPages()).filter((p) => p.id !== id),
  );
}

/* ═════════════════════════ AUDIT LOG ═════════════════════════ */

export async function getAuditLog(): Promise<AuditEntry[]> {
  const list = await readOrSeed<AuditEntry[]>("audit.json", []);
  return list.sort((a, b) => b.at.localeCompare(a.at));
}

export async function logAudit(entry: {
  actor: string;
  action: string;
  entity: string;
  entityId?: string;
  summary: string;
  before?: string;
  after?: string;
}): Promise<void> {
  const logs = await readOrSeed<AuditEntry[]>("audit.json", []);
  logs.push({ id: uid("audit"), at: new Date().toISOString(), ...entry });
  await write("audit.json", logs.slice(0, 500));
}

/* ═════════════════════════ REVISIONS ═════════════════════════ */

export async function getRevisions(entity: string, entityId = "home"): Promise<Revision[]> {
  const list = await readOrSeed<Revision[]>("revisions.json", []);
  return list
    .filter((r) => r.entity === entity && r.entityId === entityId)
    .sort((a, b) => b.at.localeCompare(a.at));
}

export async function pushRevision(
  entity: string,
  entityId: string,
  label: string,
  snapshot: unknown,
  actor: string,
): Promise<void> {
  const list = await readOrSeed<Revision[]>("revisions.json", []);
  list.push({
    id: uid("rev"),
    entity,
    entityId,
    label,
    snapshot,
    at: new Date().toISOString(),
    actor,
  });
  await write("revisions.json", list.slice(-50));
}

export async function restoreRevision(id: string): Promise<HomeData | null> {
  const list = await readOrSeed<Revision[]>("revisions.json", []);
  const rev = list.find((r) => r.id === id);
  if (!rev || rev.entity !== "home") return null;
  const home = rev.snapshot as HomeData;
  await write("home.json", { ...home, status: "draft", updatedAt: new Date().toISOString() });
  return getHomeWorking();
}

/* ═════════════════════════ AUTH / USERS / SESSIONS ═════════════════════════ */

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `scrypt$${salt}$${hash}`;
}

function verifyStoredHash(password: string, stored: string): boolean {
  if (stored.startsWith("scrypt$")) {
    const [, salt, hash] = stored.split("$");
    const derived = scryptSync(password, salt!, 32);
    const expected = Buffer.from(hash!, "hex");
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  }
  return createHash("sha256").update(password).digest("hex") === stored;
}

async function seedUsers(): Promise<AdminUser[]> {
  const envPassword = process.env.ADMIN_PASSWORD ?? "monrovia2026";
  return [
    {
      id: "u-owner",
      name: "Eric (Owner)",
      username: "owner",
      role: "owner",
      active: true,
      passwordHash: hashPassword(envPassword),
      createdAt: new Date().toISOString(),
    },
  ];
}

export async function getUsers(): Promise<AdminUser[]> {
  return readOrSeed("users.json", await seedUsers());
}

export async function saveUser(user: AdminUser): Promise<void> {
  const list = await getUsers();
  const idx = list.findIndex((u) => u.id === user.id);
  if (idx === -1) list.push(user);
  else list[idx] = user;
  await write("users.json", list);
}

export async function deleteUser(id: string): Promise<void> {
  await write(
    "users.json",
    (await getUsers()).filter((u) => u.id !== id),
  );
}

export async function getSessions(): Promise<AdminSession[]> {
  return readOrSeed("sessions.json", []);
}

export async function createSession(user: AdminUser): Promise<string> {
  const token = randomBytes(24).toString("hex");
  const sessions = (await getSessions()).filter((s) => s.expiresAt > new Date().toISOString());
  sessions.push({
    token,
    userId: user.id,
    name: user.name,
    role: user.role,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  });
  await write("sessions.json", sessions);
  return token;
}

export async function deleteSession(token: string): Promise<void> {
  await write(
    "sessions.json",
    (await getSessions()).filter((s) => s.token !== token),
  );
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const c = await cookies();
  const token = c.get("admin_session")?.value;
  if (!token) return null;
  const session = (await getSessions()).find((s) => s.token === token && s.expiresAt > new Date().toISOString());
  if (!session) return null;
  return (await getUsers()).find((u) => u.id === session.userId && u.active) ?? null;
}

export async function verifyPassword(username: string, password: string): Promise<AdminUser | null> {
  const users = (await getUsers()).filter((u) => u.active);
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user) return null;
  if (!verifyStoredHash(password, user.passwordHash)) return null;
  return user;
}
