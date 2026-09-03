"use client";

import { useActionState } from "react";
import { FormGrid } from "@/components/admin/admin-ui";
import { ActionFeedback } from "@/components/admin/admin-ui";
import { Field, Input, Textarea, Select } from "@/components/ui";
import type { Testimonial } from "@/lib/types";
import type { ActionResult } from "@/app/actions";

export function TestimonialForm({
  testimonial,
  action,
  isNew,
}: {
  testimonial: Testimonial;
  action: (prev: ActionResult, fd: FormData) => Promise<ActionResult>;
  isNew?: boolean;
}) {
  const [state, formAction] = useActionState(action, { ok: false, error: "" });
  const t = testimonial;

  return (
    <div>
      <input type="hidden" name="id" value={t.id} />
      <div className="space-y-3">
        <Field label="Quote">
          <Textarea name="quote" rows={3} defaultValue={t.quote} />
        </Field>
        <FormGrid>
          <Field label="Client name">
            <Input name="name" defaultValue={t.name} />
          </Field>
          <Field label="Role / occupation">
            <Input name="role" defaultValue={t.role} />
          </Field>
          <Field label="Property type">
            <Select name="propertyType" defaultValue={t.propertyType}>
              <option value="Rental">Rental</option>
              <option value="Sale">Sale</option>
              <option value="Room">Room</option>
              <option value="Commercial">Commercial</option>
              <option value="Land">Land</option>
              <option value="Apartment">Apartment</option>
            </Select>
          </Field>
          <Field label="Location">
            <Input name="location" defaultValue={t.location} />
          </Field>
          <Field label="Rating (1–5)">
            <Input name="rating" type="number" min={1} max={5} defaultValue={t.rating} />
          </Field>
          <Field label="Date">
            <Input name="date" type="date" defaultValue={t.date} />
          </Field>
        </FormGrid>
      </div>
      <div className="mt-4 flex justify-end">
        <button type="submit" className="rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50 hover:bg-navy-800">
          {isNew ? "Add testimonial" : "Save testimonial"}
        </button>
      </div>
      <div className="mt-2">
        <ActionFeedback state={state} />
      </div>
    </div>
  );
}