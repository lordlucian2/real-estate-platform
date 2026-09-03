import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
import { site, whatsappLink, agent } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import type { HomeSectionCfg, SiteSettings } from "@/lib/types";

export function WhatsAppBand({ cfg, settings }: { cfg?: HomeSectionCfg; settings?: SiteSettings }) {
  const data = (cfg?.data ?? {}) as { secondaryCtaText?: string };
  const message = `Hello ${agent.name}, I need help finding a property. Can you assist me?`;
  const href = settings
    ? `https://wa.me/${settings.whatsapp.number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`
    : whatsappLink(message);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="texture-card relative overflow-hidden rounded-3xl p-8 sm:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-gold-500/10 blur-3xl" aria-hidden />
        <div className="grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-semibold leading-tight text-cream-50 sm:text-4xl">
              {cfg?.title ?? "The fastest way to ask me is WhatsApp."}
            </h2>
            <p className="mt-4 max-w-xl text-cream-50/70">
              {cfg?.description ?? "Send me a message and tell me what you're looking for. I reply personally — usually the same day."}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-base font-bold text-white shadow-lg shadow-black/20 transition-transform hover:scale-[1.02]"
              >
                <WhatsAppIcon size={20} /> {cfg?.ctaText ?? "Chat on WhatsApp"}
              </a>
              <Link
                href={cfg?.ctaHref ?? "/find"}
                className="flex items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-4 text-base font-semibold text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-200"
              >
                <MessageCircleQuestion size={20} /> {data.secondaryCtaText ?? "Tell Me What You Need"}
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold-300">
              {settings?.general?.brandLine ?? site.brandLine}
            </p>
            <p className="mt-3 font-display text-2xl font-semibold text-cream-50">{settings?.general?.phone ?? site.phoneDisplay}</p>
            <p className="mt-1 text-sm text-cream-50/70">{settings?.general?.hours ?? site.hours}</p>
            <div className="mt-4 h-px bg-white/15" />
            <p className="mt-4 text-sm text-cream-50/80">
              Have a property? Message me the same way — I&apos;ll take it from
              verification to finding the right tenant or buyer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}