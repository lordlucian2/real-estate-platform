"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PropertyImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PropertyGallery({ images, title }: { images: PropertyImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const safe = images.length > 0 ? images : [{ url: "", alt: "Photo coming soon", order: 1 }];

  const prev = () => setActive((i) => (i - 1 + safe.length) % safe.length);
  const next = () => setActive((i) => (i + 1) % safe.length);

  return (
    <div className="overflow-hidden rounded-3xl border border-ink-900/5 bg-white shadow-lg">
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
        {safe[active].url ? (
          <Image
            src={safe[active].url}
            alt={safe[active].alt || title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 75vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-cream-200 text-ink-400">
            Photos coming soon
          </div>
        )}
        {safe.length > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy-900 shadow-md backdrop-blur transition-colors hover:bg-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy-900 shadow-md backdrop-blur transition-colors hover:bg-white"
            >
              <ChevronRight size={20} />
            </button>
          </>
        ) : null}
        <span className="absolute bottom-3 right-3 rounded-full bg-navy-950/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {active + 1} / {safe.length}
        </span>
      </div>

      {safe.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto p-3 no-scrollbar">
          {safe.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                i === active ? "border-gold-500" : "border-transparent opacity-60 hover:opacity-100",
              )}
            >
              {img.url ? (
                <Image src={img.url} alt={img.alt || ""} fill sizes="80px" className="object-cover" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}