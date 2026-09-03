"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  getAllProperties,
  appendProperty,
  updateProperty,
  deleteProperty,
  appendRequest,
  updateRequest,
  appendViewing,
  updateViewing,
  appendLead,
  updateLead,
  appendOwnerSubmission,
  updateOwnerSubmission,
  appendAlert,
} from "@/lib/store";
import { getLocation } from "@/lib/locations";
import { uid, slugify } from "@/lib/utils";
import {
  createSession,
  deleteSession,
  getCurrentUser,
  getUsers,
  logAudit,
  saveUser,
  verifyPassword,
} from "@/lib/cms";
import type {
  AdminRole,
  Lead,
  ListingType,
  OwnerSubmission,
  Property,
  PropertyAlert,
  PropertyRequest,
  PropertyStatus,
  PropertyType,
  RequestStatus,
  LeadStage,
  ViewingRequest,
} from "@/lib/types";

export type ActionResult =
  | { ok: true; id: string; message: string }
  | { ok: false; error: string };

function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function num(fd: FormData, key: string): number | undefined {
  const v = str(fd, key);
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function list(fd: FormData, key: string): string[] {
  return fd
    .getAll(key)
    .map((v) => String(v).trim())
    .filter(Boolean);
}

function optionalStr(fd: FormData, key: string): string | undefined {
  const v = str(fd, key);
  return v ? v : undefined;
}

const now = () => new Date().toISOString();

/**
 * Creates a lead so every inbound touchpoint lands in the CRM.
 */
async function trackLead(input: {
  name: string;
  source: Lead["source"];
  interest: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  notes?: string;
}): Promise<void> {
  await appendLead({
    id: uid("lead"),
    name: input.name || "Anonymous inquiry",
    source: input.source,
    stage: "new",
    interest: input.interest,
    whatsapp: input.whatsapp,
    phone: input.phone,
    email: input.email,
    notes: input.notes,
    createdAt: now(),
  });
}

/* ───────────────────── CONCIERGE REQUEST ───────────────────── */

export async function submitPropertyRequest(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const name = str(fd, "name");
  if (!name) return { ok: false, error: "Please enter your name." };

  const locations = list(fd, "location");
  const budgetMin = num(fd, "budgetMin");
  const budgetMax = num(fd, "budgetMax");
  const budget = num(fd, "budget");
  const bedrooms = num(fd, "bedrooms");
  const bathrooms = num(fd, "bathrooms");

  const request: PropertyRequest = {
    id: uid("req"),
    name,
    needType: (str(fd, "need") || "house") as PropertyRequest["needType"],
    purpose: (str(fd, "purpose") || "personal") as PropertyRequest["purpose"],
    locations,
    budgetMin,
    budgetMax,
    budget,
    currency: "USD",
    bedrooms,
    bathrooms,
    furnished: (str(fd, "furnished") || undefined) as PropertyRequest["furnished"],
    timeline: str(fd, "timeline") || "soon",
    specialRequirements: list(fd, "requirements"),
    whatsapp: optionalStr(fd, "whatsapp"),
    phone: optionalStr(fd, "phone"),
    email: optionalStr(fd, "email"),
    status: "new",
    matchedPropertyIds: [],
    createdAt: now(),
    updatedAt: now(),
  };

  await appendRequest(request);

  await trackLead({
    name,
    source: "property_request",
    interest: `Request: ${request.needType} in ${locations.join(" / ") || "any location"} (${request.budgetMin ?? "?"}–${request.budgetMax ?? "?"})`,
    whatsapp: request.whatsapp,
    phone: request.phone,
    email: request.email,
  });

  revalidatePath("/admin/requests");
  return { ok: true, id: request.id, message: "Request received" };
}

/* ───────────────────── VIEWING REQUEST ───────────────────── */

export async function submitViewingRequest(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const propertyId = str(fd, "propertyId");
  const name = str(fd, "name");
  if (!propertyId || !name) return { ok: false, error: "Property and name are required." };

  const viewing: ViewingRequest = {
    id: uid("viewing"),
    propertyId,
    preferredDate: optionalStr(fd, "preferredDate"),
    preferredTime: optionalStr(fd, "preferredTime"),
    name,
    whatsapp: optionalStr(fd, "whatsapp"),
    phone: optionalStr(fd, "phone"),
    email: optionalStr(fd, "email"),
    notes: optionalStr(fd, "notes"),
    status: "new",
    createdAt: now(),
  };

  await appendViewing(viewing);

  const property = (await getAllProperties()).find((p) => p.id === propertyId);
  await trackLead({
    name,
    source: "viewing",
    interest: `Viewing: ${property?.title ?? propertyId}`,
    whatsapp: viewing.whatsapp,
    phone: viewing.phone,
    email: viewing.email,
    notes: viewing.notes,
  });

  revalidatePath("/admin/viewings");
  revalidatePath("/admin");
  return { ok: true, id: viewing.id, message: "Viewing request received" };
}

/* ───────────────────── OWNER / LIST PROPERTY ───────────────────── */

export async function submitOwnerProperty(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const ownerName = str(fd, "ownerName");
  const phone = str(fd, "phone");
  if (!ownerName || !phone) return { ok: false, error: "Name and phone are required." };

  const price = num(fd, "price") ?? 0;
  const submission: OwnerSubmission = {
    id: uid("owner"),
    ownerName,
    phone,
    whatsapp: optionalStr(fd, "whatsapp"),
    email: optionalStr(fd, "email"),
    propertyType: (str(fd, "propertyType") || "house") as PropertyType,
    listingType: (str(fd, "listingType") || "rent") as ListingType,
    locationId: str(fd, "locationId"),
    price,
    currency: "USD",
    bedrooms: num(fd, "bedrooms") ?? 0,
    bathrooms: num(fd, "bathrooms") ?? 0,
    description: str(fd, "description"),
    amenities: list(fd, "amenities"),
    availability: str(fd, "availability") || "Immediately",
    photoUrls: list(fd, "photoUrls"),
    notes: optionalStr(fd, "notes"),
    status: "pending_review",
    createdAt: now(),
    updatedAt: now(),
  };

  await appendOwnerSubmission(submission);

  await trackLead({
    name: ownerName,
    source: "web_form",
    interest: `Owner listed: ${submission.propertyType} (${submission.listingType}) in ${getLocation(submission.locationId)?.name ?? submission.locationId}`,
    whatsapp: submission.whatsapp,
    phone: phone,
    email: submission.email,
    notes: submission.notes,
  });

  revalidatePath("/admin/owners");
  return {
    ok: true,
    id: submission.id,
    message: "Property submitted for review",
  };
}

/* ───────────────────── PROPERTY ALERTS ───────────────────── */

export async function subscribePropertyAlert(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const contact = str(fd, "contact");
  const channel = (str(fd, "channel") || "whatsapp") as PropertyAlert["channel"];
  if (!contact) return { ok: false, error: "Please enter your contact." };

  const alert: PropertyAlert = {
    id: uid("alert"),
    name: str(fd, "name") || "Alert subscriber",
    channel,
    contact,
    locations: list(fd, "location"),
    budgetMax: num(fd, "budgetMax"),
    propertyType: optionalStr(fd, "propertyType"),
    bedrooms: num(fd, "bedrooms"),
    active: true,
    createdAt: now(),
  };

  await appendAlert(alert);
  return { ok: true, id: alert.id, message: "Alert saved" };
}

/* ───────────────────── CONTACT MESSAGE ───────────────────── */

export async function submitContactMessage(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const name = str(fd, "name");
  const message = str(fd, "message");
  if (!message) return { ok: false, error: "Please write a message." };

  await trackLead({
    name: name || "Website inquiry",
    source: "other",
    interest: message.slice(0, 200),
    whatsapp: optionalStr(fd, "whatsapp"),
    phone: optionalStr(fd, "phone"),
    email: optionalStr(fd, "email"),
  });

  revalidatePath("/admin");
  return { ok: true, id: uid("lead"), message: "Message received" };
}

/* ───────────────────── ADMIN: REQUESTS / VIEWINGS / LEADS / OWNERS ───────────────────── */

export async function adminUpdateRequest(id: string, patch: { status?: RequestStatus; matchedPropertyIds?: string[] }): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx;
  await updateRequest(id, patch);
  await logAudit({ actor: ctx.user.name, action: "update", entity: "request", entityId: id, summary: `Updated request ${id}` });
  revalidatePath("/admin", "layout");
  return { ok: true, id, message: "Request updated" };
}

