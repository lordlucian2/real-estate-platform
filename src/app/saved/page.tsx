import type { Metadata } from "next";
import { getAllProperties } from "@/lib/store";
import { SavedList } from "@/components/property/saved-list";

export const metadata: Metadata = {
  title: "Saved Properties",
  description: "Your saved properties, ready when you are.",
  robots: { index: false },
};

export default async function SavedPage() {
  const properties = await getAllProperties();
  return (
    <>
      <section className="texture-dark py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gold-300">Your shortlist</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-cream-50 sm:text-4xl">
            Saved Properties
          </h1>
          <p className="mt-2 text-ink-500 text-cream-50/70">
            Tap the heart on any property to keep it here.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <SavedList properties={properties} />
      </section>
    </>
  );
}