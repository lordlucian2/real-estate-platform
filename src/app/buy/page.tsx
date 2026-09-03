import type { Metadata } from "next";
import OverviewPage, { buyOverview } from "@/components/property/overview";

export const metadata: Metadata = {
  title: "Buy — Property for Sale in Liberia",
  description:
    "Property for sale in Liberia — houses, compounds, apartments and land for sale in Monrovia and around Greater Monrovia, with honest documentation review.",
  alternates: { canonical: "/buy" },
};

export default function BuyPage() {
  return <OverviewPage {...buyOverview} />;
}