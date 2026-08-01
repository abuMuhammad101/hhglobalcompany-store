"use client";

import { useRef, useState } from "react";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
};

export default function QuoteImageUploader({ value, onChange, label, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // Every upload is re-encoded to WebP client-side: it's a smaller, modern
  // format regardless of what the visitor's phone or camera produced (HEIC,
  // large JPEGs, PNGs, ...), which also keeps phone photos (routinely 5-12MB)
  // well under the ~4.5MB request-body limit our hosting platform enforces in
  // front of the upload route — that limit rejects oversized requests before
  // our own route ever runs, as a bare non-JSON 413. GIFs are left alone so
  // any animation survives, since a canvas re-encode only captures one frame.
  const MAX_DIMENSION = 1920;
  const WEBP_QUALITY = 0.85;

  async function convertToWebp(file: File): Promise<File> {
    if (file.type === "image/gif") return file;
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
      const width = Math.round(bitmap.width * scale);
      const height = Math.round(bitmap.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return file;
      ctx.drawImage(bitmap, 0, 0, width, height);
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", WEBP_QUALITY));
      if (!blob || blob.type !== "image/webp" || blob.size >= file.size) return file;
      const name = file.name.replace(/\.[^.]+$/, "") + ".webp";
      return new File([blob], name, { type: "image/webp" });
    } catch {
      return file;
    }
  }

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const upload = await convertToWebp(file);
      const formData = new FormData();
      formData.append("file", upload);
      const res = await fetch("/api/quote/upload", { method: "POST", body: formData });
      if (res.status === 413) {
        throw new Error("That photo is too large — try a smaller photo or resize it before uploading.");
      }
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || "Upload failed.");
      onChange(body.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div>
      {label && (
        <label className="block font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-2">
          {label}
        </label>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={value ? "Change photo" : "Upload a reference photo"}
        className={`w-full h-28 relative rounded-lg border border-dashed cursor-pointer overflow-hidden flex items-center justify-center bg-bg-soft transition-colors ${
          dragOver ? "border-accent" : "border-line hover:border-ink-faint"
        }`}
      >
        {value && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${value})` }}
          />
        )}

        {!value && !uploading && (
          <span className="flex flex-col items-center gap-2 text-ink-faint px-2 text-center">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4M7 9l5-5 5 5" />
              <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
            </svg>
            <span className="text-xs leading-snug">Click or drop a reference photo</span>
          </span>
        )}

        {uploading && (
          <div className={`absolute inset-0 flex items-center justify-center gap-2 text-xs font-medium ${value ? "bg-bg/80 text-ink" : "text-ink-muted"}`}>
            <span className="w-3.5 h-3.5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
            Uploading...
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={onInputChange}
          className="hidden"
        />
      </div>

      <div className="flex items-center gap-3 mt-1.5">
        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="text-xs text-ink-muted hover:text-red-700"
          >
            Remove photo
          </button>
        )}
        {hint && !error && <span className="text-xs text-ink-faint">{hint}</span>}
      </div>
      {error && <p className="text-xs text-red-700 mt-1">{error}</p>}
    </div>
  );
}
