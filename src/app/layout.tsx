import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter, MobileBottomNav } from "@/components/site/site-footer";
import { FloatingWhatsApp } from "@/components/site/floating-whatsapp";
import { site } from "@/lib/site";
import { getNavigation, getSettings, getLocationsCms } from "@/lib/cms";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? site.domain),
  title: {
    default: `${site.shortName} — Your Property Agent in Liberia`,
    template: `%s · ${site.shortName}`,
  },
  description:
    "Find a place that fits your life. Houses, rooms, apartments, land and commercial properties in Monrovia, Paynesville, Sinkor and more — personally verified and matched by a trusted Liberian property agent.",
  keywords: [
    "houses for rent in Liberia",
    "rooms for rent in Monrovia",
    "apartments for rent in Sinkor",
    "property for sale in Liberia",
    "land for sale in Liberia",
    "commercial property in Monrovia",
    "Liberia real estate agent",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.shortName,
    title: `${site.shortName} — Your Property Agent in Liberia`,
    description: "Personally verified properties and honest matching across Greater Monrovia.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, navigation, cmsLocations] = await Promise.all([
    getSettings(),
    getNavigation(),
    getLocationsCms(),
  ]);
  const shortName = settings.general.shortName;
  const brandLine = settings.general.brandLine;

  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        {settings.seo.title ? <title>{shortName} — {brandLine}</title> : null}
        <meta
          name="description"
          content={settings.seo.description ?? metadata.description}
        />
        {settings.seo.keywords?.length ? (
          <meta name="keywords" content={settings.seo.keywords.join(", ")} />
        ) : null}
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader navigation={navigation} settings={settings} />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <SiteFooter settings={settings} cmsLocations={cmsLocations} />
        <MobileBottomNav />
        <FloatingWhatsApp settings={settings} />
      </body>
    </html>
  );
}