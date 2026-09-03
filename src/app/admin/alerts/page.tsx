import type { Metadata } from "next";
import { BellRing } from "lucide-react";
import { getAlerts } from "@/lib/store";
import { getLocation } from "@/lib/locations";
import { propertyTypeOptions } from "@/lib/data";
import { relativeTime } from "@/lib/utils";

export const metadata: Metadata = { title: "Alerts" };
export const dynamic = "force-dynamic";

export default async function AdminAlertsPage() {
  const alerts = await getAlerts();

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-navy-900">Property Alerts</h1>
        <p className="text-sm text-ink-500">
          Subscribers waiting to hear about matching properties. Reach out when
          something fits.
        </p>
      </div>

      {alerts.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
          <BellRing size={28} className="mx-auto text-ink-400" />
          <p className="mt-3 font-display text-xl font-semibold text-navy-900">No subscribers yet</p>
          <p className="text-sm text-ink-500">Sign-ups from the alerts page will appear here.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {alerts.map((a) => (
            <div key={a.id} className="rounded-2xl border border-ink-900/5 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-navy-900">{a.name}</h2>
                <span
                  className={
                    a.channel === "whatsapp"
                      ? "rounded-full bg-whatsapp/10 px-3 py-1 text-xs font-bold text-whatsapp-dark"
                      : "rounded-full bg-gold-100 px-3 py-1 text-xs font-bold text-gold-700"
                  }
                >
                  {a.channel}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-ink-700">{a.contact}</p>
              <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                {a.locations.length > 0 ? (
                  a.locations.map((l) => (
                    <span key={l} className="rounded-full bg-cream-100 px-2.5 py-1 text-ink-600">
                      {getLocation(l)?.name ?? l}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-cream-100 px-2.5 py-1 text-ink-600">Any location</span>
                )}
                {a.propertyType ? (
                  <span className="rounded-full bg-cream-100 px-2.5 py-1 text-ink-600">
                    {propertyTypeOptions.find((o) => o.value === a.propertyType)?.label ?? a.propertyType}
                  </span>
                ) : null}
                {a.budgetMax ? (
                  <span className="rounded-full bg-cream-100 px-2.5 py-1 text-ink-600">up to ${a.budgetMax}</span>
                ) : null}
                {a.bedrooms ? (
                  <span className="rounded-full bg-cream-100 px-2.5 py-1 text-ink-600">{a.bedrooms}+ beds</span>
                ) : null}
              </div>
              <p className="mt-3 border-t border-ink-900/5 pt-2 text-xs text-ink-400">
                Subscribed {relativeTime(a.createdAt)}
                {a.active ? " · Active" : " · Paused"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}