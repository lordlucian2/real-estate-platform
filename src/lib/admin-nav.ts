import {
  BadgeCheck,
  Bell,
  Blocks,
  Building2,
  ClipboardList,
  ConciergeBell,
  Contact,
  Database,
  Eye,
  FileText,
  HandCoins,
  HeartHandshake,
  HelpCircle,
  Home,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  LayoutTemplate,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Navigation,
  Palette,
  PanelBottom,
  PanelTop,
  PhoneCall,
  Quote,
  Route,
  ScrollText,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminRole } from "./types";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: AdminRole[];
}

export interface AdminNavGroup {
  title: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    title: "Overview",
    items: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["owner", "admin", "editor"] }],
  },
  {
    title: "Website",
    items: [
      { href: "/admin/website/homepage", label: "Homepage Editor", icon: LayoutTemplate, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/preview", label: "Preview Draft", icon: Eye, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/hero", label: "Hero Section", icon: Sparkles, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/sections", label: "Sections", icon: Blocks, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/navigation", label: "Navigation", icon: Navigation, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/topbar", label: "Top Bar", icon: PanelTop, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/featured", label: "Featured Properties", icon: Star, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/property-types", label: "Property Types", icon: Building2, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/locations", label: "Locations", icon: MapPin, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/how-it-works", label: "How It Works", icon: Route, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/concierge", label: "Concierge Section", icon: ConciergeBell, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/why-me", label: "Why Me", icon: BadgeCheck, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/owner-cta", label: "Owner CTA", icon: HandCoins, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/contact", label: "Contact Page", icon: PhoneCall, roles: ["owner", "admin", "editor"] },
      { href: "/admin/website/footer", label: "Footer", icon: PanelBottom, roles: ["owner", "admin", "editor"] },
    ],
  },
  {
    title: "Inventory",
    items: [{ href: "/admin/properties", label: "Properties", icon: Home, roles: ["owner", "admin"] }],
  },
  {
    title: "Leads & Inbox",
    items: [
      { href: "/admin/requests", label: "Client Requests", icon: MessageSquareText, roles: ["owner", "admin"] },
      { href: "/admin/viewings", label: "Viewings", icon: KeyRound, roles: ["owner", "admin"] },
      { href: "/admin/leads", label: "Leads", icon: Users, roles: ["owner", "admin"] },
      { href: "/admin/owners", label: "Owner Submissions", icon: Wallet, roles: ["owner", "admin"] },
      { href: "/admin/alerts", label: "Alerts", icon: HeartHandshake, roles: ["owner", "admin"] },
    ],
  },
  {
    title: "CRM",
    items: [
      { href: "/admin/crm/clients", label: "Clients", icon: Contact, roles: ["owner", "admin"] },
      { href: "/admin/crm/whatsapp-templates", label: "WhatsApp Templates", icon: MessageCircle, roles: ["owner", "admin", "editor"] },
      { href: "/admin/crm/tasks", label: "Tasks", icon: ClipboardList, roles: ["owner", "admin"] },
    ],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/content/testimonials", label: "Testimonials", icon: Quote, roles: ["owner", "admin", "editor"] },
      { href: "/admin/content/faqs", label: "FAQs", icon: HelpCircle, roles: ["owner", "admin", "editor"] },
      { href: "/admin/content/media", label: "Media Library", icon: ImageIcon, roles: ["owner", "admin", "editor"] },
      { href: "/admin/content/pages", label: "Custom Pages", icon: FileText, roles: ["owner", "admin", "editor"] },
    ],
  },
  {
    title: "Settings",
    items: [
      { href: "/admin/settings/general", label: "General & Identity", icon: Settings, roles: ["owner", "admin"] },
      { href: "/admin/settings/whatsapp", label: "WhatsApp & Social", icon: Share2, roles: ["owner", "admin", "editor"] },
      { href: "/admin/settings/seo", label: "SEO / Search", icon: Search, roles: ["owner", "admin", "editor"] },
      { href: "/admin/settings/appearance", label: "Appearance", icon: Palette, roles: ["owner", "admin", "editor"] },
      { href: "/admin/settings/notifications", label: "Notifications", icon: Bell, roles: ["owner", "admin", "editor"] },
      { href: "/admin/settings/users", label: "Team & Roles", icon: ShieldCheck, roles: ["owner"] },
      { href: "/admin/settings/audit", label: "Audit Log", icon: ScrollText, roles: ["owner", "admin"] },
      { href: "/admin/settings/system", label: "System", icon: Database, roles: ["owner"] },
    ],
  },
];

/** Flat list for the mobile tab strip */
export const adminNavFlat: AdminNavItem[] = adminNavGroups.flatMap((g) => g.items);

export function navForRole(role: AdminRole, groups: AdminNavGroup[] = adminNavGroups): AdminNavGroup[] {
  return groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.roles.includes(role)) }))
    .filter((g) => g.items.length > 0);
}