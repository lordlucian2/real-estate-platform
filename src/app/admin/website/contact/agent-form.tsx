"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AdminCard, FormGrid, ListTextarea, JsonTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Textarea } from "@/components/ui";
import type { SiteSettings } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function AgentForm({
  agent,
  action,
}: {
  agent: SiteSettings["agent"];
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard title="Identity">
        <FormGrid>
          <Field label="Full name">
            <Input name="name" defaultValue={agent.name} />
          </Field>
          <Field label="Tagline">
            <Input name="tagline" defaultValue={agent.tagline} />
          </Field>
          <Field label="Photo URL">
            <Input name="photo" defaultValue={agent.photo} placeholder="/api/media/..." />
          </Field>
          <Field label="Experience (years)">
            <Input name="experienceYears" type="number" defaultValue={agent.experienceYears} />
          </Field>
        </FormGrid>
      </AdminCard>

      <AdminCard title="Contact">
        <FormGrid>
          <Field label="Phone (display)">
            <Input name="phone" defaultValue={agent.phone} />
          </Field>
          <Field label="WhatsApp number">
            <Input name="whatsapp" defaultValue={agent.whatsapp} placeholder="231770000000" />
          </Field>
          <Field label="Email">
            <Input name="email" defaultValue={agent.email} type="email" />
          </Field>
        </FormGrid>
      </AdminCard>

      <AdminCard title="Credential & bio">
        <div className="space-y-4">
          <Field label="Credential line">
            <Input name="credential" defaultValue={agent.credential} />
          </Field>
          <Field label="Bio (used across the site)">
            <Textarea name="bio" defaultValue={agent.bio} rows={4} />
          </Field>
          <Field label="Philosophy (quote)">
            <Textarea name="philosophy" defaultValue={agent.philosophy} rows={3} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Areas served">
        <Field label="Areas (one per line)">
          <ListTextarea name="areasServed" value={agent.areasServed} rows={6} />
        </Field>
      </AdminCard>

      <AdminCard
        title="Services (JSON)"
        description='List of { title, description }. Shown in the Services / What I Help With content.'
      >
        <JsonTextarea name="services" value={agent.services} rows={10} />
      </AdminCard>

      <div className="sticky bottom-0 z-10 -mx-4 -mb-5 border-t border-ink-900/5 bg-white/95 px-4 py-4 backdrop-blur sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/admin/website/homepage" className="text-sm font-semibold text-ink-500 hover:text-navy-900">
            ← Back
          </Link>
          <button
            type="submit"
            className="ml-auto rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Save profile
          </button>
        </div>
        <div className="mt-2">
          <ActionFeedback state={state} />
        </div>
      </div>
    </form>
  );
}