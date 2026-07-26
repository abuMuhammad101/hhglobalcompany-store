"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/types";
import QuoteImageUploader from "@/components/QuoteImageUploader";
import Button from "@/components/Button";

type Props = {
  catalog: Category[];
  presetCategory?: string;
  presetProductType?: string;
  presetVariant?: string;
};

type QuoteItem = {
  category: string;
  productType: string;
  variant: string;
  colorPreference: string;
  quantity: string;
  imageUrl: string | null;
  itemNotes: string;
};

function emptyItem(): QuoteItem {
  return { category: "", productType: "", variant: "", colorPreference: "", quantity: "", imageUrl: null, itemNotes: "" };
}

export default function QuoteForm({ catalog, presetCategory, presetProductType, presetVariant }: Props) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<QuoteItem[]>([
    { ...emptyItem(), category: presetCategory || "", productType: presetProductType || "", variant: presetVariant || "" },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateItem(index: number, patch: Partial<QuoteItem>) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      fullName,
      email,
      phone,
      notes,
      items: items.map((it) => ({ ...it, quantity: Number(it.quantity) })),
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
    <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-line bg-bg-soft p-6 sm:p-8">
      <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-6 block">
        Request Form
      </span>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <Field label="Full Name" required>
          <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className={inputClass} />
        </Field>
        <Field label="Email Address" required>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className={inputClass} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        <Field label="Phone">
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" className={inputClass} />
        </Field>
      </div>

      <div className="space-y-6">
        {items.map((item, i) => (
          <QuoteItemCard
            key={i}
            index={i}
            item={item}
            catalog={catalog}
            onChange={(patch) => updateItem(i, patch)}
            onRemove={items.length > 1 ? () => removeItem(i) : undefined}
          />
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addItem} className="mt-6">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Add Another Product
      </Button>

      <div className="mt-10">
        <Field label="Anything Else We Should Know?">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Timeline, delivery destination, budget range..."
            className={inputClass}
          />
        </Field>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 mt-6 p-3.5 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-3 mt-8">
        <Button type="submit" variant="accent" size="lg" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Quote Request"}
        </Button>
      </div>
    </form>
  );
}

function QuoteItemCard({
  index,
  item,
  catalog,
  onChange,
  onRemove,
}: {
  index: number;
  item: QuoteItem;
  catalog: Category[];
  onChange: (patch: Partial<QuoteItem>) => void;
  onRemove?: () => void;
}) {
  const categoryData = catalog.find((c) => c.slug === item.category);
  const productData = categoryData?.products.find((p) => p.type === item.productType);
  const variants = productData?.variants ?? [];

  return (
    <div className="border border-line rounded-2xl p-5 sm:p-6 bg-bg relative">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-ink text-on-dark font-mono-ui text-[11px] flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <span className="font-mono-ui text-[11px] uppercase tracking-wide text-ink-muted">Product {index + 1}</span>
        </div>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-xs text-ink-muted hover:text-red-700">
            Remove
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        <Field label="Product Category" required>
          <SelectField
            required
            value={item.category}
            onChange={(e) => onChange({ category: e.target.value, productType: "", variant: "" })}
          >
            <option value="">Select a category</option>
            {catalog.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </SelectField>
        </Field>
        <Field label="Product Type" required>
          <SelectField
            required
            value={item.productType}
            disabled={!item.category}
            onChange={(e) => onChange({ productType: e.target.value, variant: "" })}
          >
            <option value="">{item.category ? "Select product type" : "Select category first"}</option>
            {(categoryData?.products ?? []).map((p) => (
              <option key={p.slug} value={p.type}>{p.type}</option>
            ))}
          </SelectField>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {variants.length > 0 && (
          <Field label="Style / Finish">
            <SelectField value={item.variant} onChange={(e) => onChange({ variant: e.target.value })}>
              <option value="">Select style / finish</option>
              {variants.map((v) => (
                <option key={v.id ?? v.name} value={v.name}>{v.name}</option>
              ))}
            </SelectField>
          </Field>
        )}
        <Field label="Preferred Color(s)" hint="Optional — we'll confirm availability">
          <input
            value={item.colorPreference}
            onChange={(e) => onChange({ colorPreference: e.target.value })}
            placeholder="e.g. Black, Tan"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mb-6">
        <Field label="Quantity" required hint="25 unit minimum">
          <input
            type="number"
            min={25}
            required
            value={item.quantity}
            onChange={(e) => onChange({ quantity: e.target.value })}
            placeholder="e.g. 100"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="mb-6">
        <QuoteImageUploader
          value={item.imageUrl}
          onChange={(url) => onChange({ imageUrl: url })}
          label="Reference Photo (optional)"
          hint="Especially useful for custom garments"
        />
      </div>

      <Field label="Notes for This Item">
        <textarea
          value={item.itemNotes}
          onChange={(e) => onChange({ itemNotes: e.target.value })}
          rows={2}
          placeholder="Fabric weight, stitching detail, sizing..."
          className={inputClass}
        />
      </Field>
    </div>
  );
}

const inputClass =
  "w-full text-base bg-bg rounded-lg border border-line px-3.5 py-2.5 focus:outline-none focus:border-ink focus:ring-2 focus:ring-accent-soft transition-colors disabled:opacity-60 disabled:cursor-not-allowed";

function SelectField({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`${inputClass} appearance-none pr-9 ${className}`} />
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
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
      <label className="block font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-2">
        {label}
        {required && " *"}
      </label>
      {children}
      {hint && <span className="block font-mono-ui text-[11px] uppercase text-ink-faint mt-1.5">{hint}</span>}
    </div>
  );
}
