"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, FormGrid, ToggleField } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function WhatsappForm({
  settings,
  action,
}: {
  settings: SiteSettings;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const w = settings.whatsapp;
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="WhatsApp">
        <div className="space-y-4">
          <ToggleField name="enabled" label="Enable WhatsApp buttons & links" checked={w.enabled} />
          <Field label="WhatsApp number (country code + digits, no symbols)">
            <Input name="number" defaultValue={w.number} placeholder="231770000000" />
          </Field>
        </div>
      </AdminCard>

      <AdminCard
        title="Message templates"
        description="Available placeholders: {agentName}, {propertyTitle}, {propertyType}, {location}, {budget}."
      >
        <div className="space-y-4">
          <Field label="Property inquiry">
            <Input name="tplPropertyInquiry" defaultValue={w.templates.propertyInquiry} />
          </Field>
          <Field label="Viewing request">
            <Input name="tplViewing" defaultValue={w.templates.viewing} />
          </Field>
          <Field label="Property request (find me)">
            <Input name="tplPropertyRequest" defaultValue={w.templates.propertyRequest} />
          </Field>
          <Field label="Generic / chat">
            <Input name="tplGeneric" defaultValue={w.templates.generic} />
          </Field>
          <Field label="Owner / list property">
            <Input name="tplOwner" defaultValue={w.templates.owner} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Social profiles">
        <FormGrid>
          <Field label="Facebook URL">
            <Input name="facebook" defaultValue={settings.social.facebook} />
          </Field>
          <Field label="Instagram URL">
            <Input name="instagram" defaultValue={settings.social.instagram} />
          </Field>
          <Field label="TikTok URL">
            <Input name="tiktok" defaultValue={settings.social.tiktok} />
          </Field>
          <Field label="YouTube URL">
            <Input name="youtube" defaultValue={settings.social.youtube} />
          </Field>
          <Field label="LinkedIn URL">
            <Input name="linkedin" defaultValue={settings.social.linkedin} />
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
            Save
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}