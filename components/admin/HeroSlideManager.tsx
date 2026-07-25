"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

type Slide = { id: string; image_url: string; label: string | null };

export default function HeroSlideManager({ initialSlides }: { initialSlides: Slide[] }) {
  const router = useRouter();
  const [newLabel, setNewLabel] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function addSlide(e: React.FormEvent) {
    e.preventDefault();
    if (!newImage) return;
    setAdding(true);
    await fetch("/api/admin/hero-slides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLabel, imageUrl: newImage }),
    });
    setNewLabel("");
    setNewImage(null);
    setAdding(false);
    router.refresh();
  }

  async function deleteSlide(id: string) {
    if (!confirm("Remove this hero slide?")) return;
    await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Homepage Hero Carousel</h2>
      <p className="text-sm text-ink-muted mb-4">
        These photos slide automatically in the homepage hero section, alternating every few
        seconds. Add as many as you like.
      </p>

      {initialSlides.length > 0 && (
        <ul className="mb-6 space-y-2">
          {initialSlides.map((s) => (
            <li key={s.id} className="flex items-center justify-between border border-line rounded px-3 py-2 text-sm">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded border border-line shrink-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${s.image_url})` }}
                />
                <span className="font-medium">{s.label || "Untitled slide"}</span>
              </div>
              <button
                type="button"
                onClick={() => deleteSlide(s.id)}
                className="text-xs text-ink-muted hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addSlide} className="flex flex-col gap-4 border-t border-line pt-5">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Slide label (optional), e.g. Leather Goods"
          className="flex-1 text-sm border border-line rounded px-3 py-2 focus:border-ink focus:outline-none"
        />
        <ImageUploader value={newImage} onChange={setNewImage} label="Photo" />
        <button
          type="submit"
          disabled={adding || !newImage}
          className="self-start h-10 px-5 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
        >
          {adding ? "Adding..." : "+ Add Slide"}
        </button>
      </form>
    </div>
  );
}
