"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { site, whatsappLink, agent } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { NavigationData, SiteSettings } from "@/lib/types";

const defaultNavLinks = [
  { id: "home", href: "/", label: "Home" },
  { id: "properties", href: "/properties", label: "Properties" },
  { id: "rent", href: "/rent", label: "Rent" },
  { id: "buy", href: "/buy", label: "Buy" },
  { id: "about", href: "/about", label: "About" },
  { id: "contact", href: "/contact", label: "Contact" },
];

export function BrandMark({
  dark = false,
  className,
  mark = "E",
  name = site.shortName,
  tagline = site.brandLine,
}: { dark?: boolean; className?: string; mark?: string; name?: string; tagline?: string }) {
  return (
    <Link href="/" className={cn("group flex items-center gap-3", className)}>
      <span className="flex size-10 items-center justify-center rounded-[0.7rem] bg-gold-500 font-display text-base font-bold text-navy-900 shadow-sm shadow-gold-500/40 transition-transform group-hover:scale-105">
        {mark}
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-lg font-bold tracking-tight", dark ? "text-cream-50" : "text-navy-900")}>
          {name}
        </span>
        <span className={cn("mt-0.5 block whitespace-nowrap text-[10px] font-semibold tracking-[0.16em] uppercase", dark ? "text-gold-300" : "text-ink-400")}>
          {tagline.split("in")[0].trim()}
        </span>
      </span>
    </Link>
  );
}

export interface SiteHeaderProps {
  navigation?: NavigationData;
  settings?: SiteSettings;
}

export function SiteHeader({ navigation, settings }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

const navItems = (navigation?.items ?? defaultNavLinks).filter((i) => "enabled" in i ? i.enabled : true);
  const listProperty = navigation?.listProperty?.enabled !== false;
  const listPropertyLabel = navigation?.listProperty?.label ?? "List Property";
  const headerCta = navigation?.headerCta ?? { label: "Find a Property", href: "/find", enabled: true };
  const waMessage =
    navigation?.whatsappButton?.message ?? `Hello ${agent.name}, I need help finding a property. Can you assist me?`;
  const waEnabled = settings?.whatsapp?.enabled !== false && navigation?.whatsappButton?.enabled !== false;
  const waLink = waEnabled
    ? settings
      ? (() => {
          const clean = settings.whatsapp.number.replace(/[^0-9]/g, "");
          return `https://wa.me/${clean}?text=${encodeURIComponent(waMessage)}`;
        })()
      : whatsappLink(waMessage)
    : null;

  const phone = settings?.topBar?.phone || settings?.general?.phone || site.phoneDisplay;
  const hours = settings?.topBar?.hours || site.hours;
  const showTopBar = settings?.topBar?.enabled !== false;
  const areaString = settings?.agent?.areasServed?.slice(0, 4).join(" · ") ?? agent.areasServed.slice(0, 4).join(" · ");

  return (
    <header className="sticky top-0 z-50 border-b border-ink-900/5 bg-cream-50/85 backdrop-blur-xl">
      {showTopBar ? (
        <div className="hidden bg-navy-950 text-cream-50/80 sm:block">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-xs sm:px-6 lg:px-8">
            <p className="flex items-center gap-1.5 text-cream-50/70">
              <Phone size={12} /> {phone} · {hours}
            </p>
            <p className="hidden md:block">Serving {areaString}</p>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6 lg:h-20 lg:px-8">
        <BrandMark
          className="shrink-0"
          mark={navigation?.logo?.mark ?? "E"}
          name={navigation?.logo?.name ?? site.shortName}
          tagline={navigation?.logo?.tagline ?? site.brandLine}
        />

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className="relative text-sm font-semibold text-ink-700 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold-500 after:transition-all after:duration-200 after:content-[''] hover:text-navy-900 hover:after:w-full"
            >
              {l.label}
            </Link>
          ))}
          {listProperty ? (
            <Link
              href="/list-property"
              className="relative text-sm font-semibold text-ink-700 transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-gold-500 after:transition-all after:duration-200 after:content-[''] hover:text-navy-900 hover:after:w-full"
            >
              {listPropertyLabel}
            </Link>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {waEnabled && waLink ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 items-center justify-center rounded-full border border-ink-900/10 text-whatsapp-dark transition-colors hover:border-whatsapp hover:bg-whatsapp hover:text-white"
              aria-label="Chat on WhatsApp"
            >
              <WhatsAppIcon size={18} />
            </a>
          ) : null}
          {headerCta?.enabled && headerCta.href ? (
            <Link href={headerCta.href} className={buttonClasses("gold", "md")}>
              {headerCta.label}
            </Link>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center rounded-xl border border-ink-900/10 text-navy-900 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav className="border-t border-ink-900/5 bg-cream-50 px-6 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {navItems.map((l) => (
              <Link
                key={l.id}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-ink-700 hover:bg-cream-200"
              >
                {l.label}
              </Link>
            ))}
            {listProperty ? (
              <Link
                href="/list-property"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-ink-700 hover:bg-cream-200"
              >
                {listPropertyLabel}
              </Link>
            ) : null}
            {headerCta?.enabled && headerCta.href ? (
              <Link href={headerCta.href} onClick={() => setOpen(false)} className={buttonClasses("gold", "lg", "mt-2 w-full")}>
                {headerCta.label}
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </header>
  );
}