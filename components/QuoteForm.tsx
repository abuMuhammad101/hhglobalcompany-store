"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";

type Props = {
  catalog: Category[];
  presetCategory?: string;
  presetProductType?: string;
  presetVariant?: string;
};

export default function QuoteForm({ catalog, presetCategory, presetProductType, presetVariant }: Props) {
  const router = useRouter();
  const [category, setCategory] = useState(presetCategory || "");
  const [productType, setProductType] = useState(presetProductType || "");
  const [variant, setVariant] = useState(presetVariant || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const categoryData = catalog.find((c) => c.slug === category);
  const productData = categoryData?.products.find((p) => p.type === productType);
  const variants = productData?.variants ?? [];

  const productTypeOptions = useMemo(() => categoryData?.products ?? [], [categoryData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: form.get("fullName"),
      email: form.get("email"),
      phone: form.get("phone"),
      category,
      productType,
      variant,
      quantity: form.get("quantity"),
      details: form.get("details"),
    };

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submission failed");
      router.push("/quote/thank-you");
    } catch {
      setError("Something went wrong — please try again, or email us directly.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <Field label="Full Name" required>
          <input name="fullName" required placeholder="John Doe" className={inputClass} />
        </Field>
        <Field label="Email Address" required>
          <input type="email" name="email" required placeholder="john@example.com" className={inputClass} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <Field label="Product Category" required>
          <select
            required
            className={inputClass}
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setProductType("");
              setVariant("");
            }}
          >
            <option value="">Select a category</option>
            {catalog.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Product Type" required>
          <select
            required
            className={inputClass}
            value={productType}
            disabled={!category}
            onChange={(e) => {
              setProductType(e.target.value);
              setVariant("");
            }}
          >
            <option value="">{category ? "Select product type" : "Select category first"}</option>
            {productTypeOptions.map((p) => (
              <option key={p.slug} value={p.type}>{p.type}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {variants.length > 0 && (
          <Field label="Style / Finish">
            <select className={inputClass} value={variant} onChange={(e) => setVariant(e.target.value)}>
              <option value="">Select style / finish</option>
              {variants.map((v) => (
                <option key={v.id ?? v.name} value={v.name}>{v.name}</option>
              ))}
            </select>
          </Field>
        )}
        <Field label="Quantity" required hint="25 unit minimum">
          <input type="number" name="quantity" min={25} required placeholder="e.g. 100" className={inputClass} />
        </Field>
      </div>

      <Field label="Specific Requirements">
        <textarea
          name="details"
          rows={3}
          placeholder="Describe your quantity, material preference, and deadline..."
          className={inputClass}
        />
      </Field>

      {error && <p className="text-sm text-red-700 mt-4">{error}</p>}

      <div className="flex items-center gap-3 mt-8">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center h-[52px] px-8 rounded-full bg-ink text-on-dark font-medium disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Quote Request"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full text-base bg-transparent border-0 border-b-[1.5px] border-line py-2.5 px-0.5 focus:border-ink focus:outline-none";

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
      <label className="block font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-2">
        {label}
        {required && " *"}
      </label>
      {children}
      {hint && <span className="block font-mono-ui text-[11px] uppercase text-ink-faint mt-1.5">{hint}</span>}
    </div>
  );
}
