"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, FormGrid, ToggleField, JsonTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Textarea } from "@/components/ui";
import type { HomeSectionCfg } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function SectionForm({
  section,
  action,
}: {
  section: HomeSectionCfg;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  const showCopy =
    section.key === "featured" ||
    section.key === "needs-help" ||
    section.key === "browse-types" ||
    section.key === "how-it-works" ||
    section.key === "locations" ||
    section.key === "recently-verified" ||
    section.key === "why-me" ||
    section.key === "testimonials" ||
    section.key === "owner-cta" ||
    section.key === "whatsapp-band";

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="sectionKey" value={section.key} />

      <AdminCard title="Visibility">
        <ToggleField name="enabled" label="Show this section on the homepage" checked={section.enabled} />
      </AdminCard>

      {showCopy ? (
        <AdminCard title="Section copy">
          {section.key === "how-it-works" || section.key === "whatsapp-band" || section.key === "testimonials" ? null : (
            <div className="space-y-4">
              <FormGrid>
                <Field label="Eyebrow (small label above the heading)">
                  <Input name="eyebrow" defaultValue={section.eyebrow ?? ""} />
                </Field>
                <Field label="Heading title">
                  <Input name="title" defaultValue={section.title ?? ""} />
                </Field>
              </FormGrid>
              {section.key !== "locations" && section.key !== "featured" ? (
                <Field label="Subtitle (small line under the heading)">
                  <Input name="subtitle" defaultValue={section.subtitle ?? ""} />
                </Field>
              ) : null}
              <Field label="Description / body text">
                <Textarea name="description" defaultValue={section.description ?? ""} rows={3} />
              </Field>
            </div>
          )}
          {section.key === "needs-help" || section.key === "owner-cta" || section.key === "featured" || section.key === "whatsapp-band" ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="CTA button text">
                <Input name="ctaText" defaultValue={section.ctaText ?? ""} />
              </Field>
              <Field label="CTA link target">
                <Input name="ctaHref" defaultValue={section.ctaHref ?? ""} />
              </Field>
            </div>
          ) : null}
        </AdminCard>
      ) : (
        <AdminCard title="Section copy" description="This section has no extra text fields — edit its copy through the settings that describe it.">
          <p className="text-sm text-ink-400">Nothing to configure here.</p>
        </AdminCard>
      )}

      <AdminCard
        title="Advanced data (JSON)"
        description={
          section.key === "how-it-works"
            ? "Steps, feature points and section-specific values. Format: { steps: [{ icon, title, text }], ... }"
            : section.key === "featured"
              ? "Optional { limit: number, propertyIds: [] } to control how many and which properties."
              : section.key === "whatsapp-band"
                ? "Optional { secondaryCtaText }."
                : "Optional extra configuration for this section."
        }
      >
        <JsonTextarea name="data" value={section.data ?? {}} />
      </AdminCard>

      <div className="sticky bottom-0 z-10 -mx-4 -mb-5 border-t border-ink-900/5 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/website/homepage" className="text-sm font-semibold text-ink-500 hover:text-navy-900">
            ← Back to sections
          </Link>
          <button
            type="submit"
            className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Save draft
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}