export async function adminUpdateViewing(id: string, status: ViewingRequest["status"]): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx;
  await updateViewing(id, { status });
  await logAudit({ actor: ctx.user.name, action: "update", entity: "viewing", entityId: id, summary: `Marked viewing ${id} ${status}` });
  revalidatePath("/admin", "layout");
  return { ok: true, id, message: "Viewing updated" };
}

export async function adminUpdateLead(id: string, stage: LeadStage): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx;
  await updateLead(id, { stage });
  await logAudit({ actor: ctx.user.name, action: "update", entity: "lead", entityId: id, summary: `Moved lead ${id} to ${stage}` });
  revalidatePath("/admin", "layout");
  return { ok: true, id, message: "Lead updated" };
}

export async function adminUpdateOwner(id: string, status: OwnerSubmission["status"]): Promise<ActionResult> {
  const ctx = await requireAdmin();
  if (!ctx.ok) return ctx;
  const owner = await updateOwnerSubmission(id, { status });
  await logAudit({ actor: ctx.user.name, action: "update", entity: "owner", entityId: id, summary: `Set owner submission ${id} to ${status}` });
  revalidatePath("/admin", "layout");
  if (owner && status === "verified") {
    // Approving a pending owner submission can publish it as a property.
    // We keep this manual: dashboards allow promoting to a property too.
  }
  return { ok: true, id, message: "Submission updated" };
}

