import { getLocationsCms } from "@/lib/cms";
import { cmsSaveLocation, cmsDeleteLocation } from "@/app/cms-actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { LocationForm } from "./location-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function LocationsPage() {
  const locations = await getLocationsCms();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website"
        title="Locations"
        description="The areas across Greater Monrovia shown in 'Browse by Location' and the footer."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {locations.map((loc) => (
            <AdminCard key={loc.id} title={loc.name}>
              <LocationForm
                location={loc}
                action={cmsSaveLocation as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
              />
              <div className="mt-4 flex justify-end border-t border-ink-900/5 pt-4">
                <form
                  action={async () => {
                    "use server";
                    await cmsDeleteLocation(loc.id);
                  }}
                >
                  <button type="submit" className="rounded-full border border-danger/30 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5">
                    Delete location
                  </button>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>
      </div>
    </div>
  );
}