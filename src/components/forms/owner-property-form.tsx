"use client";

import { useActionState, useState } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { submitOwnerProperty, type ActionResult } from "@/app/actions";
import { locations } from "@/lib/locations";
import { amenityLabels, propertyTypeOptions } from "@/lib/data";
import { Button, Field, Input, Select, Textarea } from "@/components/ui";

const initialState: ActionResult = { ok: false, error: "" };

const allAmenities = Object.keys(amenityLabels).filter((a) => a !== "furnished");

export function OwnerPropertyForm() {
  const [state, formAction] = useActionState(submitOwnerProperty, initialState);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  function toggleAmenity(a: string) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function addPhoto() {
    const url = photoUrl.trim();
    if (!url) return;
    setPhotoUrls((prev) => [...prev, url]);
    setPhotoUrl("");
  }

  if (state.ok) {
    return (
      <div className="animate-fade-up text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={32} />
        </span>
        <h2 className="mt-5 font-display text-3xl font-semibold text-navy-900">Property Submitted</h2>
        <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink-500">
          Your property has been submitted successfully. Our team will review
          the information and contact you.
        </p>
        <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-warning/20 bg-warning/5 p-5 text-left text-sm">
          <p className="flex items-start gap-2 font-semibold text-warning">
            <ShieldAlert size={17} className="mt-0.5 shrink-0" />
            Pending Verification
          </p>
          <p className="mt-2 text-ink-600">
            Owner submissions are never published automatically. I&apos;ll
            confirm the details and availability with you first — then your
            property goes live as &quot;Owner Submitted&quot;.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* Owner */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">About you</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Owner name *" htmlFor="ownerName">
            <Input id="ownerName" name="ownerName" required placeholder="Your full name" />
          </Field>
          <Field label="Phone *" htmlFor="phone">
            <Input id="phone" name="phone" type="tel" required placeholder="+231 ..." />
          </Field>
          <Field label="WhatsApp" htmlFor="whatsapp">
            <Input id="whatsapp" name="whatsapp" type="tel" placeholder="+231 ..." />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" placeholder="you@example.com" />
          </Field>
        </div>
      </section>

      {/* Property basics */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">Your property</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Property type" htmlFor="propertyType">
            <Select id="propertyType" name="propertyType" defaultValue="house">
              {propertyTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="For rent or sale?" htmlFor="listingType">
            <Select id="listingType" name="listingType" defaultValue="rent">
              <option value="rent">For Rent</option>
              <option value="buy">For Sale</option>
              <option value="short-term">Short-Term Stay</option>
            </Select>
          </Field>
          <Field label="Location" htmlFor="locationId">
            <Select id="locationId" name="locationId" defaultValue="paynesville">
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Price (USD)" htmlFor="price">
            <Input id="price" name="price" type="number" min={0} placeholder="e.g. 600" />
          </Field>
          <Field label="Bedrooms" htmlFor="bedrooms">
            <Input id="bedrooms" name="bedrooms" type="number" min={0} placeholder="0 if not applicable" />
          </Field>
          <Field label="Bathrooms" htmlFor="bathrooms">
            <Input id="bathrooms" name="bathrooms" type="number" min={0} placeholder="0 if not applicable" />
          </Field>
          <Field label="Availability" htmlFor="availability">
            <Select id="availability" name="availability" defaultValue="Immediately">
              <option>Immediately</option>
              <option>Within 1 month</option>
              <option>From a specific date</option>
              <option>Flexible</option>
            </Select>
          </Field>
        </div>
        <div className="mt-3">
          <Field label="Property description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              placeholder="Bedrooms, bathrooms, size, compound, water supply, condition, what makes it special..."
            />
          </Field>
        </div>
      </section>

      {/* Amenities */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">
          Amenities <span className="text-sm font-normal text-ink-400">(select any)</span>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {allAmenities.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={
                amenities.includes(a)
                  ? "rounded-full border border-gold-500 bg-gold-500 px-3.5 py-2 text-sm font-semibold text-navy-900"
                  : "rounded-full border border-ink-900/10 bg-white px-3.5 py-2 text-sm font-medium text-ink-700 hover:border-gold-400"
              }
            >
              {amenityLabels[a]}
            </button>
          ))}
        </div>
        {allAmenities.map((a) => (
          <input key={a} type="hidden" name="amenities" value={a} disabled={!amenities.includes(a)} />
        ))}
      </section>

      {/* Photos */}
      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">
          Property photos <span className="text-sm font-normal text-ink-400">(optional, add image links)</span>
        </h3>
        <div className="mt-3 flex gap-2">
          <Input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://…/photo.jpg"
          />
          <Button type="button" variant="outline" onClick={addPhoto}>
            Add
          </Button>
        </div>
        {photoUrls.length > 0 ? (
          <ul className="mt-3 space-y-1.5">
            {photoUrls.map((u, i) => (
              <li key={i} className="flex items-center justify-between rounded-xl border border-ink-900/10 bg-cream-50 px-3 py-2 text-xs text-ink-500">
                <span className="max-w-[80%] truncate">{u}</span>
                <button
                  type="button"
                  onClick={() => setPhotoUrls((prev) => prev.filter((x) => x !== u))}
                  className="font-semibold text-danger"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {photoUrls.map((u) => (
          <input key={u} type="hidden" name="photoUrls" value={u} />
        ))}
      </section>

      {/* Notes */}
      <section>
        <Field label="Additional notes" hint="Anything that helps us market it better?">
          <Textarea
            name="notes"
            placeholder="e.g. two minutes from the main road, generator available, prefer long-term tenant..."
          />
        </Field>
      </section>

      {state.ok === false && state.error ? (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{state.error}</div>
      ) : null}

      <Button type="submit" size="lg" className="w-full">
        Submit Property
      </Button>
      <p className="text-center text-xs text-ink-400">
        By submitting, you agree to a verification call. We never publish
        unverified owner listings.
      </p>
    </form>
  );
}