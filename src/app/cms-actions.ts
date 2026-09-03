/**
 * Server actions for the CMS / Command Center. Each mutation:
 *  1. enforces the actor's role,
 *  2. persists to the CMS collections,
 *  3. records an audit entry,
 *  4. revalidates the affected routes.
 */
"use server";

import { revalidatePath } from "next/cache";
import { uid } from "@/lib/utils";
import {
  deleteFaq,
  deleteLocation,
  deleteMediaItem,
  deletePage,
  deletePropertyType,
  deleteTask,
  deleteUser,
  getAuditLog,
  getCurrentUser,
  getHomeWorking,
  getHomePublished,
  getLocationsCms,
  getNavigation,
  getPages,
  getPropertyTypes,
  getRevisions,
  getSettings,
  getTasks,
  getUsers,
  hashPassword,
  logAudit,
  publishHomeWorking,
  restoreRevision,
  saveFaq,
  saveHomeWorking,
  saveLocation,
  saveNavigation,
  savePage,
  savePropertyType,
  saveSettings,
  saveTask,
  saveUser,
  verifyPassword,
} from "@/lib/cms";
import {
  appendTestimonial,
  deleteTestimonial,
  getTestimonials,
  updateTestimonial,
} from "@/lib/store";
import type {
  AdminRole,
  AdminTask,
  AuditEntry,
  CustomPage,
  FaqItem,
  HomeData,
  LocationConfig,
  NavigationData,
  PropertyTypeConfig,
  SiteSettings,
  Testimonial,
} from "@/lib/types";
import { requireAdmin, type ActionResult } from "./actions";

function str(fd: FormData, key: string, fallback = ""): string {
  const v = fd.get(key);
  return typeof v === "string" ? v : fallback;
}

function bool(fd: FormData, key: string, fallback = false): boolean {
  const v = fd.get(key);
  if (v === null) return fallback;
  return v === "yes" || v === "on" || v === "true" || v === "1";
}

function num(fd: FormData, key: string, fallback = 0): number {
  const n = Number(str(fd, key));
  return Number.isFinite(n) ? n : fallback;
}

function list(fd: FormData, key: string): string[] {
  return str(fd, key)
    .split(/\r?\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function json<T>(fd: FormData, key: string, fallback: T): T {
  const raw = str(fd, key).trim();
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function after(ok: boolean, message: string, error?: string): ActionResult {
  revalidatePath("/", "layout");
  revalidatePath("/admin", "layout");
  return ok ? { ok: true, id: "cms", message } : { ok: false, error: error ?? message };
}

/* ----------------------- SETTINGS ----------------------- */

export async function cmsSaveSettingsGeneral(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const cur = await getSettings();
  const next: SiteSettings = {
    ...cur,
    general: {
      ...cur.general,
      name: str(fd, "name"),
      shortName: str(fd, "shortName") || cur.general.shortName,
      brandLine: str(fd, "brandLine"),
      tagline: str(fd, "tagline"),
      city: str(fd, "city"),
      address: str(fd, "address"),
      email: str(fd, "email"),
      phone: str(fd, "phone"),
      hours: str(fd, "hours"),
      currency: str(fd, "currency") || "USD",
      country: str(fd, "country") || "Liberia",
      timezone: str(fd, "timezone") || "Africa/Monrovia",
      domain: str(fd, "domain"),
    },
    topBar: {
      enabled: bool(fd, "topbarEnabled"),
      phone: str(fd, "topbarPhone") || cur.general.phone,
      hours: str(fd, "topbarHours") || cur.general.hours,
      serviceArea: list(fd, "topbarServiceArea"),
    },
    footer: {
      ...cur.footer,
      about: str(fd, "footerAbout"),
      copyright: str(fd, "footerCopyright"),
      note: str(fd, "footerNote"),
      columns: json<SiteSettings["footer"]["columns"]>(fd, "footerColumns", cur.footer.columns),
    },
    notifications: {
      email: str(fd, "notifyEmail") || cur.general.email,
      whatsapp: bool(fd, "notifyWhatsapp"),
      onNewRequest: bool(fd, "notifyNewRequest"),
      onOwnerSubmission: bool(fd, "notifyOwnerSubmission"),
      onViewing: bool(fd, "notifyViewing"),
    },
  };
  await saveSettings(next);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "settings", summary: "Updated general settings" });
  return after(true, "General settings saved");
}

export async function cmsSaveAgent(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const cur = await getSettings();
  const next: SiteSettings = {
    ...cur,
    agent: {
      name: str(fd, "name"),
      tagline: str(fd, "tagline"),
      phone: str(fd, "phone"),
      whatsapp: str(fd, "whatsapp"),
      email: str(fd, "email"),
      photo: str(fd, "photo"),
      credential: str(fd, "credential"),
      experienceYears: num(fd, "experienceYears", 8),
      areasServed: list(fd, "areasServed"),
      bio: str(fd, "bio"),
      philosophy: str(fd, "philosophy"),
      services: json<SiteSettings["agent"]["services"]>(fd, "services", cur.agent.services),
    },
  };
  await saveSettings(next);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "settings", summary: "Updated agent profile" });
  return after(true, "Agent profile saved");
}

