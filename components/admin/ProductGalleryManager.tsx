"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

type GalleryImage = { id: string; image_url: string; sort_order: number };

export default function ProductGalleryManager({
  productId,
  initialImages,
}: {
  productId: string;
  initialImages: GalleryImage[];
}) {
  const router = useRouter();
  const [images, setImages] = useState(
    initialImages.slice().sort((a, b) => a.sort_order - b.sort_order)
  );
  const [addKey, setAddKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function persistOrder(next: GalleryImage[]) {
    setImages(next);
    await fetch(`/api/admin/products/${productId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((img) => img.id) }),
    });
    router.refresh();
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = images.slice();
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  async function handleAdd(url: string | null) {
    if (!url) return;
    const res = await fetch(`/api/admin/products/${productId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url }),
    });
    const body = await res.json().catch(() => ({}));
    if (body.ok && body.image) {
      setImages((imgs) => [
        ...imgs,
        { id: body.image.id, image_url: body.image.image_url, sort_order: body.image.sort_order },
      ]);
    }
    setAddKey((k) => k + 1);
    router.refresh();
  }

  async function removeImage(id: string) {
    if (!confirm("Remove this photo?")) return;
    setBusyId(id);
    await fetch(`/api/admin/product-images/${id}`, { method: "DELETE" });
    setImages((imgs) => imgs.filter((img) => img.id !== id));
    setBusyId(null);
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-1">Photos</h2>
      <p className="text-sm text-ink-muted mb-5">
        Shown to customers as a gallery on the product page. The first photo is used as the
        cover everywhere else (shop pages, product listings) — use the arrows to reorder.
      </p>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-5">
          {images.map((img, i) => (
            <div key={img.id} className="relative">
              <div
                className="aspect-square rounded border border-line bg-bg-soft bg-cover bg-center"
                style={{ backgroundImage: `url(${img.image_url})` }}
              />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-ink text-on-dark text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded">
                  Cover
                </span>
              )}
              <div className="flex items-center justify-between mt-1.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(i, -1)}
                    disabled={i === 0}
                    aria-label="Move earlier"
                    className="w-6 h-6 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 1)}
                    disabled={i === images.length - 1}
                    aria-label="Move later"
                    className="w-6 h-6 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  disabled={busyId === img.id}
                  className="text-xs text-ink-muted hover:text-red-700 disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageUploader key={addKey} value={null} onChange={handleAdd} hint="Add a photo" />
    </div>
  );
}
