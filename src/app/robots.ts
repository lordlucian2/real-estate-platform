import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.domain;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/properties", "/rent", "/buy", "/locations", "/about", "/services"],
        disallow: ["/admin", "/saved"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}