export async function cmsSaveWhatsappSettings(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const cur = await getSettings();
  const next: SiteSettings = {
    ...cur,
    whatsapp: {
      number: str(fd, "number"),
      enabled: bool(fd, "enabled"),
      templates: {
        propertyInquiry: str(fd, "tplPropertyInquiry"),
        viewing: str(fd, "tplViewing"),
        propertyRequest: str(fd, "tplPropertyRequest"),
        generic: str(fd, "tplGeneric"),
        owner: str(fd, "tplOwner"),
      },
    },
    social: {
      facebook: str(fd, "facebook", cur.social.facebook),
      instagram: str(fd, "instagram", cur.social.instagram),
      tiktok: str(fd, "tiktok", cur.social.tiktok),
      youtube: str(fd, "youtube", cur.social.youtube),
      linkedin: str(fd, "linkedin", cur.social.linkedin),
    },
  };
  await saveSettings(next);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "settings", summary: "Updated WhatsApp + social settings" });
  return after(true, "WhatsApp & social settings saved");
}

export async function cmsSaveTemplates(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const cur = await getSettings();
  const next: SiteSettings = {
    ...cur,
    whatsapp: {
      ...cur.whatsapp,
      enabled: bool(fd, "enabled", cur.whatsapp.enabled),
      templates: {
        propertyInquiry: str(fd, "propertyInquiryText", cur.whatsapp.templates.propertyInquiry),
        viewing: str(fd, "viewingText", cur.whatsapp.templates.viewing),
        propertyRequest: str(fd, "propertyRequestText", cur.whatsapp.templates.propertyRequest),
        generic: str(fd, "genericText", cur.whatsapp.templates.generic),
        owner: str(fd, "ownerText", cur.whatsapp.templates.owner),
      },
    },
  };
  await saveSettings(next);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "settings", summary: "Updated WhatsApp templates" });
  return after(true, "Templates saved");
}

export async function cmsSaveSeoSettings(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const cur = await getSettings();
  const next: SiteSettings = {
    ...cur,
    seo: {
      title: str(fd, "title"),
      description: str(fd, "description"),
      keywords: list(fd, "keywords"),
      ogImage: str(fd, "ogImage"),
      robotsEnabled: bool(fd, "robotsEnabled"),
      sitemapEnabled: bool(fd, "sitemapEnabled"),
    },
  };
  await saveSettings(next);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "settings", summary: "Updated SEO settings" });
  return after(true, "SEO settings saved");
}

