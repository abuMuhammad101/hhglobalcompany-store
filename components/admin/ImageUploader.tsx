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

  // Phone photos routinely come in at 5-12MB, well past the ~4.5MB request-body
  // limit our hosting platform enforces in front of the upload route — that
  // rejection happens before our own route ever runs, as a bare non-JSON 413,
  // so shrinking oversized photos here is what keeps a normal phone photo
  // uploadable at all rather than relying on a friendlier error message.
  const MAX_DIMENSION = 1920;
  const COMPRESS_ABOVE_BYTES = 1.5 * 1024 * 1024;
  const JPEG_QUALITY = 0.85;

  async function compressImage(file: File): Promise<File> {
    if (file.type === "image/gif" || file.size <= COMPRESS_ABOVE_BYTES) return file;
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
      const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
      if (!blob || blob.size >= file.size) return file;
      const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
      return new File([blob], name, { type: "image/jpeg" });
    } catch {
      return file;
    }
  }

  async function uploadOne(file: File): Promise<string> {
    const upload = await compressImage(file);
    const formData = new FormData();
    formData.append("file", upload);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (res.status === 413) {
      throw new Error("That photo is too large — try a smaller photo or resize it before uploading.");
    }
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
    const urls: string[] = [];
    const failures: string[] = [];
    for (const file of Array.from(files)) {
      try {
        urls.push(await uploadOne(file));
      } catch (err) {
        failures.push(err instanceof Error ? err.message : "Upload failed.");
      }
    }
    if (urls.length > 0) onAddMultiple?.(urls);
    if (failures.length > 0) {
      setError(
        urls.length > 0
          ? `${failures.length} of ${files.length} photos couldn't be uploaded (${failures[0]}) — the rest were added.`
          : failures[0]
      );
    }
    setUploading(false);
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
