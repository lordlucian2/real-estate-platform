import type { Metadata } from "next";
import OverviewPage from "@/components/property/overview";
import { rentOverview } from "@/components/property/overview";

export const metadata: Metadata = {
  title: "Rent — Houses, Rooms, Apartments & Compounds in Liberia",
  description:
    "Houses for rent, rooms for rent, apartments and family compounds across Monrovia, Paynesville, Sinkor, ELWA and more — verified before you view.",
  alternates: { canonical: "/rent" },
};

export default function RentPage() {
  return <OverviewPage {...rentOverview} />;
}