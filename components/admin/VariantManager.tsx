"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [newImage, setNewImage] = useState("");
  const [adding, setAdding] = useState(false);

  async function addVariant(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    await fetch(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, imageUrl: newImage || null }),
    });
    setNewName("");
    setNewImage("");
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
      <h2 className="text-lg font-medium mb-4">Styles / Finishes</h2>
      <p className="text-sm text-ink-muted mb-4">
        These appear as clickable options on the product page — clicking one swaps the
        product photo, exactly like a color swatch on a retail store.
      </p>

      {initialVariants.length > 0 && (
        <ul className="mb-6 space-y-2">
          {initialVariants.map((v) => (
            <li key={v.id} className="flex items-center justify-between border border-line rounded px-3 py-2 text-sm">
              <div>
                <span className="font-medium">{v.name}</span>
                {v.image_url && <span className="text-ink-muted text-xs ml-2">has image</span>}
              </div>
              <button
                type="button"
                onClick={() => deleteVariant(v.id)}
                className="text-xs text-ink-muted hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addVariant} className="flex flex-col sm:flex-row gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Style/finish name, e.g. Plated"
          className="flex-1 text-sm border border-line rounded px-3 py-2 focus:border-ink focus:outline-none"
        />
        <input
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
          placeholder="Image URL (optional)"
          className="flex-1 text-sm border border-line rounded px-3 py-2 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={adding}
          className="shrink-0 h-10 px-5 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
        >
          {adding ? "Adding..." : "+ Add"}
        </button>
      </form>
    </div>
  );
}
