"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

export default function FeaturedImageManager({
  productId,
  initialImageUrl,
}: {
  productId: string;
  initialImageUrl: string | null;
}) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleChange(url: string | null) {
    setImageUrl(url);
    setSaving("saving");
    try {
      const res = await fetch(`/api/admin/products/${productId}/image`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: url }),
      });
      if (!res.ok) throw new Error();
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1200);
      router.refresh();
    } catch {
      setSaving("error");
    }
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-1">Featured Image</h2>
      <p className="text-sm text-ink-muted mb-5">
        The main photo for this product — shown on shop pages, product listings, and as
        the primary photo on the product page. Add detail/spec photos separately below.
      </p>

      <ImageUploader value={imageUrl} onChange={handleChange} hint="Add a featured photo" />

      <div className="text-[10px] mt-1.5 h-3">
        {saving === "saving" && <span className="text-ink-faint">Saving...</span>}
        {saving === "saved" && <span className="text-ink-faint">Saved</span>}
        {saving === "error" && <span className="text-red-700">Couldn&apos;t save — please try again.</span>}
      </div>
    </div>
  );
}
