"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type CategoryOption = { id: string; name: string };

type InitialProduct = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  type: string;
  material: string;
  description: string;
};

type Props = {
  categories: CategoryOption[];
  initial?: InitialProduct;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ categories, initial }: Props) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? categories[0]?.id ?? "");
  const [type, setType] = useState(initial?.type ?? "");
  const [material, setMaterial] = useState(initial?.material ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    setError("");

    const payload = { categoryId, name, slug, type, material, description };

    try {
      const res = await fetch(isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Save failed");
      }
      if (isEdit) {
        router.refresh();
        setSaving("saved");
        setTimeout(() => setSaving("idle"), 1500);
      } else {
        const body = await res.json();
        router.push(`/admin/products/${body.id}/edit`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section title="Basic Details">
        <div className="space-y-6">
          <Field label="Category" required>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputClass}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          <Field label="Product Name" required>
            <input
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className={inputClass}
              placeholder="e.g. Classic Heavyweight Tee"
            />
          </Field>

          <Field label="URL Slug" required hint="Used in the product's web address — lowercase, hyphens only">
            <input
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className={inputClass}
              placeholder="e.g. classic-heavyweight-tee"
            />
          </Field>

          <Field label="Type" required hint="Shown as the product's category tag, e.g. 'T-Shirt' or 'Mens Wallet'">
            <input required value={type} onChange={(e) => setType(e.target.value)} className={inputClass} />
          </Field>

          <Field label="Material">
            <input value={material} onChange={(e) => setMaterial(e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Description">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </Section>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-5">
        <button
          type="submit"
          disabled={saving === "saving"}
          className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
        >
          {saving === "saving" ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        {saving === "saved" && <span className="text-xs text-ink-muted">Saved</span>}
        <Link href="/admin/products" className="text-sm text-ink-muted hover:text-ink">
          Cancel
        </Link>
      </div>
    </form>
  );
}

const inputClass =
  "w-full text-base bg-transparent border border-line rounded px-3 py-2.5 focus:border-ink focus:outline-none";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5 pb-3 border-b border-line">
        <h2 className="text-sm font-medium uppercase tracking-wide">{title}</h2>
        {hint && <p className="text-xs text-ink-faint mt-1.5 max-w-[52ch]">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
        {label}
        {required && " *"}
      </label>
      {children}
      {hint && <span className="block text-xs text-ink-faint mt-1.5">{hint}</span>}
    </div>
  );
}
