import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProperties } from "@/lib/store";
import { PropertyForm } from "@/components/admin/property-form";

export const metadata: Metadata = { title: "Edit Property" };

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = (await getAllProperties()).find((p) => p.id === id);
  if (!property) notFound();

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="font-display text-2xl font-semibold text-navy-900">Edit property</h1>
      <p className="mt-1 text-sm text-ink-500">{property.id}</p>
      <div className="mt-6 rounded-3xl border border-ink-900/5 bg-white p-5 shadow-sm sm:p-8">
        <PropertyForm existing={property} />
      </div>
    </div>
  );
}