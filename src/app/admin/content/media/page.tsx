import { getMedia } from "@/lib/cms";
import { cmsDeleteMedia } from "@/app/cms-actions";
import { AdminPageHeader, AdminCard } from "@/components/admin/admin-ui";
import { MediaUploader } from "./media-upload";
import Link from "next/link";
import { relativeTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MediaLibraryPage() {
  const media = await getMedia();

  return (
    <div className="min-w-0">
      <AdminPageHeader
        eyebrow="Content"
        title="Media Library"
        description="Upload images and files for use anywhere on the site. Files are stored locally and served from /api/media/."
      />
      <div className="space-y-6 p-4 sm:p-6">
        <AdminCard title="Upload">
          <MediaUploader />
        </AdminCard>

        <AdminCard
          title={`${media.length} file${media.length === 1 ? "" : "s"}`}
          description="Click the URL to copy it, then paste it in any image/URL field in the CMS."
        >
          {media.length === 0 ? (
            <p className="text-sm text-ink-400">Nothing uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {media.map((m) => (
                <div key={m.id} className="rounded-xl border border-ink-900/10 bg-cream-50/50 p-3">
                  {m.kind === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.name} className="h-28 w-full rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-28 items-center justify-center rounded-lg bg-navy-900/5 text-ink-400">
                      {m.name.split(".").pop()?.toUpperCase()}
                    </div>
                  )}
                  <p className="mt-2 truncate text-xs font-medium text-navy-900" title={m.name}>
                    {m.name}
                  </p>
                  <p className="text-[11px] text-ink-400">
                    {m.folder} · {relativeTime(m.uploadedAt)}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(m.url)}
                      className="rounded-full bg-navy-900 px-3 py-1 text-[11px] font-semibold text-cream-50 hover:bg-navy-800"
                    >
                      Copy URL
                    </button>
                    <form action={async () => {
                      "use server";
                      await cmsDeleteMedia(m.id);
                    }}>
                      <button type="submit" className="rounded-full border border-danger/30 px-3 py-1 text-[11px] font-semibold text-danger hover:bg-danger/5">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <p className="text-xs text-ink-400">
          Tip: uploaded URLs look like <code className="rounded bg-cream-100 px-1.5 py-0.5">/api/media/folder/…</code> and can be used in hero
          backgrounds, location cards and property photos.
        </p>
      </div>
    </div>
  );
}