"use client";

import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { saveJson, type SavingState } from "./FormKit";

type Category = {
  id: string;
  name: string;
  description: string | null;
  catalogue_number: string;
  image_url: string | null;
};

export default function CategoryEditForm({ category }: { category: Category }) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(category.image_url);
  const [saving, setSaving] = useState<SavingState>("idle");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    try {
      await saveJson(`/api/admin/categories/${category.id}`, "PATCH", { name, description, imageUrl });
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1500);
    } catch {
      setSaving("error");
    }
  }

  return (
    <form onSubmit={handleSave} className="border border-line rounded-lg p-6">
      <span className="block text-xs font-mono-ui uppercase tracking-wide text-ink-muted mb-4">
        Catalogue — {category.catalogue_number}
      </span>

      <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
        Photo
      </label>
      <div className="mb-5">
        <ImageUploader value={imageUrl} onChange={setImageUrl} hint="Shown on the homepage category cards." />
      </div>

      <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
        Category Name
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full text-base border border-line rounded px-3 py-2.5 mb-5 focus:border-ink focus:outline-none"
      />

      <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
        Description
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        className="w-full text-base border border-line rounded px-3 py-2.5 mb-5 focus:border-ink focus:outline-none"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving === "saving"}
          className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
        >
          {saving === "saving" ? "Saving..." : "Save"}
        </button>
        {saving === "saved" && <span className="text-xs text-ink-muted">Saved</span>}
        {saving === "error" && <span className="text-xs text-red-700">Couldn&apos;t save — try again</span>}
      </div>
    </form>
  );
}
