"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";

export default function LogoManager({ initialLogoUrl }: { initialLogoUrl: string | null }) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");

  async function save(url: string | null) {
    setLogoUrl(url);
    setSaving("saving");
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl: url }),
    });
    setSaving("saved");
    setTimeout(() => setSaving("idle"), 1500);
  }

  return (
    <div className="border border-line rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Site Logo</h2>
      <p className="text-sm text-ink-muted mb-4">
        Shown in the header, next to the &quot;H&amp;H Global&quot; name.
      </p>
      <ImageUploader value={logoUrl} onChange={save} label="Logo" hint="Square, transparent background works best" />
      {saving === "saved" && <span className="text-xs text-ink-muted block mt-2">Saved</span>}
    </div>
  );
}
