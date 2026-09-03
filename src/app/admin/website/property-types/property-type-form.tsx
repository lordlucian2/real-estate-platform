"use client";

import { useActionState } from "react";
import { AdminCard, FormGrid, ToggleField, JsonTextarea } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Select } from "@/components/ui";
import type { PropertyTypeConfig } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function PropertyTypeForm({
  type,
  action,
  isNew,
}: {
  type: PropertyTypeConfig;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });

  return (
    <div>
      <input type="hidden" name="id" value={type.id} />
      <FormGrid>
        <Field label="Label">
          <Input name="label" defaultValue={type.label} placeholder="Houses for Rent" />
        </Field>
        <Field label="Plural / display name">
          <Input name="plural" defaultValue={type.plural} placeholder="Houses for Rent" />
        </Field>
        <Field label="Anchor type">
          <Select name="type" defaultValue={type.type}>
            <option value="house">house</option>
            <option value="room">room</option>
            <option value="apartment">apartment</option>
            <option value="compound">compound</option>
            <option value="commercial">commercial</option>
            <option value="land">land</option>
            <option value="short-term">short-term</option>
          </Select>
        </Field>
        <Field label="Order (lower = earlier)">
          <Input name="order" type="number" defaultValue={type.order} />
        </Field>
      </FormGrid>
      <div className="mt-4">
        <Field label="Description">
          <Input name="description" defaultValue={type.description} />
        </Field>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Field label="Custom slug (optional)">
          <Input name="slug" defaultValue={type.slug} placeholder="/rent/houses" />
        </Field>
        <Field label="Icon (lucide name, optional)">
          <Input name="icon" defaultValue={type.icon} />
        </Field>
        <Field label="Image URL (optional)">
          <Input name="image" defaultValue={type.image} />
        </Field>
      </div>
      <div className="mt-4">
        <AdminCard title="Listing & visibility" className="border-transparent p-0">
          <div className="grid gap-3 sm:grid-cols-2">
            <ToggleField name="enabled" label="Show this type" checked={type.enabled} />
            <ToggleField name="featured" label="Featured in the homepage tile grid" checked={type.featured} />
          </div>
          <div className="mt-4">
            <Field label="Where this category appears (JSON array, e.g. [&quot;rent&quot;,&quot;buy&quot;])">
              <JsonTextarea name="listingTypes" value={(type.listingTypes ?? ["rent", "buy"]) as unknown} rows={3} />
            </Field>
          </div>
        </AdminCard>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
        >
          {isNew ? "Add type" : "Save type"}
        </button>
      </div>
      <div className="mt-2">
        <ActionFeedback state={state} />
      </div>
    </div>
  );
}