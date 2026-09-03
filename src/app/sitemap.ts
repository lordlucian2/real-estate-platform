import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { locations } from "@/lib/locations";
import { getAllProperties } from "@/lib/store";
import { propertyTypeMap } from "@/lib/data";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.domain;

const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "", priority: 1, changeFrequency: "daily" },
  { path: "/properties", priority: 0.9, changeFrequency: "daily" },
  { path: "/rent", priority: 0.8, changeFrequency: "weekly" },
  { path: "/buy", priority: 0.8, changeFrequency: "weekly" },
  { path: "/find", priority: 0.9, changeFrequency: "monthly" },
  { path: "/list-property", priority: 0.8, changeFrequency: "monthly" },
  { path: "/locations", priority: 0.6, changeFrequency: "weekly" },
  { path: "/about", priority: 0.5, changeFrequency: "monthly" },
  { path: "/services", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "monthly" },
  { path: "/alerts", priority: 0.6, changeFrequency: "monthly" },
  { path: "/saved", priority: 0.3, changeFrequency: "monthly" },
];

const typeRoutes = Object.values(propertyTypeMap);

function locEntry(slug: string): MetadataRoute.Sitemap[number] {
  return { url: `${base}/locations/${slug}`, changeFrequency: "weekly", priority: 0.7 };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${base}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  for (const listing of ["rent", "buy"] as const) {
    for (const type of typeRoutes) {
      entries.push({
        url: `${base}/${listing}/${type}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
      for (const loc of locations) {
        entries.push({
          url: `${base}/${listing}/${type}/${loc.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  }

  for (const loc of locations) entries.push(locEntry(loc.slug));

  for (const property of await getAllProperties()) {
    if (property.status === "archived") continue;
    entries.push({
      url: `${base}/properties/${property.slug}`,
      lastModified: new Date(property.updatedAt),
      changeFrequency: property.listingType === "buy" ? "monthly" : "weekly",
      priority: property.featured ? 0.9 : 0.7,
    });
  }

  return entries;
}