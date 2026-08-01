"use client";

import { useRef, useState } from "react";

type Props = {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
  compact?: boolean;
  /** Lets the user pick/drop several files at once. Each upload is reported
   * back through `onAddMultiple` (once, with every uploaded URL) instead of
   * `onChange`, since there's no single "value" to hold in this mode. */
  multiple?: boolean;
  onAddMultiple?: (urls: string[]) => void;
};

export default function ImageUploader({
  value,
  onChange,
  label,
  hint,
  compact = false,
  multiple = false,
  onAddMultiple,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  async function uploadOne(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) throw new Error(body.error || "Upload failed.");
    return body.url as string;
  }

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      onChange(await uploadOne(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleFiles(files: FileList) {
    setError("");
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadOne(file));
      }
      onAddMultiple?.(urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (multiple) handleFiles(files);
      else handleFile(files[0]);
    }
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (multiple) handleFiles(files);
      else handleFile(files[0]);
    }
  }

  const boxSize = compact ? "w-16 h-16 shrink-0" : "aspect-[4/5] w-full max-w-[240px]";

  return (
    <div>
      {label && <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">{label}</label>}
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
        aria-label={value ? "Change photo" : multiple ? "Upload photos" : "Upload photo"}
        className={`${boxSize} relative rounded border border-dashed cursor-pointer overflow-hidden flex items-center justify-center bg-bg-soft transition-colors ${
          dragOver ? "border-ink" : "border-line hover:border-ink-faint"
        }`}
        style={
          value
            ? { backgroundImage: `url(${value})`, backgroundSize: "cover", backgroundPosition: "center" }
            : undefined
        }
      >
        {!value && (
          <span
            className="text-ink-faint text-center px-2 leading-snug"
            style={{ fontSize: compact ? 10 : 12 }}
          >
            {uploading ? "Uploading..." : multiple ? "Click or drop photos" : "Click or drop a photo"}
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
          multiple={multiple}
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
