"use client";

import { useState } from "react";
import ImageUploader from "@/components/admin/ImageUploader";
import { Field, saveJson, type SavingState, inputClass } from "@/components/admin/FormKit";

export default function LogoManager({
  initialLogoUrl,
  initialBrandName,
}: {
  initialLogoUrl: string | null;
  initialBrandName: string;
}) {
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [brandName, setBrandName] = useState(initialBrandName);
  const [saving, setSaving] = useState<SavingState>("idle");

  async function save(patch: { logoUrl?: string | null; brandName?: string }) {
    setSaving("saving");
    try {
      await saveJson("/api/admin/settings", "PATCH", patch);
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1500);
    } catch {
      setSaving("error");
    }
  }

  function handleLogoChange(url: string | null) {
    setLogoUrl(url);
    save({ logoUrl: url });
  }

  function handleBrandNameSave(e: React.FormEvent) {
    e.preventDefault();
    save({ brandName });
  }

  return (
    <div className="border border-line rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4">Site Identity</h2>
      <p className="text-sm text-ink-muted mb-4">
        Shown together in the header.
      </p>
      <div className="mb-6">
        <ImageUploader value={logoUrl} onChange={handleLogoChange} label="Logo" hint="Square, transparent background works best" />
      </div>
      <form onSubmit={handleBrandNameSave} className="flex items-end gap-3 max-w-sm">
        <div className="flex-1">
          <Field label="Brand Name">
            <input value={brandName} onChange={(e) => setBrandName(e.target.value)} className={inputClass} />
          </Field>
        </div>
        <button
          type="submit"
          disabled={saving === "saving"}
          className="h-[42px] px-5 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60 shrink-0"
        >
          Save
        </button>
      </form>
      {saving === "saved" && <span className="text-xs text-ink-muted block mt-2">Saved</span>}
      {saving === "error" && <span className="text-xs text-red-700 block mt-2">Couldn&apos;t save — try again</span>}
    </div>
  );
}
