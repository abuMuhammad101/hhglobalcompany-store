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

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/quote/upload", { method: "POST", body: formData });
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
        className={`w-full h-24 relative rounded border border-dashed cursor-pointer overflow-hidden flex items-center justify-center bg-bg-soft transition-colors ${
          dragOver ? "border-ink" : "border-line hover:border-ink-faint"
        }`}
        style={
          value
            ? { backgroundImage: `url(${value})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        {!value && (
          <span className="text-ink-faint text-xs text-center px-2 leading-snug">
            {uploading ? "Uploading..." : "Click or drop a reference photo"}
          </span>
        )}
        {uploading && value && (
          <div className="absolute inset-0 bg-bg/80 flex items-center justify-center text-xs text-ink-muted">
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