export async function cmsSaveAppearanceSettings(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const cur = await getSettings();
  const next: SiteSettings = {
    ...cur,
    appearance: {
      radius: (str(fd, "radius") || "lg") as SiteSettings["appearance"]["radius"],
      buttonStyle: (str(fd, "buttonStyle") || "pill") as SiteSettings["appearance"]["buttonStyle"],
      headingFont: str(fd, "headingFont"),
      bodyFont: str(fd, "bodyFont"),
      spacing: (str(fd, "spacing") || "comfortable") as SiteSettings["appearance"]["spacing"],
      colors: {
        primary: str(fd, "colorPrimary"),
        secondary: str(fd, "colorSecondary"),
        accent: str(fd, "colorAccent"),
        background: str(fd, "colorBackground"),
        text: str(fd, "colorText"),
      },
    },
  };
  await saveSettings(next);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "settings", summary: "Updated appearance settings" });
  return after(true, "Appearance settings saved");
}

/* ----------------------- NAVIGATION ----------------------- */

export async function cmsSaveNavigation(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const curNav = await getNavigation();
  const next: NavigationData = {
    items: json<NavigationData["items"]>(fd, "items", curNav.items),
    listProperty: {
      enabled: bool(fd, "listPropertyEnabled"),
      label: str(fd, "listPropertyLabel") || "List Property",
    },
    headerCta: {
      label: str(fd, "ctaLabel") || "Find a Property",
      href: str(fd, "ctaHref") || "/find",
      enabled: bool(fd, "ctaEnabled"),
    },
    whatsappButton: {
      enabled: bool(fd, "waEnabled"),
      message: str(fd, "waMessage"),
    },
    logo: {
      mark: str(fd, "logoMark") || "E",
      name: str(fd, "logoName") || "Eric Realty",
      tagline: str(fd, "logoTagline") || "Your Property Agent in Liberia",
    },
  };
  await saveNavigation(next);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "navigation", summary: "Updated navigation" });
  return after(true, "Navigation saved");
}

/* ----------------------- HOMEPAGE ----------------------- */

export async function cmsSaveHomeHero(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const home = await getHomeWorking();
  home.hero = {
    eyebrow: str(fd, "eyebrow"),
    title: str(fd, "title"),
    highlighted: str(fd, "highlighted"),
    description: str(fd, "description"),
    primaryCta: {
      label: str(fd, "primaryLabel") || "Find a Property",
      href: str(fd, "primaryHref") || "/find",
      whatsapp: bool(fd, "primaryWhatsapp"),
      message: str(fd, "primaryMessage"),
      enabled: true,
    },
    secondaryCta: {
      label: str(fd, "secondaryLabel") || "List Your Property",
      href: str(fd, "secondaryHref") || "/list-property",
      enabled: true,
    },
    trustBadges: list(fd, "trustBadges"),
    background: (str(fd, "background") || "gradient") as HomeData["hero"]["background"],
    image: str(fd, "image"),
    solidColor: str(fd, "solidColor"),
  };
  await saveHomeWorking(home);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "homepage", summary: "Edited hero section (draft)" });
  return after(true, "Hero section saved as draft");
}

export async function cmsSaveHomeSection(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const key = str(fd, "sectionKey");
  const home = await getHomeWorking();
  const idx = home.sections.findIndex((s) => s.key === key);
  const section = {
    key,
    enabled: bool(fd, "enabled"),
    eyebrow: str(fd, "eyebrow") || undefined,
    title: str(fd, "title") || undefined,
    subtitle: str(fd, "subtitle") || undefined,
    description: str(fd, "description") || undefined,
    ctaText: str(fd, "ctaText") || undefined,
    ctaHref: str(fd, "ctaHref") || undefined,
    data: json<Record<string, unknown>>(fd, "data", {}),
  };
  if (idx === -1) home.sections.push(section);
  else home.sections[idx] = section;
  await saveHomeWorking(home);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "homepage", summary: `Edited “${key}” section (draft)` });
  return after(true, "Section saved as draft");
}

