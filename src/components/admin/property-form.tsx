"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Plus } from "lucide-react";
import { adminSaveProperty, type ActionResult } from "@/app/actions";
import { locations } from "@/lib/locations";
import { amenityLabels, propertyTypeOptions } from "@/lib/data";
import type { Property } from "@/lib/types";
import { Button, Field, Input, Select, Textarea, buttonClasses } from "@/components/ui";

const initialState: ActionResult = { ok: false, error: "" };
const allAmenities = Object.keys(amenityLabels).filter((a) => a !== "furnished");

export function PropertyForm({ existing }: { existing?: Property }) {
  const [state, formAction] = useActionState(
    async (prev: ActionResult, fd: FormData) => await adminSaveProperty(fd),
    initialState,
  );
  const [amenities, setAmenities] = useState<string[]>(existing?.amenities ?? []);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState<string[]>(existing?.images.map((i) => i.url) ?? []);

  function toggleAmenity(a: string) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function addImage() {
    const url = imageUrl.trim();
    if (!url) return;
    setImages((prev) => [...prev, url]);
    setImageUrl("");
  }

  if (state.ok) {
    return (
      <div className="animate-fade-up text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 size={30} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-semibold text-navy-900">
          {existing ? "Property Updated" : "Property Created"}
        </h2>
        <p className="mt-2 text-sm text-ink-500">{state.message}.</p>
        <div className="mt-6 flex justify-center">
          <Button href="/admin/properties" variant="navy">Back to Properties</Button>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-7">
      {existing ? <input type="hidden" name="id" value={existing.id} /> : null}

      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">Basics</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Title *" htmlFor="title">
            <Input id="title" name="title" required defaultValue={existing?.title} placeholder="e.g. 3 Bedroom House for Rent" />
          </Field>
          <Field label="Property type" htmlFor="type">
            <Select id="type" name="type" defaultValue={existing?.type ?? "house"}>
              {propertyTypeOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </Field>
          <Field label="Rent / Sale" htmlFor="listingType">
            <Select id="listingType" name="listingType" defaultValue={existing?.listingType ?? "rent"}>
              <option value="rent">For Rent</option>
              <option value="buy">For Sale</option>
              <option value="short-term">Short Stay</option>
            </Select>
          </Field>
          <Field label="Location" htmlFor="locationId">
            <Select id="locationId" name="locationId" defaultValue={existing?.locationId ?? "paynesville"}>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Address" htmlFor="address">
            <Input id="address" name="address" defaultValue={existing?.address} placeholder="Street, area, Liberia" />
          </Field>
          <Field label="Price (USD) *" htmlFor="price">
            <Input id="price" name="price" type="number" required min={0} defaultValue={existing?.price} placeholder="e.g. 650" />
          </Field>
          <Field label="Bedrooms" htmlFor="bedrooms">
            <Input id="bedrooms" name="bedrooms" type="number" min={0} defaultValue={existing?.bedrooms} />
          </Field>
          <Field label="Bathrooms" htmlFor="bathrooms">
            <Input id="bathrooms" name="bathrooms" type="number" min={0} defaultValue={existing?.bathrooms} />
          </Field>
          <Field label="Size (m²)" htmlFor="size">
            <Input id="size" name="size" type="number" min={0} defaultValue={existing?.size} placeholder="e.g. 140" />
          </Field>
          <Field label="Furnished?" htmlFor="furnished">
            <Select id="furnished" name="furnished" defaultValue={existing?.furnished ? "yes" : "no"}>
              <option value="no">Unfurnished</option>
              <option value="yes">Furnished</option>
            </Select>
          </Field>
        </div>
      </section>

      <section>
        <Field label="Description" htmlFor="description">
          <Textarea id="description" name="description" defaultValue={existing?.description} placeholder="What makes this property special?" />
        </Field>
      </section>

      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">Amenities</h3>
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

      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">Images</h3>
        <p className="mt-1 text-xs text-ink-400">
          Add image URLs (e.g. Unsplash or your Cloudinary CDN). The first becomes the cover.
        </p>
        <div className="mt-3 flex gap-2">
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…/photo.jpg" />
          <Button type="button" variant="outline" onClick={addImage}>
            <Plus size={15} /> Add
          </Button>
        </div>
        {images.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {images.map((u, i) => (
              <li key={i} className="flex items-center justify-between rounded-xl border border-ink-900/10 bg-cream-50 px-3 py-2 text-xs text-ink-500">
                <span className="max-w-[78%] truncate">{i === 0 ? "★ " : ""}{u}</span>
                <button type="button" onClick={() => setImages((prev) => prev.filter((x) => x !== u))} className="font-semibold text-danger">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {images.map((u) => (
          <input key={u} type="hidden" name="imageUrl" value={u} />
        ))}
      </section>

      <section>
        <h3 className="font-display text-lg font-semibold text-navy-900">Management</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Verification status">
            <Select name="verificationStatus" defaultValue={existing?.verificationStatus ?? "verified"}>
              <option value="verified">Verified</option>
              <option value="recently_checked">Recently Checked</option>
              <option value="owner_submitted">Owner Submitted</option>
              <option value="unavailable">Unavailable</option>
            </Select>
          </Field>
          <Field label="Status">
            <Select name="status" defaultValue={existing?.status ?? "available"}>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="rented">Rented</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Featured?">
            <Select name="featured" defaultValue={existing?.featured ? "yes" : "no"}>
              <option value="no">No</option>
              <option value="yes">Yes — show on homepage</option>
            </Select>
          </Field>
        </div>
      </section>

      <section>
        <Field label="Agent notes" hint="Visible on the public listing as 'Agent notes'.">
          <Textarea id="agentNotes" name="agentNotes" defaultValue={existing?.agentNotes} placeholder="e.g. inspected this week, landlord is flexible..." />
        </Field>
      </section>

      {state.ok === false && state.error ? (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">{state.error}</div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" className="sm:flex-1">
          {existing ? "Save Changes" : "Create Property"}
        </Button>
        <Link
          href="/admin/properties"
          className={buttonClasses("outline", "lg", "flex max-sm:h-13 max-sm:w-full items-center justify-center")}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}