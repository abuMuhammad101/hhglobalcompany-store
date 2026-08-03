"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

type GalleryImage = { id: string; image_url: string; sort_order: number };

/**
 * Extra photos for one color option, beyond its required cover photo —
 * mirrors ProductGalleryManager's Detail Photos pattern one level deeper.
 * Nested inside each color row in VariantColorManager.
 */
export default function VariantColorImageManager({
  variantColorId,
  initialImages,
}: {
  variantColorId: string;
  initialImages: GalleryImage[];
}) {
  const router = useRouter();
  const [images, setImages] = useState(
    initialImages.slice().sort((a, b) => a.sort_order - b.sort_order)
  );
  const [addKey, setAddKey] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function persistOrder(next: GalleryImage[]) {
    const prev = images;
    setImages(next);
    const res = await fetch(`/api/admin/variant-colors/${variantColorId}/images`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((img) => img.id) }),
    });
    if (!res.ok) {
      setImages(prev);
      alert("Couldn't reorder photos — please try again.");
      return;
    }
    router.refresh();
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = images.slice();
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  async function addOne(url: string): Promise<boolean> {
    const res = await fetch(`/api/admin/variant-colors/${variantColorId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: url }),
    });
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.ok && body.image) {
      setImages((imgs) => [
        ...imgs,
        { id: body.image.id, image_url: body.image.image_url, sort_order: body.image.sort_order },
      ]);
      return true;
    }
    return false;
  }

  async function handleAddMultiple(urls: string[]) {
    let failures = 0;
    for (const url of urls) {
      if (!(await addOne(url))) failures += 1;
    }
    if (failures > 0) {
      alert(`${failures} photo${failures > 1 ? "s" : ""} couldn't be added — please try again.`);
    }
    setAddKey((k) => k + 1);
    router.refresh();
  }

  async function removeImage(id: string) {
    if (!confirm("Remove this photo?")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/variant-color-images/${id}`, { method: "DELETE" });
    if (res.ok) {
      setImages((imgs) => imgs.filter((img) => img.id !== id));
      router.refresh();
    } else {
      alert("Couldn't remove that photo — please try again.");
    }
    setBusyId(null);
  }

  return (
    <div className="mt-2 pl-1">
      <span className="block text-[11px] text-ink-faint mb-1.5">
        Additional photos for this color (optional)
      </span>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((img, i) => (
            <div key={img.id} className="relative w-12 h-12">
              <div
                className="w-12 h-12 rounded border border-line bg-bg-soft bg-cover bg-center"
                style={{ backgroundImage: `url(${img.image_url})` }}
              />
              <div className="absolute -top-1.5 -right-1.5 flex gap-0.5">
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  disabled={busyId === img.id}
                  aria-label="Remove photo"
                  className="w-4 h-4 rounded-full bg-ink text-on-dark text-[9px] flex items-center justify-center disabled:opacity-50"
                >
                  ×
                </button>
              </div>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                <button
                  type="button"
                  onClick={() => moveImage(i, -1)}
                  disabled={i === 0}
                  aria-label="Move earlier"
                  className="w-4 h-4 inline-flex items-center justify-center text-ink-faint hover:text-ink disabled:opacity-30 text-[10px]"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  disabled={i === images.length - 1}
                  aria-label="Move later"
                  className="w-4 h-4 inline-flex items-center justify-center text-ink-faint hover:text-ink disabled:opacity-30 text-[10px]"
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageUploader
        key={addKey}
        compact
        value={null}
        onChange={(url) => {
          if (!url) return;
          handleAddMultiple([url]);
        }}
        onAddMultiple={handleAddMultiple}
        multiple
      />
    </div>
  );
}
