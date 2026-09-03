"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, FormGrid, ToggleField, ListTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Textarea, Select } from "@/components/ui";
import type { HeroCms } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function HeroForm({
  hero,
  action,
}: {
  hero: HeroCms;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const h = hero;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="Headline & copy">
        <div className="space-y-4">
          <Field label="Eyebrow (pill text above the title)">
            <Input name="eyebrow" defaultValue={h.eyebrow} />
          </Field>
          <FormGrid>
            <Field label="Title (before the highlighted word)">
              <Input name="title" defaultValue={h.title} />
            </Field>
            <Field label="Highlighted word(s)">
              <Input name="highlighted" defaultValue={h.highlighted} />
            </Field>
          </FormGrid>
          <Field label="Description">
            <Textarea name="description" defaultValue={h.description} rows={3} />
          </Field>
          <Field label="Trust badges (one per line)">
            <ListTextarea name="trustBadges" value={h.trustBadges ?? []} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Call to action (primary)">
        <div className="space-y-4">
          <FormGrid>
            <Field label="Primary button label">
              <Input name="primaryLabel" defaultValue={h.primaryCta.label} />
            </Field>
            <Field label="Target (page link, e.g. /find)">
              <Input name="primaryHref" defaultValue={h.primaryCta.href ?? "/find"} />
            </Field>
          </FormGrid>
          <ToggleField name="primaryWhatsapp" label="Open WhatsApp instead of linking" checked={h.primaryCta.whatsapp} />
          {h.primaryCta.whatsapp ? (
            <Field label="WhatsApp message template">
              <Input name="primaryMessage" defaultValue={h.primaryCta.message ?? ""} />
            </Field>
          ) : null}
        </div>
      </AdminCard>

      <AdminCard title="Secondary button">
        <FormGrid>
          <Field label="Secondary button label">
            <Input name="secondaryLabel" defaultValue={h.secondaryCta.label} />
          </Field>
          <Field label="Target">
            <Input name="secondaryHref" defaultValue={h.secondaryCta.href ?? "/list-property"} />
          </Field>
        </FormGrid>
      </AdminCard>

      <AdminCard title="Background">
        <div className="space-y-4">
          <Field label="Background style">
            <Select name="background" defaultValue={h.background}>
              <option value="gradient">Brand gradient (default)</option>
              <option value="image">Background image</option>
              <option value="solid">Solid colour</option>
            </Select>
          </Field>
          <Field label="Background image URL">
            <Input name="image" defaultValue={h.image} placeholder="/api/media/... or absolute URL" />
          </Field>
          <Field label="Solid colour (hex)">
            <Input name="solidColor" defaultValue={h.solidColor} placeholder="#0B1528" />
          </Field>
        </div>
      </AdminCard>

      <div className="sticky bottom-0 z-10 -mx-4 -mb-5 border-t border-ink-900/5 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/website/homepage" className="text-sm font-semibold text-ink-500 hover:text-navy-900">
            ← Back
          </Link>
          <button
            type="submit"
            className="ml-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Save draft
          </button>
          <Link href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/10 px-4 py-2 text-sm font-semibold text-gold-700 hover:border-gold-500">
            View site
          </Link>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}