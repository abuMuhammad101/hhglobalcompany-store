"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import ProductTypeManager from "./ProductTypeManager";
import { Section, Field, SaveBar, inputClass, saveJson, type SavingState } from "./FormKit";
import type { CategoryRow } from "./CategoryManager";

export default function CategoryEditForm({
  category,
  index,
  total,
  onMove,
  onDeleted,
}: {
  category: CategoryRow;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onDeleted: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [catalogueNumber, setCatalogueNumber] = useState(category.catalogue_number);
  const [description, setDescription] = useState(category.description ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(category.image_url);
  const [isActive, setIsActive] = useState(category.is_active);
  const [saving, setSaving] = useState<SavingState>("idle");
  const [deleting, setDeleting] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    try {
      await saveJson(`/api/admin/categories/${category.id}`, "PATCH", {
        name,
        slug,
        catalogueNumber,
        description,
        imageUrl,
        isActive,
      });
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1500);
      router.refresh();
    } catch {
      setSaving("error");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete the "${category.name}" category? This can't be undone.`)) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) {
      setDeleting(false);
      alert(body.error || "Couldn't delete that category — please try again.");
      return;
    }
    onDeleted();
  }

  return (
    <div className="border border-line rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <span className="font-mono-ui text-xs uppercase tracking-wide text-ink-muted">
          Catalogue — {category.catalogue_number}
          {!isActive && <span className="text-red-700 ml-2">Disabled</span>}
        </span>
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => onMove(-1)}
              disabled={index === 0}
              aria-label="Move earlier"
              className="w-5 h-5 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => onMove(1)}
              disabled={index === total - 1}
              aria-label="Move later"
              className="w-5 h-5 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
            >
              ↓
            </button>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-xs text-ink-muted hover:text-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <Section title="Category Details">
          <div className="space-y-5">
            <Field label="Photo">
              <ImageUploader value={imageUrl} onChange={setImageUrl} hint="Shown on the homepage category cards." />
            </Field>

            <Field label="Category Name">
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>

            <Field
              label="URL Slug"
              hint="Used in the category's web address — changing this changes its live web address, so update any saved links after saving."
            >
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
            </Field>

            <Field label="Catalogue Number">
              <input
                value={catalogueNumber}
                onChange={(e) => setCatalogueNumber(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </Field>

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="accent-ink"
              />
              Active — visible on the public site
            </label>
          </div>
        </Section>

        <SaveBar saving={saving} />
      </form>

      <div className="border-t border-line mt-8 pt-6">
        <ProductTypeManager categoryId={category.id} initialTypes={category.product_types} />
      </div>
    </div>
  );
}
