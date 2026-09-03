import { getTestimonials } from "@/lib/store";
import { cmsSaveTestimonial, cmsDeleteTestimonial } from "@/app/cms-actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { TestimonialForm } from "./testimonial-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Content"
        title="Testimonials"
        description="Client quotes shown in the Testimonials section on the homepage."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <AdminCard key={t.id} title={t.name}>
              <TestimonialForm testimonial={t} action={cmsSaveTestimonial as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
              <div className="mt-4 flex justify-end border-t border-ink-900/5 pt-4">
                <form
                  action={async () => {
                    "use server";
                    await cmsDeleteTestimonial(t.id);
                  }}
                >
                  <button type="submit" className="rounded-full border border-danger/30 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5">
                    Delete
                  </button>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>

        <AdminCard title="Add a testimonial">
          <TestimonialForm
            testimonial={{ id: "", quote: "", name: "", role: "", propertyType: "Rental", location: "", rating: 5, date: new Date().toISOString().slice(0, 10) }}
            action={cmsSaveTestimonial as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
            isNew
          />
        </AdminCard>
      </div>
    </div>
  );
}