export async function cmsSaveHomeSectionsOrder(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const home = await getHomeWorking();
  const next = json<{ key: string; enabled: boolean }[]>(fd, "sections", []);
  const byKey = new Map(home.sections.map((s) => [s.key, s]));
  home.sections = next
    .map((n) => ({ ...(byKey.get(n.key) ?? { key: n.key, enabled: n.enabled }), key: n.key, enabled: n.enabled }))
    .filter((s) => byKey.has(s.key) || s.key);
  await saveHomeWorking(home);
  await logAudit({ actor: ctx.user.name, action: "reorder", entity: "homepage", summary: "Reordered homepage sections (draft)" });
  return after(true, "Section order saved");
}

export async function cmsPublishHome(): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  await publishHomeWorking(ctx.user.name);
  return after(true, "Homepage published");
}

export async function cmsRestoreHomeRevision(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const restored = restoreRevision(id);
  if (!restored) return { ok: false, error: "Revision not found." };
  await logAudit({ actor: ctx.user.name, action: "restore", entity: "homepage", summary: `Restored revision ${id}` });
  return after(true, "Revision restored as draft (not yet published)");
}

export async function cmsDiscardHomeDraft(): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  await saveHomeWorking(await getHomePublished());
  await logAudit({ actor: ctx.user.name, action: "revert", entity: "homepage", summary: "Reverted working draft to last published state" });
  return after(true, "Draft reset to last published version");
}

/* ----------------------- PROPERTY TYPES ----------------------- */

export async function cmsSavePropertyType(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const id = str(fd, "id") || uid("pt");
  const existing = (await getPropertyTypes()).find((t) => t.id === id);
  const type = (str(fd, "type") || existing?.type || "house") as PropertyTypeConfig["type"];
  const config: PropertyTypeConfig = {
    ...(existing ?? ({ id } as PropertyTypeConfig)),
    id,
    type,
    label: str(fd, "label") || type,
    plural: str(fd, "plural") || str(fd, "label") || type,
    description: str(fd, "description"),
    icon: str(fd, "icon"),
    image: str(fd, "image"),
    slug: str(fd, "slug"),
    listingTypes: json<PropertyTypeConfig["listingTypes"]>(fd, "listingTypes", ["rent", "buy"]),
    enabled: bool(fd, "enabled"),
    order: num(fd, "order", 99),
    featured: bool(fd, "featured"),
  };
  await savePropertyType(config);
  await logAudit({ actor: ctx.user.name, action: "save", entity: "property-type", entityId: id, summary: `Saved property type “${config.label}”` });
  return after(true, "Property type saved");
}

export async function cmsDeletePropertyType(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  await deletePropertyType(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "property-type", entityId: id, summary: `Deleted property type ${id}` });
  return after(true, "Property type deleted");
}

/* ----------------------- LOCATIONS ----------------------- */

export async function cmsSaveLocation(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const id = str(fd, "id");
  const existing = (await getLocationsCms()).find((l) => l.id === id);
  const name = str(fd, "name") || existing?.name || "Location";
  const config: LocationConfig = {
    ...(existing ?? ({ id } as LocationConfig)),
    id,
    name,
    slug: str(fd, "slug") || existing?.slug || name.toLowerCase().replace(/\s+/g, "-"),
    intro: str(fd, "intro") || existing?.intro || "",
    description: str(fd, "description") || str(fd, "intro") || "",
    image: str(fd, "image"),
    seoTitle: str(fd, "seoTitle") || `Properties in ${name}`,
    seoDescription: str(fd, "seoDescription") || str(fd, "intro") || "",
    featured: bool(fd, "featured"),
    active: bool(fd, "active"),
    order: num(fd, "order", 99),
  };
  await saveLocation(config);
  await logAudit({ actor: ctx.user.name, action: "save", entity: "location", entityId: id, summary: `Saved location “${name}”` });
  return after(true, "Location saved");
}

export async function cmsDeleteLocation(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  await deleteLocation(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "location", entityId: id, summary: `Deleted location ${id}` });
  return after(true, "Location deleted");
}

/* ----------------------- TESTIMONIALS ----------------------- */

