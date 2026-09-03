"use client";

import { useSyncExternalStore } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export const SAVED_KEY = "eric:saved-properties";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(SAVED_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

let cache: string[] | null = null;

const EMPTY_LIST: string[] = [];

function getSnapshot(): string[] {
  if (cache === null) cache = readSaved();
  return cache;
}

function getServerSnapshot(): string[] {
  return EMPTY_LIST;
}

function subscribe(cb: () => void): () => void {
  const sync = () => {
    cache = null;
    cb();
  };
  window.addEventListener("storage", sync);
  window.addEventListener("saved-updated", sync);
  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener("saved-updated", sync);
  };
}

export function useSaved(): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function toggleSaved(slug: string): string[] {
  const list = cache === null ? readSaved() : cache;
  const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug];
  window.localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  cache = next;
  window.dispatchEvent(new Event("saved-updated"));
  return next;
}

export function FavoriteButton({ slug, className }: { slug: string; className?: string }) {
  const saved = useSaved().includes(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        toggleSaved(slug);
      }}
      aria-label={saved ? "Remove from saved" : "Save property"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full shadow-md backdrop-blur transition-all",
        saved ? "bg-gold-500 text-white" : "bg-white/85 text-navy-900 hover:bg-white",
        className,
      )}
    >
      <Heart size={16} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}