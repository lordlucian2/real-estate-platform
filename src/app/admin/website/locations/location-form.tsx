"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FormGrid, ToggleField } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input } from "@/components/ui";
import type { LocationConfig } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function LocationForm({
  location,
  action,
}: {
  location: LocationConfig;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <div>
      <input type="hidden" name="id" value={location.id} />
      <div className="space-y-3">
        <Field label="Name">
          <Input name="name" defaultValue={location.name} />
        </Field>
        <Field label="Slug">
          <Input name="slug" defaultValue={location.slug} />
        </Field>
        <Field label="Intro / short description">
          <Input name="intro" defaultValue={location.intro} />
        </Field>
        <Field label="Image URL (optional)">
          <Input name="image" defaultValue={location.image} />
        </Field>
        <Field label="SEO title (optional)">
          <Input name="seoTitle" defaultValue={location.seoTitle} />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleField name="active" label="Shown on site" checked={location.active} />
          <ToggleField name="featured" label="Featured" checked={location.featured} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="submit" className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800">
          Save location
        </button>
      </div>
      <div className="mt-2">
        <ActionFeedback state={state} />
      </div>
    </div>
  );
}