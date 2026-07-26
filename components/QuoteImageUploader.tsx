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
