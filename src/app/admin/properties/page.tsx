import type { Metadata } from "next";
import Link from "next/link";
import { Filter, Plus } from "lucide-react";
import { getAllProperties } from "@/lib/store";
import { getLocation } from "@/lib/locations";
import { typeLabels, listingLabels } from "@/lib/data";
import { formatPrice, relativeTime } from "@/lib/utils";
import { PropertyStatusControl } from "@/components/admin/status-controls";

export const metadata: Metadata = { title: "Properties" };
export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const properties = await getAllProperties();

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-navy-900">Properties</h1>
          <p className="text-sm text-ink-500">{properties.length} in inventory</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-bold text-navy-900 hover:bg-gold-400"
        >
          <Plus size={16} /> Add Property
        </Link>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-ink-900/5 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/5 text-xs uppercase tracking-wider text-ink-400">
                <th className="px-4 py-3 font-semibold">Property</th>
                <th className="px-4 py-3 font-semibold">Listing</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Last verified</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5">
              {properties.map((p) => {
                const loc = getLocation(p.locationId);
                return (
                  <tr key={p.id} className="align-middle">
                    <td className="px-4 py-3">
                      <Link href={`/properties/${p.slug}`} className="block max-w-64 truncate font-semibold text-navy-900 hover:text-gold-600">
                        {p.title}
                      </Link>
                      <span className="text-xs text-ink-400">
                        {loc?.name ?? "—"} · {typeLabels[p.type]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={p.listingType === "buy" ? "text-gold-700" : "text-navy-800"}>
                        {listingLabels[p.listingType]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-navy-900">
                      {formatPrice(p.price, p.currency, p.listingType)}
                    </td>
                    <td className="px-4 py-3 text-ink-500">
                      <span className={p.verificationStatus === "verified" ? "text-success" : p.verificationStatus === "recently_checked" ? "text-warning" : "text-ink-400"}>
                        {p.verificationStatus === "owner_submitted" ? "Owner submitted" : relativeTime(p.lastVerifiedAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <PropertyStatusControl property={p} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-400">
        <Filter size={12} /> Owner-submitted listings appear as &quot;Unverified&quot; until you confirm them.
      </p>
    </div>
  );
}