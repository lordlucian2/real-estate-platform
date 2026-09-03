import { getFaqs } from "@/lib/cms";
import { cmsSaveFaq, cmsDeleteFaq } from "@/app/cms-actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { FaqForm } from "./faq-form";
import type { ActionResult } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const faqs = await getFaqs();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Content"
        title="FAQs"
        description="Frequently asked questions. Q&A blocks can be added to about or contact pages."
      />
      <div className="space-y-6 p-4 sm:p-6">
        {faqs.map((f) => (
          <AdminCard key={f.id} title={f.question}>
            <FaqForm faq={f} action={cmsSaveFaq as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>} />
            <div className="mt-4 flex justify-end border-t border-ink-900/5 pt-4">
              <form
                action={async () => {
                  "use server";
                  await cmsDeleteFaq(f.id);
                }}
              >
                <button type="submit" className="rounded-full border border-danger/30 px-4 py-1.5 text-xs font-semibold text-danger hover:bg-danger/5">
                  Delete
                </button>
              </form>
            </div>
          </AdminCard>
        ))}

        <AdminCard title="Add an FAQ">
          <FaqForm
            faq={{ id: "", question: "", answer: "", order: faqs.length + 1, published: true }}
            action={cmsSaveFaq as unknown as (prev: ActionResult, fd: FormData) => Promise<ActionResult>}
            isNew
          />
        </AdminCard>
      </div>
    </div>
  );
}