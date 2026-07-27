"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/admin/ImageUploader";

type Slide = { id: string; image_url: string; label: string | null };

export default function HeroSlideManager({ initialSlides }: { initialSlides: Slide[] }) {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [newLabel, setNewLabel] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [reordering, setReordering] = useState(false);

  async function addSlide(e: React.FormEvent) {
    e.preventDefault();
    if (!newImage) return;
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/hero-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel, imageUrl: newImage }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || "Couldn't add the slide.");
      setNewLabel("");
      setNewImage(null);
      router.refresh();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Couldn't add the slide.");
    } finally {
      setAdding(false);
    }
  }

  async function deleteSlide(id: string) {
    if (!confirm("Remove this hero slide?")) return;
    const prev = slides;
    setSlides((s) => s.filter((slide) => slide.id !== id));
    const res = await fetch(`/api/admin/hero-slides/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setSlides(prev);
      alert("Couldn't remove that slide — please try again.");
      return;
    }
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length || reordering) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    setSlides(next);
    setReordering(true);
    const res = await fetch("/api/admin/hero-slides", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((s) => s.id) }),
    });
    setReordering(false);
    if (!res.ok) {
      setSlides(slides);
      alert("Couldn't reorder slides — please try again.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <h2 className="text-lg font-medium mb-4">Homepage Hero Carousel</h2>
      <p className="text-sm text-ink-muted mb-4">
        These photos slide automatically in the homepage hero section, alternating every few
        seconds. Add as many as you like, and use the arrows to change the order they play in.
      </p>

      {slides.length > 0 && (
        <ul className="mb-6 space-y-3">
          {slides.map((s, i) => (
            <HeroSlideRow
              key={s.id}
              slide={s}
              index={i}
              total={slides.length}
              onMove={(dir) => move(i, dir)}
              onDelete={() => deleteSlide(s.id)}
              onSaved={(patch) =>
                setSlides((cur) => cur.map((slide) => (slide.id === s.id ? { ...slide, ...patch } : slide)))
              }
            />
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
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={adding || !newImage}
            className="self-start h-10 px-5 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
          >
            {adding ? "Adding..." : "+ Add Slide"}
          </button>
          {addError && <span className="text-xs text-red-700">{addError}</span>}
        </div>
      </form>
    </div>
  );
}

function HeroSlideRow({
  slide,
  index,
  total,
  onMove,
  onDelete,
  onSaved,
}: {
  slide: Slide;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
  onSaved: (patch: Partial<Slide>) => void;
}) {
  const [label, setLabel] = useState(slide.label ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(slide.image_url);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const dirty = label !== (slide.label ?? "") || imageUrl !== slide.image_url;

  async function save() {
    if (!imageUrl) return;
    setSaving("saving");
    try {
      const res = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, imageUrl }),
      });
      if (!res.ok) throw new Error();
      onSaved({ label, image_url: imageUrl });
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1500);
    } catch {
      setSaving("error");
    }
  }

  return (
    <li className="border border-line rounded-lg px-4 py-3">
      <div className="flex items-start gap-4">
        <div className="w-16 shrink-0">
          <ImageUploader value={imageUrl} onChange={setImageUrl} compact />
        </div>

        <div className="flex-1 min-w-0">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Untitled slide"
            className="w-full text-sm font-medium border-b border-transparent hover:border-line focus:border-ink bg-transparent focus:outline-none pb-1"
          />
          <div className="flex items-center gap-3 mt-2">
            {dirty && (
              <button
                type="button"
                onClick={save}
                disabled={saving === "saving"}
                className="text-xs font-medium h-7 px-3 rounded-full bg-ink text-on-dark disabled:opacity-60"
              >
                {saving === "saving" ? "Saving..." : "Save"}
              </button>
            )}
            {saving === "saved" && <span className="text-xs text-ink-muted">Saved</span>}
            {saving === "error" && <span className="text-xs text-red-700">Couldn&apos;t save — try again</span>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label="Move slide earlier"
            className="w-7 h-7 rounded border border-line flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink-faint disabled:opacity-30"
          >
            &uarr;
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label="Move slide later"
            className="w-7 h-7 rounded border border-line flex items-center justify-center text-ink-muted hover:text-ink hover:border-ink-faint disabled:opacity-30"
          >
            &darr;
          </button>
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-ink-muted hover:text-red-700 shrink-0 mt-1.5"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
