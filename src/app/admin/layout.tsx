import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNav, FlatNavLink } from "@/components/admin/admin-nav";
import { getCurrentUser } from "@/lib/cms";
import { navForRole } from "@/lib/admin-nav";

export const metadata = {
  title: "Command Center",
  robots: { index: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const groups = navForRole(user.role);
  const flat = groups.flatMap((g) => g.items);

  return (
    <div className="mx-auto flex min-h-screen max-w-[1400px]">
      <AdminNav groups={groups} />

      <div className="min-w-0 flex-1">
        {/* Mobile admin tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-ink-900/5 bg-white p-2 lg:hidden no-scrollbar">
          {flat.map((item) => (
            <FlatNavLink key={item.href} item={item} />
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}