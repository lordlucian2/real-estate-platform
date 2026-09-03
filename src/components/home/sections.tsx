import Link from "next/link";
import {
  Armchair,
  Building2,
  CheckCircle2,
  ClipboardList,
  Handshake,
  Home,
  KeyRound,
  Landmark,
  ListChecks,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TreePine,
  Users2,
} from "lucide-react";
import { whatsappLink, agent } from "@/lib/site";
import { getAllProperties, getTestimonials } from "@/lib/store";
import { PropertyCard } from "@/components/property/property-card";
import { WhatsAppIcon } from "@/components/icons";
import { SectionHeading, Button } from "@/components/ui";
import { relativeTime } from "@/lib/utils";
import type { HomeSectionCfg } from "@/lib/types";

export interface SectionProps {
  cfg?: HomeSectionCfg;
}

export async function FeaturedProperties({ cfg }: SectionProps) {
  const featured = (await getAllProperties()).filter((p) => p.featured && p.availabilityStatus === "available").slice(0, 4);
  const data = (cfg?.data ?? {}) as { limit?: number };
  const display = featured.slice(0, data.limit ?? 4);
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          eyebrow={cfg?.eyebrow ?? "Hand-picked"}
          title={cfg?.title ?? "Featured Properties"}
          subtitle={cfg?.subtitle ?? "A few of the options currently available — every one personally confirmed before it goes live."}
        />
        <Link
          href={cfg?.ctaHref ?? "/properties"}
          className="rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:border-gold-500 hover:text-gold-700"
        >
          {cfg?.ctaText ?? "View all properties"} →
        </Link>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {display.map((p, i) => (
          <PropertyCard key={p.id} property={p} priority={i < 2} />
        ))}
      </div>
    </section>
  );
}

