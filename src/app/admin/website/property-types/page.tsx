import { getPropertyTypes } from "@/lib/cms";
import { cmsSavePropertyType, cmsDeletePropertyType } from "@/app/cms-actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { PropertyTypeForm } from "./property-type-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function PropertyTypesPage() {
  const types = await getPropertyTypes();
  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Website"
        title="Property Types"
        description="The property categories shown in 'Browse by Property Type' on the homepage and used across filters."
      />
      <div className="space-y-6 p-4 sm:p-6">
        {types.map((t) => (
          <AdminCard key={t.id} title={t.label}>
            <PropertyTypeForm
              type={t}
              action={cmsSavePropertyType as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
            />
            <div className="mt-4 flex justify-end border-t border-ink-900/5 pt-4">
              <form action={async () => {
                "use server";
                await cmsDeletePropertyType(t.id);
              }}>
                <button type="submit" className="rounded-full border border-danger/30 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5">
                  Delete type
                </button>
              </form>
            </div>
          </AdminCard>
        ))}

        <AdminCard title="Add a new type">
          <PropertyTypeForm
            type={{ id: "", type: "house", label: "", plural: "", description: "", icon: "", image: "", slug: "", listingTypes: ["rent", "buy"], enabled: true, order: types.length + 1, featured: true }}
            action={cmsSavePropertyType as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
            isNew
          />
        </AdminCard>
      </div>
    </div>
  );
}