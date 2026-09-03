"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, FormGrid, ToggleField, JsonTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input } from "@/components/ui";
import type { NavigationData } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function NavigationForm({
  nav,
  action,
}: {
  nav: NavigationData;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard
        title="Menu items"
        description="JSON list of nav links. Each item: { id, label, href, enabled }. Order matters."
      >
        <JsonTextarea name="items" value={nav.items} rows={10} />
      </AdminCard>

      <AdminCard title="Logo & brand">
        <FormGrid>
          <Field label="Mark (the letter shown in the gold tile)">
            <Input name="logoMark" defaultValue={nav.logo.mark} />
          </Field>
          <Field label="Brand name">
            <Input name="logoName" defaultValue={nav.logo.name} />
          </Field>
          <Field label="Tagline (small text under the name)">
            <Input name="logoTagline" defaultValue={nav.logo.tagline} className="sm:col-span-2" />
          </Field>
        </FormGrid>
      </AdminCard>

      <AdminCard title="Header call-to-action">
        <div className="space-y-4">
          <FormGrid>
            <Field label="Button label">
              <Input name="ctaLabel" defaultValue={nav.headerCta.label} />
            </Field>
            <Field label="Button link">
              <Input name="ctaHref" defaultValue={nav.headerCta.href ?? "/find"} />
            </Field>
          </FormGrid>
          <ToggleField name="ctaEnabled" label="Show the gold CTA button in the header" checked={nav.headerCta.enabled} />
        </div>
      </AdminCard>

      <AdminCard title="List Property link">
        <FormGrid>
          <ToggleField name="listPropertyEnabled" label="Show the 'List Property' menu link" checked={nav.listProperty.enabled} />
          <Field label="Label">
            <Input name="listPropertyLabel" defaultValue={nav.listProperty.label} />
          </Field>
        </FormGrid>
      </AdminCard>

      <AdminCard title="WhatsApp button">
        <div className="space-y-4">
          <ToggleField name="waEnabled" label="Show the WhatsApp circular button in the header" checked={nav.whatsappButton.enabled} />
          <Field label="Default message">
            <Input name="waMessage" defaultValue={nav.whatsappButton.message} />
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
            Save navigation
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}