"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Section, Field, SaveBar, inputClass } from "@/components/admin/FormKit";

type ProductTypeOption = { id: string; name: string; is_active: boolean };
type CategoryOption = { id: string; name: string; productTypes: ProductTypeOption[] };

type InitialProduct = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  product_type_id: string | null;
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
  const [productTypeId, setProductTypeId] = useState(initial?.product_type_id ?? "");
  const [material, setMaterial] = useState(initial?.material ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState("");

  const productTypes = categories.find((c) => c.id === categoryId)?.productTypes ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    setError("");

    const payload = { categoryId, name, slug, productTypeId, material, description };

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
              onChange={(e) => {
                setCategoryId(e.target.value);
                setProductTypeId("");
              }}
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

          <Field
            label="Product Type"
            required
            hint={
              productTypes.length === 0
                ? "This category has no product types yet — add one from the Categories admin page first."
                : "Shown as the product's category tag, e.g. 'T-Shirt' or 'Mens Wallet'"
            }
          >
            <select
              required
              value={productTypeId}
              onChange={(e) => setProductTypeId(e.target.value)}
              disabled={productTypes.length === 0}
              className={inputClass}
            >
              <option value="">Select a product type</option>
              {productTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                  {!t.is_active ? " (disabled)" : ""}
                </option>
              ))}
            </select>
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
        <SaveBar saving={saving} label={isEdit ? "Save Changes" : "Create Product"} />
        <Link href="/admin/products" className="text-sm text-ink-muted hover:text-ink">
          Cancel
        </Link>
      </div>
    </form>
  );
}
