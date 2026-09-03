/**
 * Runtime store for the production deployment.
 *
 * Historically this persisted to a local `.data/` JSON folder. On Vercel's
 * serverless platform that folder is ephemeral, so the same JSON documents are
 * now stored as rows in a Postgres `KeyValue` table (see prisma/schema.prisma),
 * keyed by the filename they previously used on disk.
 *
 * Seed inventory lives in `src/lib/data.ts` and is merged with anything created
 * at runtime — preserving the original merge + tombstone behaviour.
 *
 * The public API (exported function names and return types) is unchanged.
 * Functions that hit the database are now `async`.
 */
import "server-only";
import { prisma } from "./prisma";
import { seedProperties } from "./data";
import { testimonials as seedTestimonials } from "./testimonials";
import type {
  Lead,
  OwnerSubmission,
  Property,
  PropertyAlert,
  PropertyRequest,
  Testimonial,
  ViewingRequest,
} from "./types";

async function readList<T>(file: string): Promise<T[]> {
  const row = await prisma.keyValue.findUnique({ where: { key: file } });
  if (!row) return [];
  return (row.value as unknown as T[]) ?? [];
}

async function writeList<T>(file: string, items: T[]): Promise<void> {
  await prisma.keyValue.upsert({
    where: { key: file },
    create: { key: file, value: items as unknown as object },
    update: { value: items as unknown as object },
  });
}

export async function getAllProperties(): Promise<Property[]> {
  const runtime = await readList<Property>("properties.json");
  const byId = new Map(runtime.map((p) => [p.id, p]));
  const deleted = new Set(await readList<string>("deleted_properties.json"));
  const merged = seedProperties.filter((s) => !deleted.has(s.id)).map((s) => byId.get(s.id) ?? s);
  const created = runtime.filter((r) => !seedProperties.some((s) => s.id === r.id));
  return [...merged, ...created];
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  const all = await getAllProperties();
  return all.find((p) => p.slug === slug || p.id === slug);
}

export async function appendProperty(property: Property): Promise<void> {
  const list = await readList<Property>("properties.json");
  list.push(property);
  await writeList("properties.json", list);
}

export async function updateProperty(id: string, patch: Partial<Property>): Promise<Property | undefined> {
  const list = await readList<Property>("properties.json");
  const index = list.findIndex((p) => p.id === id);
  const base = seedProperties.find((s) => s.id === id) ?? list[index];
  const merged = { ...(base ?? ({ id } as Property)), ...patch, updatedAt: new Date().toISOString() };
  if (index === -1) list.push(merged);
  else list[index] = merged;
  await writeList("properties.json", list);
  return merged;
}

export async function deleteProperty(id: string): Promise<void> {
  const list = await readList<Property>("properties.json");
  const removed = list.some((p) => p.id === id);
  await writeList(
    "properties.json",
    list.filter((p) => p.id !== id),
  );
  const isSeed = seedProperties.some((s) => s.id === id);
  if (removed || isSeed) {
    const deleted = new Set(await readList<string>("deleted_properties.json"));
    deleted.add(id);
    await writeList("deleted_properties.json", [...deleted]);
  }
}

/* ──────────────────────── requests ──────────────────────── */

export async function getRequests(): Promise<PropertyRequest[]> {
  const list = await readList<PropertyRequest>("requests.json");
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getRequest(id: string): Promise<PropertyRequest | undefined> {
  return (await readList<PropertyRequest>("requests.json")).find((r) => r.id === id);
}

export async function appendRequest(request: PropertyRequest): Promise<void> {
  const list = await readList<PropertyRequest>("requests.json");
  list.push(request);
  await writeList("requests.json", list);
}

export async function updateRequest(id: string, patch: Partial<PropertyRequest>): Promise<PropertyRequest | undefined> {
  const list = await readList<PropertyRequest>("requests.json");
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) return undefined;
  list[index] = { ...list[index], ...patch, updatedAt: new Date().toISOString() };
  await writeList("requests.json", list);
  return list[index];
}

/* ──────────────────────── viewings ──────────────────────── */

export async function getViewings(): Promise<ViewingRequest[]> {
  const list = await readList<ViewingRequest>("viewings.json");
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function appendViewing(viewing: ViewingRequest): Promise<void> {
  const list = await readList<ViewingRequest>("viewings.json");
  list.push(viewing);
  await writeList("viewings.json", list);
}

export async function updateViewing(id: string, patch: Partial<ViewingRequest>): Promise<ViewingRequest | undefined> {
  const list = await readList<ViewingRequest>("viewings.json");
  const index = list.findIndex((v) => v.id === id);
  if (index === -1) return undefined;
  list[index] = { ...list[index], ...patch };
  await writeList("viewings.json", list);
  return list[index];
}

/* ──────────────────────── leads ──────────────────────── */

export async function getLeads(): Promise<Lead[]> {
  const list = await readList<Lead>("leads.json");
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function appendLead(lead: Lead): Promise<void> {
  const list = await readList<Lead>("leads.json");
  list.push(lead);
  await writeList("leads.json", list);
}

export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead | undefined> {
  const list = await readList<Lead>("leads.json");
  const index = list.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  list[index] = { ...list[index], ...patch };
  await writeList("leads.json", list);
  return list[index];
}

/* ──────────────────────── owners ──────────────────────── */

export async function getOwnerSubmissions(): Promise<OwnerSubmission[]> {
  const list = await readList<OwnerSubmission>("owners.json");
  return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function appendOwnerSubmission(submission: OwnerSubmission): Promise<void> {
  const list = await readList<OwnerSubmission>("owners.json");
  list.push(submission);
  await writeList("owners.json", list);
}

export async function updateOwnerSubmission(
  id: string,
  patch: Partial<OwnerSubmission>,
): Promise<OwnerSubmission | undefined> {
  const list = await readList<OwnerSubmission>("owners.json");
  const index = list.findIndex((s) => s.id === id);
  if (index === -1) return undefined;
  list[index] = { ...list[index], ...patch, updatedAt: new Date().toISOString() };
  await writeList("owners.json", list);
  return list[index];
}

/* ──────────────────────── alerts ──────────────────────── */

export async function getAlerts(): Promise<PropertyAlert[]> {
  return readList<PropertyAlert>("alerts.json");
}

export async function appendAlert(alert: PropertyAlert): Promise<void> {
  const list = await readList<PropertyAlert>("alerts.json");
  list.push(alert);
  await writeList("alerts.json", list);
}

/* ──────────────────────── testimonials ──────────────────────── */

export async function getTestimonials(): Promise<Testimonial[]> {
  const list = await readList<Testimonial>("testimonials.json");
  if (list.length === 0 && seedTestimonials.length > 0) {
    await writeList("testimonials.json", seedTestimonials);
    return [...seedTestimonials].sort((a, b) => b.date.localeCompare(a.date));
  }
  return list.sort((a, b) => b.date.localeCompare(a.date));
}

export async function appendTestimonial(testimonial: Testimonial): Promise<void> {
  const list = await readList<Testimonial>("testimonials.json");
  list.push(testimonial);
  await writeList("testimonials.json", list);
}

export async function updateTestimonial(id: string, patch: Partial<Testimonial>): Promise<Testimonial | undefined> {
  const list = await readList<Testimonial>("testimonials.json");
  const index = list.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  list[index] = { ...list[index], ...patch };
  await writeList("testimonials.json", list);
  return list[index];
}

export async function deleteTestimonial(id: string): Promise<void> {
  await writeList(
    "testimonials.json",
    (await readList<Testimonial>("testimonials.json")).filter((t) => t.id !== id),
  );
}
