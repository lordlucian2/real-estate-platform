import { whatsappLink, agent } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import type { SiteSettings } from "@/lib/types";

export function FloatingWhatsApp({ settings }: { settings?: SiteSettings }) {
  const message = `Hello ${agent.name}, I need help finding a property. Can you assist me?`;
  const href = settings
    ? (() => {
        const clean = settings.whatsapp.number.replace(/[^0-9]/g, "");
        return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
      })()
    : whatsappLink(message);

  return (
    <a
      href={settings?.whatsapp?.enabled === false ? undefined : href}
      onClick={settings?.whatsapp?.enabled === false ? (e) => e.preventDefault() : undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with the agent on WhatsApp"
      className="group fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3.5 text-white shadow-xl shadow-whatsapp/40 transition-all hover:bg-whatsapp-dark md:bottom-6 md:right-6"
    >
      <WhatsAppIcon size={24} />
      <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold transition-all duration-300 group-hover:ml-1 group-hover:max-w-40 md:block">
        Find Me a Property
      </span>
    </a>
  );
}