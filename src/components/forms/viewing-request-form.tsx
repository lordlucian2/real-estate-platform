"use client";

import { useActionState } from "react";
import Link from "next/link";
import { CalendarCheck2, MessageCircleMore } from "lucide-react";
import { submitViewingRequest, type ActionResult } from "@/app/actions";
import { Button, Field, Input, Textarea } from "@/components/ui";

const initialState: ActionResult = { ok: false, error: "" };

export function ViewingRequestForm({ propertyId }: { propertyId: string }) {
  const [state, formAction] = useActionState(submitViewingRequest, initialState);

  if (state.ok) {
    return (
      <div className="animate-fade-up text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CalendarCheck2 size={30} />
        </span>
        <h2 className="mt-5 font-display text-3xl font-semibold text-navy-900">Viewing Request Sent</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">
          Thanks! I&apos;ll confirm the viewing with you directly — usually the
          same day.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link
            href="/properties"
            className="inline-flex h-11 items-center justify-center rounded-full bg-navy-900 px-6 text-sm font-semibold text-cream-50 hover:bg-navy-800"
          >
            Browse more properties
          </Link>
          <Link
            href="/find"
            className="inline-flex h-11 items-center justify-center rounded-full border border-ink-900/15 px-6 text-sm font-semibold text-navy-900 hover:border-gold-500"
          >
            Tell me what you need
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="propertyId" value={propertyId} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preferred date" htmlFor="preferredDate">
          <Input id="preferredDate" name="preferredDate" type="date" />
        </Field>
        <Field label="Preferred time" htmlFor="preferredTime">
          <SelectTime />
        </Field>
      </div>

      <Field label="Your name *" htmlFor="name">
        <Input id="name" name="name" required placeholder="e.g. James K." />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="WhatsApp number" htmlFor="whatsapp">
          <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+231 ..." />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" placeholder="+231 ..." />
        </Field>
      </div>

      <Field label="Email (optional)" htmlFor="email">
        <Input id="email" name="email" type="email" placeholder="you@example.com" />
      </Field>

      <Field label="Notes" hint="Anything I should know before arranging the viewing?">
        <Textarea name="notes" placeholder="e.g. I can only view on weekend mornings..." />
      </Field>

      {state.ok === false && state.error ? (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          {state.error}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full">
        <MessageCircleMore size={18} /> Request Viewing
      </Button>
    </form>
  );
}

function SelectTime() {
  return (
    <select id="preferredTime" name="preferredTime" defaultValue="" className="w-full rounded-xl border border-ink-900/10 bg-white px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20">
      <option value="">Any time</option>
      <option>Morning (9 – 12)</option>
      <option>Midday (12 – 2)</option>
      <option>Afternoon (2 – 5)</option>
      <option>Evening (5 – 7)</option>
    </select>
  );
}