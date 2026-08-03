"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import VariantColorManager from "./VariantColorManager";

type VariantColorRow = { id: string; image_url: string; sort_order: number; colorId: string; colorName: string };

type Variant = {
  id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  variant_colors?: VariantColorRow[];
};

type CategoryColor = { id: string; name: string; is_active: boolean };

export default function VariantManager({
  productId,
  categoryColors,
  initialVariants,
}: {
  productId: string;
  categoryColors: CategoryColor[];
  initialVariants: Variant[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  async function addVariant(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, imageUrl: newImage }),
      });
      if (!res.ok) throw new Error();
      setNewName("");
      setNewImage(null);
      router.refresh();
    } catch {
      setAddError("Couldn't add that option — please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function deleteVariant(id: string) {
    if (!confirm("Remove this style/finish option?")) return;
    const res = await fetch(`/api/admin/variants/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Couldn't remove that option — please try again.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-1">Styles / Finishes</h2>
      <p className="text-sm text-ink-muted mb-5">
        These appear as clickable options on the product page — clicking one swaps the
        product photo, exactly like a color swatch on a retail store. Changes save
        automatically.
      </p>

      {initialVariants.length > 0 && (
        <ul className="mb-6 space-y-3">
          {initialVariants.map((v) => (
            <VariantRow key={v.id} variant={v} categoryColors={categoryColors} onDelete={() => deleteVariant(v.id)} />
          ))}
        </ul>
      )}

      <form
        onSubmit={addVariant}
        className="flex flex-col sm:flex-row sm:items-start gap-3 border border-dashed border-line rounded-lg p-4"
      >
        <ImageUploader compact value={newImage} onChange={setNewImage} />
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Style/finish name, e.g. Plated"
            className="flex-1 text-sm border border-line rounded px-3 py-2 focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            disabled={adding || !newName.trim()}
            className="shrink-0 h-10 px-5 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
          >
            {adding ? "Adding..." : "+ Add"}
          </button>
        </div>
      </form>
      {addError && <p className="text-xs text-red-700 mt-2">{addError}</p>}
    </div>
  );
}

function VariantRow({
  variant,
  categoryColors,
  onDelete,
}: {
  variant: Variant;
  categoryColors: CategoryColor[];
  onDelete: () => void;
}) {
  const [name, setName] = useState(variant.name);
  const [imageUrl, setImageUrl] = useState<string | null>(variant.image_url);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [busy, setBusy] = useState(false);

  async function save(patch: { name?: string; imageUrl?: string | null }) {
    setSaving("saving");
    try {
      const res = await fetch(`/api/admin/variants/${variant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1200);
    } catch {
      setSaving("error");
    }
  }

  async function handleDelete() {
    setBusy(true);
    onDelete();
  }

  return (
    <li className="border border-line rounded-lg p-3">
      <div className="flex items-start gap-4">
        <ImageUploader
          compact
          value={imageUrl}
          onChange={(url) => {
            setImageUrl(url);
            save({ imageUrl: url });
          }}
        />
        <div className="flex-1 min-w-0">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => {
              if (name.trim() && name !== variant.name) save({ name });
            }}
            className="w-full text-sm font-medium border border-line rounded px-2.5 py-2 focus:border-ink focus:outline-none"
          />
          <div className="text-[10px] mt-1 h-3">
            {saving === "saving" && <span className="text-ink-faint">Saving...</span>}
            {saving === "saved" && <span className="text-ink-faint">Saved</span>}
            {saving === "error" && <span className="text-red-700">Couldn&apos;t save</span>}
          </div>
        </div>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          className="text-xs text-ink-muted hover:text-red-700 disabled:opacity-50 mt-2 shrink-0"
        >
          {busy ? "Removing..." : "Remove"}
        </button>
      </div>

      <VariantColorManager
        variantId={variant.id}
        categoryColors={categoryColors}
        initialColors={(variant.variant_colors ?? []).map((vc) => ({
          id: vc.id,
          image_url: vc.image_url,
          sort_order: vc.sort_order,
          colorId: vc.colorId,
          colorName: vc.colorName,
        }))}
      />
    </li>
  );
}