export async function adminPromoteOwnerToProperty(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const { getOwnerSubmissions } = await import("@/lib/store");
  const submission = (await getOwnerSubmissions()).find((s) => s.id === id);
  if (!submission) return { ok: false, error: "Submission not found." };

  const slugBase = slugify(`${submission.propertyType}-${submission.listingType}-${submission.locationId}`);
  const location = getLocation(submission.locationId);

  const property: Property = {
    id: uid("p"),
    title: `${submission.bedrooms > 0 ? `${submission.bedrooms} Bedroom ` : ""}${
      submission.propertyType === "land" ? "Land" : submission.propertyType[0].toUpperCase() + submission.propertyType.slice(1)
    } for ${submission.listingType === "buy" ? "Sale" : "Rent"}`,
    slug: `${slugBase}-${Date.now().toString(36)}`,
    type: submission.propertyType,
    listingType: submission.listingType,
    description: submission.description || "Details pending final verification.",
    price: submission.price,
    currency: submission.currency,
    locationId: submission.locationId,
    address: location ? `${location.name}, Liberia` : submission.locationId,
    bedrooms: submission.bedrooms,
    bathrooms: submission.bathrooms,
    size: undefined,
    furnished: false,
    amenities: submission.amenities,
    features: [],
    rules: [],
    landmarks: [],
    agentNotes: "Converted from owner submission.",
    availabilityStatus: "available",
    verificationStatus: "owner_submitted",
    lastVerifiedAt: now(),
    status: "available",
    featured: false,
    images: submission.photoUrls.map((url, i) => ({ url, alt: submission.propertyType, order: i + 1 })),
    ownerId: submission.id,
    createdAt: now(),
    updatedAt: now(),
  };

  await appendProperty(property);
  await updateOwnerSubmission(id, { status: "verified" });
  await logAudit({ actor: ctx.user.name, action: "promote", entity: "owner", entityId: id, summary: `Published owner submission ${id} as property ${property.id}` });
  revalidatePath("/admin", "layout");
  return { ok: true, id: property.id, message: "Published as a property" };
}

/* ───────────────────── ADMIN: PROPERTY CRUD ───────────────────── */

export async function adminSaveProperty(fd: FormData): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const id = str(fd, "id");
  const title = str(fd, "title");
  if (!title) return { ok: false, error: "Title is required." };

  const locationId = str(fd, "locationId");
  const location = locationId ? getLocation(locationId) : undefined;
  const listingType = (str(fd, "listingType") || "rent") as ListingType;
  const propertyType = (str(fd, "type") || "house") as PropertyType;
  const price = num(fd, "price") ?? 0;

  const body: Omit<Property, "id" | "slug" | "createdAt" | "updatedAt"> = {
    title,
    type: propertyType,
    listingType,
    description: str(fd, "description"),
    price,
    currency: "USD",
    locationId,
    address: str(fd, "address") || (location ? `${location.name}, Liberia` : ""),
    bedrooms: num(fd, "bedrooms") ?? 0,
    bathrooms: num(fd, "bathrooms") ?? 0,
    size: num(fd, "size"),
    sizeUnit: str(fd, "sizeUnit") || "m²",
    furnished: str(fd, "furnished") === "yes",
    amenities: list(fd, "amenities") as Property["amenities"],
    features: list(fd, "features") as Property["features"],
    rules: list(fd, "rules") as Property["rules"],
    landmarks: list(fd, "landmarks") as Property["landmarks"],
    agentNotes: str(fd, "agentNotes"),
    availabilityStatus: "available",
    verificationStatus: (str(fd, "verificationStatus") || "verified") as Property["verificationStatus"],
    lastVerifiedAt: now(),
    status: (str(fd, "status") || "available") as PropertyStatus,
    featured: str(fd, "featured") === "yes",
    images:
      list(fd, "imageUrl").map((url, i) => ({
        url,
        alt: `${title} — photo ${i + 1}`,
        order: i + 1,
      })) || [],
    ownerId: undefined,
  };

  const existing = (await getAllProperties()).find((p) => p.id === id);
  const slugBase = slugify(title);
  if (existing) {
    await updateProperty(id, { ...body, slug: existing.slug });
    await logAudit({ actor: ctx.user.name, action: "update", entity: "property", entityId: id, summary: `Updated property “${title}”` });
    revalidatePath("/admin/properties", "layout");
    return { ok: true, id, message: "Property updated" };
  }

  const property: Property = {
    ...body,
    id: uid("p"),
    slug: `${slugBase}-${Date.now().toString(36)}`,
    createdAt: now(),
    updatedAt: now(),
  };
  await appendProperty(property);
  await logAudit({ actor: ctx.user.name, action: "create", entity: "property", entityId: property.id, summary: `Created property “${title}”` });
  revalidatePath("/admin/properties", "layout");
  return { ok: true, id: property.id, message: "Property created" };
}

