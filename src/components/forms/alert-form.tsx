"use client";

import { useActionState, useState } from "react";
import { BellRing, CheckCircle2 } from "lucide-react";
import { subscribePropertyAlert, type ActionResult } from "@/app/actions";
import { locations } from "@/lib/locations";
import { propertyTypeOptions } from "@/lib/data";
import { Button, Field, Input, Select } from "@/components/ui";

const initialState: ActionResult = { ok: false, error: "" };

export function AlertForm() {
  const [state, formAction] = useActionState(subscribePropertyAlert, initialState);
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [selLocations, setSelLocations] = useState<string[]>([]);

  function toggle(l: string) {
    setSelLocations((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));
  }

  if (state.ok) {
    return (
      <div className="animate-fade-up text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">Alert Set Up</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
          When matching properties are added, I&apos;ll reach out on{" "}
          <strong className="text-navy-900">{channel === "whatsapp" ? "WhatsApp" : "email"}</strong>.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-cream-100 px-4 py-2 text-xs text-ink-500">
          <BellRing size={13} className="text-gold-600" /> No spam — only relevant matches
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="channel" value={channel} />

      <Field label="Get alerts by">
        <div className="flex gap-1 rounded-full border border-ink-900/10 bg-cream-100 p-1 w-fit">
          {(
            [
              { value: "whatsapp", label: "WhatsApp" },
              { value: "email", label: "Email" },
            ] as const
          ).map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setChannel(o.value)}
              className={
                channel === o.value
                  ? "rounded-full bg-navy-900 px-5 py-2 text-sm font-semibold text-cream-50"
                  : "rounded-full px-5 py-2 text-sm font-medium text-ink-500"
              }
            >
              {o.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label={channel === "whatsapp" ? "WhatsApp number *" : "Email address *"} htmlFor="contact">
        <Input
          id="contact"
          name="contact"
          type={channel === "whatsapp" ? "tel" : "email"}
          required
          placeholder={channel === "whatsapp" ? "+231 ..." : "you@example.com"}
        />
      </Field>

      <Field label="Locations (choose any)">
        <div className="flex flex-wrap gap-2">
          {locations.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => toggle(l.id)}
              className={
                selLocations.includes(l.id)
                  ? "rounded-full border border-gold-500 bg-gold-500 px-3.5 py-2 text-sm font-semibold text-navy-900"
                  : "rounded-full border border-ink-900/10 bg-white px-3.5 py-2 text-sm font-medium text-ink-700 hover:border-gold-400"
              }
            >
              {l.name}
            </button>
          ))}
        </div>
      </Field>
      {locations.map((l) => (
        <input key={l.id} type="hidden" name="location" value={l.id} disabled={!selLocations.includes(l.id)} />
      ))}

      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Property type" htmlFor="propertyType">
          <Select id="propertyType" name="propertyType" defaultValue="">
            <option value="">Any</option>
            {propertyTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </Field>
        <Field label="Max budget (USD)" htmlFor="budgetMax">
          <Input id="budgetMax" name="budgetMax" type="number" min={0} placeholder="e.g. 700" />
        </Field>
        <Field label="Bedrooms" htmlFor="bedrooms">
          <Select id="bedrooms" name="bedrooms" defaultValue="">
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4+</option>
          </Select>
        </Field>
      </div>

      <Field label="Your name (optional)" htmlFor="name">
        <Input id="name" name="name" placeholder="e.g. James" />
      </Field>

      {state.ok === false && state.error ? (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{state.error}</div>
      ) : null}

      <Button type="submit" size="lg" className="w-full">
        <BellRing size={18} /> Notify Me
      </Button>
    </form>
  );
}