export async function cmsSaveTestimonial(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const id = str(fd, "id");
  const existing = (await getTestimonials()).find((t) => t.id === id);
  const tpl: Testimonial = {
    id: id || uid("t"),
    quote: str(fd, "quote"),
    name: str(fd, "name") || existing?.name || "Client",
    role: str(fd, "role"),
    propertyType: (str(fd, "propertyType") as Testimonial["propertyType"]) || existing?.propertyType || "rental",
    location: str(fd, "location"),
    rating: num(fd, "rating", 5),
    date: str(fd, "date") || existing?.date || new Date().toISOString().slice(0, 10),
  };
  if (existing) updateTestimonial(existing.id, tpl);
  else appendTestimonial(tpl);
  await logAudit({ actor: ctx.user.name, action: "save", entity: "testimonial", entityId: tpl.id, summary: `Saved testimonial by ${tpl.name}` });
  return after(true, "Testimonial saved");
}

export async function cmsDeleteTestimonial(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  await deleteTestimonial(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "testimonial", entityId: id, summary: `Deleted testimonial ${id}` });
  return after(true, "Testimonial deleted");
}

/* ----------------------- FAQS ----------------------- */

export async function cmsSaveFaq(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const id = str(fd, "id");
  const faq: FaqItem = {
    id: id || uid("faq"),
    question: str(fd, "question"),
    answer: str(fd, "answer"),
    order: num(fd, "order", 99),
    published: bool(fd, "published"),
  };
  await saveFaq(faq);
  await logAudit({ actor: ctx.user.name, action: "save", entity: "faq", entityId: faq.id, summary: `Saved FAQ “${faq.question.slice(0, 40)}”` });
  return after(true, "FAQ saved");
}

export async function cmsDeleteFaq(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  await deleteFaq(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "faq", entityId: id, summary: `Deleted FAQ ${id}` });
  return after(true, "FAQ deleted");
}

/* ----------------------- CUSTOM PAGES ----------------------- */

export async function cmsSavePage(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const id = str(fd, "id");
  const existing = (await getPages()).find((p) => p.id === id);
  const page: CustomPage = {
    ...(existing ?? {
      id: uid("page"),
      slug: "",
      title: "",
      published: false,
      sections: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }),
    id,
    slug: str(fd, "slug") || existing?.slug || "",
    title: str(fd, "title"),
    metaTitle: str(fd, "metaTitle"),
    metaDescription: str(fd, "metaDescription"),
    published: bool(fd, "published"),
    sections: json<CustomPage["sections"]>(fd, "sections", existing?.sections ?? []),
    updatedAt: new Date().toISOString(),
  };
  await savePage(page);
  await logAudit({ actor: ctx.user.name, action: "save", entity: "page", entityId: page.id, summary: `Saved page “${page.title}” (${page.slug})` });
  return after(true, "Page saved");
}

export async function cmsDeletePage(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  await deletePage(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "page", entityId: id, summary: `Deleted page ${id}` });
  return after(true, "Page deleted");
}

/* ----------------------- USERS ----------------------- */

export async function cmsSaveUser(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner"]);
  if (!ctx.ok) return ctx;
  const id = str(fd, "id");
  const existing = (await getUsers()).find((u) => u.id === id);
  const password = str(fd, "password");
  const user = {
    id: id || uid("user"),
    name: str(fd, "name") || existing?.name || "Team member",
    username: str(fd, "username") || existing?.username || "",
    role: (str(fd, "role") || "editor") as AdminRole,
    active: bool(fd, "active"),
    passwordHash: password ? hashPassword(password) : existing?.passwordHash ?? "",
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    lastLoginAt: existing?.lastLoginAt,
  };
  await saveUser(user);
  await logAudit({ actor: ctx.user.name, action: "save", entity: "user", entityId: user.id, summary: `Saved user “${user.name}” (${user.role})` });
  return after(true, "User saved");
}