export async function adminSetPropertyStatus(id: string, status: PropertyStatus): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  await updateProperty(id, { status });
  await logAudit({ actor: ctx.user.name, action: "status", entity: "property", entityId: id, summary: `Property ${id} → ${status}` });
  revalidatePath("/admin", "layout");
  return { ok: true, id, message: "Property status updated" };
}

export async function adminToggleVerified(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  const list = await getAllProperties();
  const property = list.find((p) => p.id === id);
  if (!property) return { ok: false, error: "Property not found." };
  const next: Property["verificationStatus"] =
    property.verificationStatus === "verified" ? "recently_checked" : "verified";
  await updateProperty(id, { verificationStatus: next, lastVerifiedAt: now() });
  await logAudit({ actor: ctx.user.name, action: "verify", entity: "property", entityId: id, summary: next === "verified" ? "Marked verified" : "Marked recently checked" });
  revalidatePath("/admin", "layout");
  return { ok: true, id, message: next === "verified" ? "Marked verified" : "Marked recently checked" };
}

export async function adminDeleteProperty(id: string): Promise<ActionResult> {
  const ctx = await requireAdmin(["owner", "admin"]);
  if (!ctx.ok) return ctx;
  await deleteProperty(id);
  await logAudit({ actor: ctx.user.name, action: "delete", entity: "property", entityId: id, summary: `Deleted property ${id}` });
  revalidatePath("/admin/properties", "layout");
  return { ok: true, id, message: "Property deleted" };
}

/* ───────────────────── ADMIN: AUTH ───────────────────── */

export type AdminContext = {
  ok: true;
  user: { id: string; name: string; role: AdminRole };
} | { ok: false; error: string };

async function adminContext(): Promise<AdminContext> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You must be signed in." };
  return { ok: true, user: { id: user.id, name: user.name, role: user.role } };
}

export async function requireAdmin(roles: AdminRole[] = ["owner", "admin", "editor"]): Promise<AdminContext> {
  const ctx = await adminContext();
  if (!ctx.ok) return ctx;
  if (!roles.includes(ctx.user.role)) {
    return { ok: false, error: "You don't have permission for this action." };
  }
  return ctx;
}

export async function adminLogin(_prev: ActionResult, fd: FormData): Promise<ActionResult> {
  const username = str(fd, "username") || "owner";
  const password = str(fd, "password");
  const user = await verifyPassword(username, password);
  if (!user) {
    return { ok: false, error: "Incorrect username or password." };
  }

  const token = await createSession(user);
  const c = await cookies();
  c.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  for (const u of await getUsers()) {
    if (u.id === user.id) await saveUser({ ...u, lastLoginAt: now() });
  }

  await logAudit({ actor: user.name, action: "login", entity: "session", summary: `${user.name} signed in` });
  revalidatePath("/admin", "layout");
  return { ok: true, id: "session", message: "Welcome" };
}

export async function adminLogout(): Promise<ActionResult> {
  const c = await cookies();
  const token = c.get("admin_session")?.value;
  if (token) {
    await deleteSession(token);
    await logAudit({ actor: "Session", action: "logout", entity: "session", summary: "Admin signed out" });
  }
  c.delete("admin_session");
  revalidatePath("/admin", "layout");
  return { ok: true, id: "session", message: "Logged out" };
}