"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Property } from "@/lib/types";
import { useSaved } from "@/components/property/favorite-button";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui";

export function SavedList({ properties }: { properties: Property[] }) {
  const saved = useSaved();

  const items = properties.filter((p) => saved.includes(p.slug));
  const missing = saved.filter((slug) => !properties.some((p) => p.slug === slug));

  if (items.length === 0 && missing.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-ink-900/15 bg-white p-12 text-center">
        <Heart size={32} className="mx-auto text-ink-400" />
        <p className="mt-4 font-display text-2xl font-semibold text-navy-900">
          Nothing saved yet
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
          Tap the heart on any property to keep it here for later.
        </p>
        <Button href="/properties" size="lg" className="mt-6">
          Browse Properties
        </Button>
      </div>
    );
  }

  return (
    <>
      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : null}
      {missing.length > 0 ? (
        <div className="mt-8 rounded-2xl border border-warning/20 bg-warning/5 p-5 text-sm text-ink-600">
          {missing.length} saved item{missing.length > 1 ? "s" : ""} recently left
          the marketplace.{" "}
          <Link href="/find" className="font-semibold text-gold-700 hover:underline">
            Tell me what you need
          </Link>{" "}
          and I&apos;ll find you similar options.
        </div>
      ) : null}
    </>
  );
}