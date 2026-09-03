import type { Metadata } from "next";
import { PropertyForm } from "@/components/admin/property-form";

export const metadata: Metadata = { title: "Add Property" };

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-6">
      <h1 className="font-display text-2xl font-semibold text-navy-900">Add a new property</h1>
      <p className="mt-1 text-sm text-ink-500">
        The public listing goes live immediately with the verification status you choose.
      </p>
      <div className="mt-6 rounded-3xl border border-ink-900/5 bg-white p-5 shadow-sm sm:p-8">
        <PropertyForm />
      </div>
    </div>
  );
}