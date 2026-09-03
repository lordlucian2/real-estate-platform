"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { submitPropertyRequest, type ActionResult } from "@/app/actions";
import { locations } from "@/lib/locations";
import { amenityLabels } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";

const needOptions = [
  { value: "room", label: "Room" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "compound", label: "Compound for Family" },
  { value: "commercial", label: "Commercial Property" },
  { value: "office", label: "Office Space" },
  { value: "land", label: "Land" },
  { value: "property_to_buy", label: "Property to Buy" },
  { value: "short-term", label: "Short-Term Stay" },
];

const purposeOptions = [
  { value: "personal", label: "Personal" },
  { value: "family", label: "Family" },
  { value: "business", label: "Business" },
  { value: "investment", label: "Investment" },
];

const requirementOptions = [
  "parking",
  "generator",
  "water_supply",
  "security",
  "compound",
  "tiled_floor",
  "air_conditioning",
  "internet",
  "separate_kitchen",
  "servant_quarters",
];

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
        selected
          ? "border-gold-500 bg-gold-500 text-navy-900 font-semibold shadow-sm"
          : "border-ink-900/10 bg-white text-ink-700 hover:border-gold-400",
      )}
    >
      {children}
    </button>
  );
}

function SuccessPanel({ id }: { id: string }) {
  return (
    <div className="animate-fade-up mx-auto max-w-xl rounded-3xl border border-success/20 bg-white p-8 text-center shadow-2xl sm:p-12">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <PartyPopper size={30} />
      </span>
      <h2 className="mt-5 font-display text-3xl font-semibold text-navy-900">Request Received</h2>
      <p className="mt-3 leading-relaxed text-ink-500">
        Your property search has been added to our request queue. We&apos;ll
        contact you when suitable options are available.
      </p>
      <div className="mx-auto mt-6 max-w-sm space-y-2 rounded-2xl bg-cream-100 p-5 text-left text-sm text-ink-700">
        <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> I&apos;ve saved your requirements</p>
        <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> I&apos;ll search my listings and my network</p>
        <p className="flex items-center gap-2"><CheckCircle2 size={16} className="text-success" /> I&apos;ll reach out on matching options</p>
      </div>
      <p className="mt-4 text-xs text-ink-400">Reference: <span className="font-mono">{id}</span></p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <Link href="/properties" className={cn("inline-flex h-11 items-center justify-center rounded-full bg-navy-900 px-6 text-sm font-semibold text-cream-50 hover:bg-navy-800")}>
          Browse Available Properties
        </Link>
        <a
          href={whatsappLink(`Hello, I just submitted my property request (${id}). Please let me know when you have options for me.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-full border border-ink-900/15 px-6 text-sm font-semibold text-navy-900 hover:border-gold-500"
        >
          Notify me via WhatsApp
        </a>
      </div>
    </div>
  );
}

const initialState: ActionResult = { ok: false, error: "" };

export function PropertyRequestForm() {
  const searchParams = useSearchParams();
  const [state, formAction] = useActionState(submitPropertyRequest, initialState);

  const presetNeed = searchParams.get("need") ?? "house";
  const presetLocation = searchParams.get("location") ?? "";
  const presetBudget = searchParams.get("budget") ?? "";
  const presetBedrooms = searchParams.get("bedrooms") ?? "";

  const [need, setNeed] = useState<string>(
    needOptions.some((o) => o.value === presetNeed) ? presetNeed : "house",
  );
  const [purpose, setPurpose] = useState("personal");
  const [locationsSel, setLocationsSel] = useState<string[]>(presetLocation ? [presetLocation] : []);
  const [budgetMin, setBudgetMin] = useState(presetBudget ? "" : "");
  const [budgetMax, setBudgetMax] = useState(presetBudget || "");
  const [bedrooms, setBedrooms] = useState(presetBedrooms);
  const [bathrooms, setBathrooms] = useState("");
  const [furnished, setFurnished] = useState("either");
  const [requirements, setRequirements] = useState<string[]>([]);

  function toggleLoc(loc: string) {
    setLocationsSel((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  }

  function toggleReq(req: string) {
    setRequirements((prev) =>
      prev.includes(req) ? prev.filter((r) => r !== req) : [...prev, req],
    );
  }

  if (state.ok) {
    return <SuccessPanel id={state.id} />;
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="need" value={need} />
      <input type="hidden" name="purpose" value={purpose} />

      {/* I need */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">I need</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {needOptions.map((o) => (
            <Chip
              key={o.value}
              selected={need === o.value}
              onClick={() => setNeed(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* Purpose */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">Purpose</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {purposeOptions.map((o) => (
            <Chip
              key={o.value}
              selected={purpose === o.value}
              onClick={() => setPurpose(o.value)}
            >
              {o.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* Locations */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">
          Preferred location{" "}
          <span className="text-sm font-normal text-ink-400">(choose any number)</span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {locations.map((l) => (
            <Chip
              key={l.id}
              selected={locationsSel.includes(l.id)}
              onClick={() => toggleLoc(l.id)}
            >
              {l.name}
            </Chip>
          ))}
        </div>
        {locations.map((l) => (
          <input key={l.id} type="hidden" name="location" value={l.id} disabled={!locationsSel.includes(l.id)} />
        ))}
      </section>

      {/* Budget */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">Budget</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Minimum (USD)" htmlFor="budgetMin">
            <Input
              id="budgetMin"
              name="budgetMin"
              type="number"
              min={0}
              placeholder="e.g. 300"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
            />
          </Field>
          <Field label="Maximum (USD)" htmlFor="budgetMax">
            <Input
              id="budgetMax"
              name="budgetMax"
              type="number"
              min={0}
              placeholder="e.g. 700"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
            />
          </Field>
        </div>
      </section>

      {/* Bedrooms / bathrooms / furnished */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">The essentials</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Field label="Bedrooms" htmlFor="bedrooms">
            <Select id="bedrooms" name="bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5+</option>
            </Select>
          </Field>
          <Field label="Bathrooms" htmlFor="bathrooms">
            <Select id="bathrooms" name="bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}>
              <option value="">Any</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4+</option>
            </Select>
          </Field>
          <Field label="Furnished?" htmlFor="furnished">
            <Select id="furnished" name="furnished" value={furnished} onChange={(e) => setFurnished(e.target.value)}>
              <option value="either">Either</option>
              <option value="yes">Furnished</option>
              <option value="no">Unfurnished</option>
            </Select>
          </Field>
          <Field label="Move-in timeline" htmlFor="timeline">
            <Select id="timeline" name="timeline" defaultValue="soon">
              <option value="asap">Right away</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="quarter">Next 1–3 months</option>
              <option value="flexible">Flexible</option>
            </Select>
          </Field>
        </div>
      </section>

      {/* Requirements */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">
          Special requirements{" "}
          <span className="text-sm font-normal text-ink-400">(optional)</span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {requirementOptions.map((req) => (
            <Chip key={req} selected={requirements.includes(req)} onClick={() => toggleReq(req)}>
              {amenityLabels[req] ?? req}
            </Chip>
          ))}
        </div>
        {requirementOptions.map((r) => (
          <input key={r} type="hidden" name="requirements" value={r} disabled={!requirements.includes(r)} />
        ))}
      </section>

      {/* Contact */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">Contact details</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Your name *" htmlFor="name">
            <Input id="name" name="name" required placeholder="e.g. James K." />
          </Field>
          <Field label="WhatsApp number" htmlFor="whatsapp">
            <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+231 ..." />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" type="tel" placeholder="+231 ..." />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" placeholder="you@example.com" />
          </Field>
        </div>
      </section>

      {/* Other requirements */}
      <section>
        <Field label="Other requirements" hint="Anything else I should know?">
          <Textarea name="otherRequirements" placeholder="e.g. must have a compound suitable for my family, close to a school..." />
        </Field>
      </section>

      {state.ok === false && state.error ? (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          {state.error}
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full">
        Submit My Request
      </Button>
      <p className="text-center text-xs text-ink-400">
        By submitting, you agree to be contacted about suitable properties.
        No spam — just options that match.
      </p>
    </form>
  );
}