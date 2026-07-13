"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

type Variant = {
  id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
};

export default function VariantManager({
  productId,
  initialVariants,
}: {
  productId: string;
  initialVariants: Variant[];
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function addVariant(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    await fetch(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, imageUrl: newImage }),
    });
    setNewName("");
    setNewImage(null);
    setAdding(false);
    router.refresh();
  }

  async function deleteVariant(id: string) {
    if (!confirm("Remove this style/finish option?")) return;
    await fetch(`/api/admin/variants/${id}`, { method: "DELETE" });
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
            <VariantRow key={v.id} variant={v} onDelete={() => deleteVariant(v.id)} />
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
    </div>
  );
}

function VariantRow({ variant, onDelete }: { variant: Variant; onDelete: () => void }) {
  const [name, setName] = useState(variant.name);
  const [imageUrl, setImageUrl] = useState<string | null>(variant.image_url);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [busy, setBusy] = useState(false);

  async function save(patch: { name?: string; imageUrl?: string | null }) {
    setSaving("saving");
    try {
      await fetch(`/api/admin/variants/${variant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1200);
    } catch {
      setSaving("idle");
    }
  }

  async function handleDelete() {
    setBusy(true);
    onDelete();
  }

  return (
    <li className="flex items-start gap-4 border border-line rounded-lg p-3">
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
        <div className="text-[10px] text-ink-faint mt-1 h-3">
          {saving === "saving" && "Saving..."}
          {saving === "saved" && "Saved"}
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
    </li>
  );
}
