"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContactMessage, type ActionResult } from "@/app/actions";
import { Button, Field, Input, Textarea } from "@/components/ui";

const initialState: ActionResult = { ok: false, error: "" };

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactMessage, initialState);

  if (state.ok) {
    return (
      <div className="animate-fade-up text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">Message Received</h2>
        <p className="mt-2 text-sm text-ink-500">
          Thanks for reaching out — I&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name">
          <Input id="name" name="name" placeholder="Your name" />
        </Field>
        <Field label="WhatsApp number" htmlFor="whatsapp">
          <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+231 ..." />
        </Field>
      </div>
      <Field label="Email (optional)" htmlFor="email">
        <Input id="email" name="email" type="email" placeholder="you@example.com" />
      </Field>
      <Field label="Message *" htmlFor="message">
        <Textarea id="message" name="message" required placeholder="How can I help? Finding a home, listing a property, a general question..." />
      </Field>
      {state.ok === false && state.error ? (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{state.error}</div>
      ) : null}
      <Button type="submit" size="lg" className="w-full">Send Message</Button>
    </form>
  );
}