import Link from "next/link";
import { BadgeCheck, MessageSquareText, ShieldCheck, Sparkles } from "lucide-react";
import { agent, whatsappLink } from "@/lib/site";
import { HomeSearch } from "@/components/home/home-search";
import { Button } from "@/components/ui";
import { WhatsAppIcon } from "@/components/icons";
import type { HeroCms, SiteSettings } from "@/lib/types";

export function Hero({ hero, settings }: { hero?: HeroCms; settings?: SiteSettings }) {
  const h = hero ?? {
    eyebrow: "Your Property Agent in Liberia",
    title: "Find a Place That ",
    highlighted: "Fits Your Life.",
    description:
      "Houses, rooms, apartments, land and commercial properties — personally verified, seriously vetted and matched to what you actually need. No wasted trips. No chasing dead listings.",
    primaryCta: { label: "Find a Property", href: "/find", enabled: true },
    secondaryCta: { label: "List Your Property", href: "/list-property", enabled: true },
    trustBadges: ["Personally verified", `${agent.experienceYears}+ years serving Greater Monrovia`],
    background: "gradient" as const,
    image: "",
    solidColor: "#0B1528",
  };

  const waMessage = `Hello ${agent.name}, I need help finding a property. Can you assist me?`;
  const waHref = h.primaryCta?.whatsapp
    ? settings
      ? `https://wa.me/${settings.whatsapp.number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(h.primaryCta.message ?? waMessage)}`
      : whatsappLink(h.primaryCta.message ?? waMessage)
    : null;

  const style =
    h.background === "image" && h.image
      ? { backgroundImage: `url(${h.image})`, backgroundSize: "cover", backgroundPosition: "center" }
      : h.background === "solid"
        ? { backgroundColor: h.solidColor || "#0B1528" }
        : undefined;

  return (
    <section className="texture-dark relative overflow-hidden" style={style}>
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.02fr] lg:gap-16">
          <div className="animate-fade-up">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-200">
              <Sparkles size={13} /> {h.eyebrow}
            </p>

            <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tight text-cream-50 sm:text-5xl md:text-[3.4rem]">
              {h.title}
              {h.highlighted ? (
                <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent italic">
                  {h.highlighted}
                </span>
              ) : null}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-50/70">{h.description}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {h.primaryCta?.enabled ? (
                waHref ? (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-13 items-center justify-center gap-2 rounded-full bg-whatsapp px-8 text-base font-bold text-white shadow-lg shadow-whatsapp/25 transition-all hover:bg-whatsapp-dark active:scale-[0.99]"
                  >
                    <WhatsAppIcon size={18} /> {h.primaryCta.label}
                  </a>
                ) : (
                  <Link
                    href={h.primaryCta.href ?? "/find"}
                    className="flex h-13 items-center justify-center gap-2 rounded-full bg-gold-500 px-8 text-base font-bold text-navy-900 shadow-lg shadow-gold-500/25 transition-all hover:bg-gold-400 active:scale-[0.99]"
                  >
                    <MessageSquareText size={18} /> {h.primaryCta.label}
                  </Link>
                )
              ) : null}
              {h.secondaryCta?.enabled ? (
                <Button href={h.secondaryCta.href ?? "/list-property"} variant="outline" size="lg" className="border-white/20 text-cream-50 hover:border-gold-400 hover:bg-white/5 hover:text-gold-200">
                  {h.secondaryCta.label}
                </Button>
              ) : null}
            </div>

            <div className="mt-11 flex flex-wrap items-center gap-x-7 gap-y-3 text-[13px] font-medium text-cream-50/60">
              {h.trustBadges?.map((b) => (
                <span key={b} className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} className="text-gold-400" /> {b}
                </span>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in lg:mt-4">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gold-500/5 blur-2xl" aria-hidden />
            <HomeSearch tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}