import type { Metadata } from "next";
import { SectionRenderer } from "@/components/home/home-sections";
import { getHomePublished, getSettings, getLocationsCms } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Find a Place That Fits Your Life — Houses, Rooms, Apartments & Land in Liberia",
  description:
    "Houses for rent in Monrovia, rooms in Paynesville, apartments in Sinkor, land and commercial properties across Greater Monrovia — personally verified and matched by a trusted Liberian property agent.",
};

export default async function HomePage() {
  const home = await getHomePublished();
  const settings = await getSettings();
  const locations = await getLocationsCms();

  return (
    <>
      {home.sections.map((section) => (
        <SectionRenderer key={section.key} section={section} home={home} settings={settings} locations={locations} />
      ))}
    </>
  );
}
export const dynamic = "force-dynamic";
