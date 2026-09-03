"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, FormGrid } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Select } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function AppearanceForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const a = settings.appearance;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="Style">
        <FormGrid>
          <Field label="Corner radius">
            <Select name="radius" defaultValue={a.radius}>
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </Select>
          </Field>
          <Field label="Button style">
            <Select name="buttonStyle" defaultValue={a.buttonStyle}>
              <option value="pill">Pill</option>
              <option value="soft">Soft</option>
              <option value="sharp">Sharp</option>
            </Select>
          </Field>
          <Field label="Heading font">
            <Input name="headingFont" defaultValue={a.headingFont} />
          </Field>
          <Field label="Body font">
            <Input name="bodyFont" defaultValue={a.bodyFont} />
          </Field>
          <Field label="Spacing">
            <Select name="spacing" defaultValue={a.spacing}>
              <option value="compact">Compact</option>
              <option value="comfortable">Comfortable</option>
              <option value="large">Large</option>
            </Select>
          </Field>
        </FormGrid>
      </AdminCard>

      <AdminCard title="Colours (hex)">
        <FormGrid>
          <Field label="Primary">
            <Input name="colorPrimary" defaultValue={a.colors.primary} />
          </Field>
          <Field label="Secondary">
            <Input name="colorSecondary" defaultValue={a.colors.secondary} />
          </Field>
          <Field label="Accent">
            <Input name="colorAccent" defaultValue={a.colors.accent} />
          </Field>
          <Field label="Background">
            <Input name="colorBackground" defaultValue={a.colors.background} />
          </Field>
          <Field label="Text">
            <Input name="colorText" defaultValue={a.colors.text} />
          </Field>
        </FormGrid>
      </AdminCard>

      <div className="sticky bottom-0 z-10 -mx-4 -mb-5 border-t border-ink-900/5 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/dashboard" className="text-sm font-semibold text-ink-500 hover:text-navy-900">
            ← Back
          </Link>
          <button
            type="submit"
            className="ml-auto rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Save appearance
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}