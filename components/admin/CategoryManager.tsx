"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CategoryEditForm from "./CategoryEditForm";

type ProductType = { id: string; name: string; sort_order: number; is_active: boolean };
type Color = { id: string; name: string; sort_order: number; is_active: boolean };

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  catalogue_number: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  product_types: ProductType[];
  colors: Color[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CategoryManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(
    initialCategories.slice().sort((a, b) => a.sort_order - b.sort_order)
  );
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [catalogueNumber, setCatalogueNumber] = useState(
    String(initialCategories.length + 1).padStart(2, "0")
  );
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [reordering, setReordering] = useState(false);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !catalogueNumber.trim()) return;
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, catalogueNumber }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || "Couldn't add that category.");
      setCategories((cur) => [
        ...cur,
        { ...body.category, is_active: body.category.is_active ?? true, product_types: [], colors: [] },
      ]);
      setName("");
      setSlug("");
      setSlugTouched(false);
      setCatalogueNumber(String(categories.length + 2).padStart(2, "0"));
      router.refresh();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Couldn't add that category.");
    } finally {
      setAdding(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= categories.length || reordering) return;
    const next = categories.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setCategories(next);
    setReordering(true);
    const res = await fetch("/api/admin/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((c) => c.id) }),
    });
    setReordering(false);
    if (!res.ok) {
      setCategories(categories);
      alert("Couldn't reorder categories — please try again.");
      return;
    }
    router.refresh();
  }

  function handleDeleted(id: string) {
    setCategories((cur) => cur.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-10">
      <form
        onSubmit={addCategory}
        className="border border-dashed border-line rounded-lg p-5 space-y-4"
      >
        <h2 className="text-sm font-medium uppercase tracking-wide">Add a Category</h2>
        <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
              Category Name
            </label>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              placeholder="e.g. Accessories"
              className="w-full text-base border border-line rounded px-3 py-2.5 focus:border-ink focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
              Catalogue Number
            </label>
            <input
              value={catalogueNumber}
              onChange={(e) => setCatalogueNumber(e.target.value)}
              placeholder="e.g. 03"
              className="w-full text-base border border-line rounded px-3 py-2.5 focus:border-ink focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
            URL Slug
          </label>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            placeholder="e.g. accessories"
            className="w-full text-base border border-line rounded px-3 py-2.5 focus:border-ink focus:outline-none"
          />
          <span className="block text-xs text-ink-faint mt-1.5">
            Used in the category&apos;s web address, e.g. hhglobalcompany.com/accessories
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={adding || !name.trim() || !slug.trim() || !catalogueNumber.trim()}
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
          >
            {adding ? "Adding..." : "+ Add Category"}
          </button>
          {addError && <span className="text-xs text-red-700">{addError}</span>}
        </div>
        <p className="text-xs text-ink-faint">
          Add its cover photo, description, and product types below once it&apos;s created.
        </p>
      </form>

      {categories.map((c, i) => (
        <CategoryEditForm
          key={c.id}
          category={c}
          index={i}
          total={categories.length}
          onMove={(dir) => move(i, dir)}
          onDeleted={() => handleDeleted(c.id)}
        />
      ))}
    </div>
  );
}
