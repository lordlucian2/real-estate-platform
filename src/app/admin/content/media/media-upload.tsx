"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function handleFile(file: File, folder: string) {
    setBusy(true);
    setMessage(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("folder", folder);
    const res = await fetch("/api/media/upload", { method: "POST", body: fd });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage({ ok: false, text: json.error || "Upload failed" });
      return;
    }
    setMessage({ ok: true, text: `Uploaded ${file.name} → ${json.url}` });
    router.refresh();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    handleFile(f, "library");
  }

  return (
    <div>
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-gold-500/40 bg-cream-50/40 px-4 py-6 text-sm hover:border-gold-500">
        <Upload size={18} className="text-gold-600" />
        <span className="font-semibold text-navy-900">
          {busy ? "Uploading…" : "Choose a file to upload"}
        </span>
        <span className="text-ink-400">(stored under .data/uploads/library/)</span>
        <input type="file" className="hidden" onChange={onFile} disabled={busy} />
      </label>
      {message ? (
        <p className={`mt-3 text-sm font-medium ${message.ok ? "text-success" : "text-danger"}`}>{message.text}</p>
      ) : null}
    </div>
  );
}