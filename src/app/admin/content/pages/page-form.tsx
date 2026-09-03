"use client";

import { useActionState } from "react";
import { FormGrid, JsonTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input } from "@/components/ui";
import type { CustomPage } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function PageForm({
  page,
  action,
  isNew,
}: {
  page: CustomPage;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <div>
      <input type="hidden" name="id" value={page.id} />
      <FormGrid>
        <Field label="Page title">
          <Input name="title" defaultValue={page.title} />
        </Field>
        <Field label="Slug (URL, e.g. about)">
          <Input name="slug" defaultValue={page.slug} placeholder="about" />
        </Field>
      </FormGrid>
      <div className="mt-3">
        <Field label="Sections (JSON block array)">
          <JsonTextarea name="sections" value={page.sections} rows={10} />
        </Field>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="submit" className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800">
          {isNew ? "Create page" : "Save page"}
        </button>
      </div>
      <div className="mt-2">
        <ActionFeedback state={state} />
      </div>
    </div>
  );
}