export async function cmsDeleteUser(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner"]);
  if (!ctx.ok) return ctx;
  const target = (await getUsers()).find((u) => u.id === id);
  if (target?.role === "owner" && (await getUsers()).filter((u) => u.role === "owner").length <= 1) {
    return { ok: false, error: "You cannot delete the last owner account." };
  }
  await deleteUser(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "user", entityId: id, summary: `Deleted user ${id}` });
  return after(true, "User deleted");
}

export async function cmsChangePassword(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx;
  const current = str(fd, "current");
  const next = str(fd, "next");
  const currentUser = await getCurrentUser();
  if (!currentUser) return { ok: false, error: "You must be signed in." };
  if (!current) return { ok: false, error: "Enter your current password." };
  if (next.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  if (!verifyPassword(currentUser.username, current)) {
    return { ok: false, error: "Current password is incorrect." };
  }
  const users = await getUsers();
  const updated = users.map((u) => (u.id === currentUser.id ? { ...u, passwordHash: hashPassword(next) } : u));
  await saveUser(updated.find((u) => u.id === currentUser.id)!);
  await logAudit({ actor: currentUser.name, action: "change_password", entity: "user", entityId: currentUser.id, summary: "Changed own password" });
  return after(true, "Password changed");
}

/* ----------------------- READ HELPERS FOR ADMIN PAGES ----------------------- */

/* ----------------------- MEDIA ----------------------- */

export async function cmsDeleteMedia(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  await deleteMediaItem(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "media", entityId: id, summary: `Deleted media ${id}` });
  return after(true, "Media deleted");
}

export async function cmsPublishPage(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin", "editor"]);
  if (!ctx.ok) return ctx;
  const pages = (await getPages());
  const page = pages.find((p) => p.id === id);
  if (!page) return { ok: false, error: "Page not found" };
  await savePage({ ...page, published: true });
  await logAudit({ actor: ctx.user.name, action: "publish", entity: "page", entityId: id, summary: `Published page ${page.slug}` });
  return after(true, "Page published");
}

/* ----------------------- TASKS ----------------------- */

export async function cmsSaveTask(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const id = str(fd, "id");
  const existing = (await getTasks()).find((t) => t.id === id);
  const task: AdminTask = {
    id: id || uid("task"),
    title: str(fd, "title"),
    category: (str(fd, "category") as AdminTask["category"]) || "general",
    status: (str(fd, "status") as AdminTask["status"]) || "todo",
    dueAt: str(fd, "dueAt") || undefined,
    createdAt: existing?.createdAt || new Date().toISOString(),
  };
  if (!task.title) return { ok: false, error: "Task title is required" };
  await saveTask(task);
  await logAudit({ actor: ctx.user.name, action: "save", entity: "task", entityId: task.id, summary: `Saved task "${task.title}"` });
  return after(true, "Task saved");
}

export async function cmsToggleTask(id: string, status: AdminTask["status"]): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const task = (await getTasks()).find((t) => t.id === id);
  if (!task) return { ok: false, error: "Task not found" };
  await saveTask({ ...task, status });
  await logAudit({ actor: ctx.user.name, action: "update", entity: "task", entityId: id, summary: `Task "${task.title}" → ${status}` });
  return after(true, "Task updated");
}

export async function cmsDeleteTask(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  await deleteTask(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "task", entityId: id, summary: `Deleted task ${id}` });
  return after(true, "Task deleted");
}

/* ----------------------- NOTIFICATIONS ----------------------- */

export async function cmsSaveNotifications(prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const cur = await getSettings();
  const next: SiteSettings = {
    ...cur,
    notifications: {
      email: str(fd, "notifyEmail") || cur.general.email,
      whatsapp: bool(fd, "notifyWhatsapp", cur.notifications.whatsapp),
      onNewRequest: bool(fd, "notifyNewRequest", cur.notifications.onNewRequest),
      onOwnerSubmission: bool(fd, "notifyOwnerSubmission", cur.notifications.onOwnerSubmission),
      onViewing: bool(fd, "notifyViewing", cur.notifications.onViewing),
    },
  };
  await saveSettings(next);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "settings", summary: "Updated notification preferences" });
  return after(true, "Notifications saved");
}
