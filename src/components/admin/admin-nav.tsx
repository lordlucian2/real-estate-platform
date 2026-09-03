"use client";

import { LogOut, Shapes } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/app/actions";
import { useState } from "react";
import type { AdminNavGroup, AdminNavItem } from "@/lib/admin-nav";

export function AdminNav({ groups }: { groups: AdminNavGroup[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-ink-900/5 bg-white lg:flex">
      <div className="max-h-[calc(100vh-4rem)] flex-1 space-y-5 overflow-y-auto p-4">
        {groups.map((group) => (
          <div key={group.title}>
            <p className="px-3.5 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-navy-900 text-white"
                      : "text-ink-700 hover:bg-cream-100 hover:text-navy-900"
                  }`}
                >
                  <item.icon size={17} className={isActive(item.href) ? "text-gold-400" : "text-ink-400"} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-900/5 p-4">
        <p className="px-3.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">Utility</p>
        <div className="mt-1 space-y-0.5">
          <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium text-ink-700 hover:bg-cream-100">
            <Shapes size={17} className="text-ink-400" /> View website
          </Link>
          <button
            type="button"
            disabled={loggingOut}
            onClick={async () => {
              setLoggingOut(true);
              const res = await adminLogout();
              if (res.ok) router.push("/admin");
              setTimeout(() => setLoggingOut(false), 800);
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-left text-sm font-medium text-ink-700 hover:bg-cream-100"
          >
            <LogOut size={17} className="text-ink-400" /> {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </div>
    </aside>
  );
}

export function FlatNavLink({ item }: { item: AdminNavItem }) {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
  return (
    <Link
      href={item.href}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium ${
        isActive ? "border-navy-900 bg-navy-900 text-white" : "border-ink-900/10 text-ink-700"
      }`}
    >
      {item.label}
    </Link>
  );
}