export async function RecentlyVerified({ cfg }: SectionProps) {
  const recent = (await getAllProperties())
    .filter((p) => p.availabilityStatus === "available")
    .sort((a, b) => (a.lastVerifiedAt < b.lastVerifiedAt ? 1 : -1))
    .slice(0, 4);

  return (
    <section className="texture-dark py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            tone="dark"
            eyebrow={cfg?.eyebrow ?? "Fresh & confirmed"}
            title={cfg?.title ?? "Recently Verified"}
            subtitle={cfg?.subtitle ?? "These listings were checked most recently. In a market where listings go stale fast, that recency is the point."}
          />
          <p className="text-sm text-cream-50/50">
            Best showing:{" "}
            <span className="font-semibold text-gold-300">{recent[0] ? relativeTime(recent[0].lastVerifiedAt) : "—"}</span>
          </p>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recent.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function NeedsHelp({ cfg }: SectionProps) {
  const data = (cfg?.data ?? {}) as { featurePoints?: string[]; whatsappCtaEnabled?: boolean; whatsappCtaText?: string };
  const points = data.featurePoints ?? ["Off-market options", "Owner negotiations", "Viewing arrangements", "No pressure"];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="relative overflow-hidden rounded-3xl border border-gold-500/25 bg-white p-6 shadow-xl sm:p-12">
        <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-gold-500/10 blur-3xl" aria-hidden />
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow={cfg?.eyebrow ?? "The concierge"}
              title={cfg?.title ?? "Can't Find What You're Looking For?"}
              subtitle={
                <>
                  {cfg?.description ??
                    "Tell us what you need and we'll help you search. You get a real person who walks through your budget, location and requirements — then brings you options that actually fit. This is how most of my successful matches begin."}
                </>
              }
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {points.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 px-3.5 py-2 text-[13px] font-medium text-ink-700">
                  <CheckCircle2 size={14} className="text-gold-600" /> {t}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href={cfg?.ctaHref ?? "/find"} size="lg">{cfg?.ctaText ?? "Tell Me What You Need"}</Button>
              {data.whatsappCtaEnabled !== false ? (
                <a href={whatsappLink(`Hello ${agent.name}, I need help finding a property.`)} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <WhatsAppIcon size={18} /> {data.whatsappCtaText ?? "Chat on WhatsApp"}
                  </Button>
                </a>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: Search, title: "I'll search, not you", text: "Send your requirements once and let me do the legwork." },
              { icon: ClipboardList, title: "You review, I handle the back-and-forth", text: "I contact owners, check availability and screen out time wasters." },
              { icon: Handshake, title: "We view and decide together", text: "I arrange viewings so you walk into places that are real and ready." },
            ].map((s) => (
              <div key={s.title} className="flex items-start gap-4 rounded-2xl border border-ink-900/5 bg-cream-50 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-700">
                  <s.icon size={20} />
                </span>
                <div>
                  <h4 className="font-semibold text-navy-900">{s.title}</h4>
                  <p className="mt-0.5 text-sm text-ink-500">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    n: "01",
    icon: MessageCircle,
    title: "Tell Me What You Need",
    text: "Share your budget, location and requirements through the request form or WhatsApp. It takes two minutes.",
  },
  {
    n: "02",
    icon: Search,
    title: "I Find Suitable Options",
    text: "I search my verified inventory and my network of owners, then match options against your requirements.",
  },
  {
    n: "03",
    icon: KeyRound,
    title: "View & Decide",
    text: "We arrange viewings at times that work for you. I handle the owners, you make the right decision.",
  },
];

export function HowItWorks({ cfg }: SectionProps) {
  const data = (cfg?.data ?? {}) as { steps?: { icon?: string; title: string; text: string }[] };
  const list = data.steps?.length
    ? data.steps.map((s, i) => ({ ...s, n: `0${i + 1}` }))
    : steps.map((s) => ({ ...s }));
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={cfg?.eyebrow ?? "How it works"}
        title={cfg?.title ?? "Finding the right place, the simple way"}
        subtitle={cfg?.subtitle ?? "You don't have to figure this out alone. This is the exact process I run with every client."}
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {list.map((s) => (
          <div key={s.n} className="relative rounded-2xl border border-ink-900/5 bg-white p-7 shadow-sm">
            <span className="font-display text-5xl font-bold text-gold-500/25">{s.n}</span>
            <span className="absolute right-6 top-6 flex size-12 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              {s.icon === "MessageCircle" ? <MessageCircle size={22} /> : s.icon === "KeyRound" ? <KeyRound size={22} /> : <Search size={22} />}
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-navy-900">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const whyPoints = [
  { icon: ShieldCheck, title: "Verified, not just listed", text: "Every listing shows when it was last confirmed. If I haven't checked it recently, I say so." },
  { icon: Users2, title: "Matched to you", text: "Your budget, area, bedrooms and amenities drive every recommendation — not an algorithm you have to fight." },
  { icon: Sparkles, title: "Off-market access", text: "Owners share places with me before they're advertised. Some of my best matches were never public." },
  { icon: ListChecks, title: "No wasted trips", text: "I confirm availability before you travel. You only visit places that are real and still free." },
];

export function WhyMe({ cfg }: SectionProps) {
  const data = (cfg?.data ?? {}) as { quote?: string };
  return (
    <section className="texture-cream border-y border-ink-900/5 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow={cfg?.eyebrow ?? "Why work with me"}
              title={cfg?.title ?? "More than listings. A person you can trust."}
              subtitle={
                <>
                  {cfg?.description ??
                    `I'm ${agent.name}, a real estate agent in Monrovia. I've spent over ${agent.experienceYears} years helping Liberians and returning residents find homes, rooms, land and commercial spaces — one careful match at a time.`}
                </>
              }
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {whyPoints.map((p) => (
                <div key={p.title} className="rounded-2xl border border-ink-900/5 bg-white p-5">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-gold-500/15 text-gold-700">
                    <p.icon size={19} />
                  </span>
                  <h4 className="mt-3 text-[15px] font-semibold text-navy-900">{p.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-gold-500/20 to-navy-900/10 blur-2xl" aria-hidden />
            <div className="relative rounded-3xl bg-white p-8 shadow-2xl">
              <p className="font-display text-2xl font-medium italic leading-snug text-navy-900">
                “{data.quote ?? "I don't believe you should scroll through endless options or waste weeks chasing listings that are already gone."}”
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-gold-500 font-display text-lg font-bold text-navy-900">
                  {agent.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-navy-900">{agent.name}</p>
                  <p className="text-sm text-ink-500">{agent.tagline}</p>
                </div>
              </div>
              <div className="mt-6 space-y-2 border-t border-ink-900/5 pt-5 text-sm text-ink-500">
                <p>✓ {agent.credential}</p>
                <p>✓ Serving {agent.areasServed.join(", ")}</p>
                <p>✓ WhatsApp-first communication</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function TestimonialsSection({ cfg }: SectionProps) {
  const testimonials = await getTestimonials();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeading
        eyebrow={cfg?.eyebrow ?? "What clients say"}
        title={cfg?.title ?? "People who found their place through me"}
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure key={t.id} className="flex flex-col rounded-2xl border border-ink-900/5 bg-white p-6 shadow-sm">
            <div className="flex gap-0.5 text-gold-500">
              {Array.from({ length: t.rating }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-700">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-ink-900/5 pt-4">
              <span className="flex size-10 items-center justify-center rounded-full bg-cream-200 font-semibold text-navy-800">
                {t.name.charAt(0)}
              </span>
              <div>
                <p className="font-semibold text-navy-900">{t.name}</p>
                <p className="text-xs text-ink-500">
                  {t.propertyType} · {t.location}
                </p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export async function BrowseByType({ cfg, types }: SectionProps & { types?: { href: string; label: string }[] }) {
  const list = types?.length
    ? types
    : [
        { href: "/rent/houses", label: "Houses for Rent" },
        { href: "/rent/rooms", label: "Rooms for Rent" },
        { href: "/rent/apartments", label: "Apartments for Rent" },
        { href: "/rent/compounds", label: "Compounds" },
        { href: "/rent/commercial", label: "Commercial Space" },
        { href: "/buy/land", label: "Land for Sale" },
      ];
  const icons = [Home, Armchair, Building2, TreePine, Store, Landmark];
  const liveListings = (await getAllProperties()).filter((p) => p.availabilityStatus === "available").length;
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          align="left"
          eyebrow={cfg?.eyebrow ?? "Find what you need"}
          title={cfg?.title ?? "Browse by Property Type"}
          subtitle={cfg?.subtitle ?? "Every category is small on purpose — because every listing is personally managed."}
        />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2.5 text-sm font-medium text-cream-50">
          {liveListings} live listings
        </span>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {list.map((b, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Link
              key={b.href}
              href={b.href}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-900/5 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lg"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-navy-900 text-gold-400 transition-colors group-hover:bg-gold-500 group-hover:text-navy-900">
                <Icon size={22} />
              </span>
              <span className="text-sm font-semibold leading-tight text-navy-900">{b.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function OwnerCTA({ cfg }: SectionProps) {
  const data = (cfg?.data ?? {}) as { featurePoints?: string[]; whatsappCtaText?: string };
  const points = data.featurePoints ?? ["Professional photography", "Serious inquiries only", "You stay in control"];
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="relative overflow-hidden rounded-3xl texture-card p-8 sm:p-14">
        <div className="pointer-events-none absolute -left-20 -bottom-24 size-72 rounded-full bg-gold-500/15 blur-3xl" aria-hidden />
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <SectionHeading
              align="left"
              tone="dark"
              eyebrow={cfg?.eyebrow ?? "For property owners"}
              title={cfg?.title ?? "Have a Property to Rent or Sell?"}
              subtitle={
                <>
                  {cfg?.description ??
                    "Let us help you reach serious renters and buyers. Submit your property once, and I'll verify the details, market it to my client list and handle the inquiries — so you deal with genuine people only."}
                </>
              }
            />
            <div className="mt-6 flex flex-wrap gap-2">
              {points.map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3.5 py-2 text-[13px] font-medium text-cream-50/80">
                  <CheckCircle2 size={14} className="text-gold-300" /> {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href={cfg?.ctaHref ?? "/list-property"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-4 text-base font-bold text-navy-900 shadow-lg shadow-gold-500/30 transition-colors hover:bg-gold-400"
            >
              {cfg?.ctaText ?? "List Your Property"}
            </Link>
            <a
              href={whatsappLink(`Hello ${agent.name}, I have a property I would like to market. Can we talk?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-4 text-base font-semibold text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-200"
            >
              <WhatsAppIcon size={20} /> {data.whatsappCtaText ?? "Talk to Me First"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}