"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

type CategoryColor = { id: string; name: string; is_active: boolean };
type VariantColorRow = { id: string; image_url: string; sort_order: number; colorId: string; colorName: string };

export default function VariantColorManager({
  variantId,
  categoryColors,
  initialColors,
}: {
  variantId: string;
  categoryColors: CategoryColor[];
  initialColors: VariantColorRow[];
}) {
  const router = useRouter();
  const [colors, setColors] = useState(
    initialColors.slice().sort((a, b) => a.sort_order - b.sort_order)
  );
  const [newColorId, setNewColorId] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [reordering, setReordering] = useState(false);

  const usedColorIds = new Set(colors.map((c) => c.colorId));
  const availableColors = categoryColors.filter((c) => c.is_active && !usedColorIds.has(c.id));

  async function addColor(e: React.FormEvent) {
    e.preventDefault();
    if (!newColorId || !newImage) return;
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch(`/api/admin/variants/${variantId}/colors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorId: newColorId, imageUrl: newImage }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || "Couldn't add that color.");
      const vc = body.variantColor;
      const colorRow = Array.isArray(vc.colors) ? vc.colors[0] : vc.colors;
      setColors((cur) => [
        ...cur,
        { id: vc.id, image_url: vc.image_url, sort_order: vc.sort_order, colorId: colorRow.id, colorName: colorRow.name },
      ]);
      setNewColorId("");
      setNewImage(null);
      router.refresh();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Couldn't add that color.");
    } finally {
      setAdding(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= colors.length || reordering) return;
    const next = colors.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setColors(next);
    setReordering(true);
    const res = await fetch(`/api/admin/variants/${variantId}/colors`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((c) => c.id) }),
    });
    setReordering(false);
    if (!res.ok) {
      setColors(colors);
      alert("Couldn't reorder colors — please try again.");
      return;
    }
    router.refresh();
  }

  async function updatePhoto(id: string, imageUrl: string | null) {
    if (!imageUrl) return;
    setColors((cur) => cur.map((c) => (c.id === id ? { ...c, image_url: imageUrl } : c)));
    const res = await fetch(`/api/admin/variant-colors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    });
    if (!res.ok) {
      alert("Couldn't save that photo — please try again.");
      return;
    }
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Remove this color?")) return;
    const res = await fetch(`/api/admin/variant-colors/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Couldn't remove that color — please try again.");
      return;
    }
    setColors((cur) => cur.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div className="border-t border-line mt-3 pt-3">
      <span className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
        Colors for this option
      </span>

      {colors.length > 0 && (
        <ul className="mb-3 space-y-2">
          {colors.map((c, i) => (
            <li key={c.id} className="flex items-center gap-3 border border-line rounded-lg p-2">
              <ImageUploader compact value={c.image_url} onChange={(url) => updatePhoto(c.id, url)} />
              <span className="flex-1 min-w-0 text-sm font-medium truncate">{c.colorName}</span>
              <div className="flex flex-col shrink-0">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move earlier"
                  className="w-5 h-5 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === colors.length - 1}
                  aria-label="Move later"
                  className="w-5 h-5 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                onClick={() => remove(c.id)}
                className="text-xs text-ink-muted hover:text-red-700 shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {availableColors.length > 0 ? (
        <form onSubmit={addColor} className="flex items-center gap-3">
          <ImageUploader compact value={newImage} onChange={setNewImage} />
          <select
            value={newColorId}
            onChange={(e) => setNewColorId(e.target.value)}
            className="flex-1 text-sm border border-line rounded px-2.5 py-2 focus:border-ink focus:outline-none"
          >
            <option value="">Select a color</option>
            {availableColors.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding || !newColorId || !newImage}
            className="shrink-0 h-9 px-4 rounded-full bg-ink text-on-dark text-xs font-medium disabled:opacity-60"
          >
            {adding ? "Adding..." : "+ Add"}
          </button>
        </form>
      ) : (
        <p className="text-xs text-ink-faint">
          {categoryColors.length === 0
            ? "This product's category has no colors yet — add some from the Categories admin page first."
            : "Every color for this category is already added to this option."}
        </p>
      )}
      {addError && <p className="text-xs text-red-700 mt-2">{addError}</p>}
    </div>
  );
}
