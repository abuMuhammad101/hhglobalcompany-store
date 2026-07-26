"use client";

import { useState } from "react";
import type { QuoteRow as QuoteRowType, QuoteItemRow } from "@/lib/types";

const STATUS_OPTIONS = ["new", "contacted", "quoted", "won", "lost"];

export default function QuoteRow({ quote }: { quote: QuoteRowType }) {
  const [status, setStatus] = useState(quote.status || "new");
  const [notes, setNotes] = useState(quote.notes || "");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");

  async function save(patch: { status?: string; notes?: string }) {
    setSaving("saving");
    try {
      await fetch(`/api/admin/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1200);
    } catch {
      setSaving("idle");
    }
  }

  const items = quote.quote_items ?? [];

  return (
    <tr className="border-b border-line align-top">
      <td className="py-3 px-4 whitespace-nowrap text-ink-muted">
        {quote.created_at ? new Date(quote.created_at).toLocaleDateString() : "—"}
      </td>
      <td className="py-3 px-4">
        <div className="font-medium">{quote.full_name}</div>
        <div className="text-ink-muted text-xs">{quote.email}</div>
        {quote.phone && <div className="text-ink-muted text-xs">{quote.phone}</div>}
      </td>
      <td className="py-3 px-4">
        {items.length > 0 ? (
          <div className="space-y-3">
            {items.map((item, i) => (
              <QuoteItemSummary key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          // Legacy fallback — quotes from before line items existed.
          <div>
            <div>{quote.category} / {quote.product_type}</div>
            {quote.variant && <div className="text-ink-muted text-xs">{quote.variant}</div>}
            <div className="text-ink-muted text-xs">Qty: {quote.quantity}</div>
          </div>
        )}
        {quote.details && (
          <div className="text-ink-muted text-xs mt-2 max-w-[300px] border-t border-line pt-2">
            <span className="font-medium">Anything else: </span>
            {quote.details}
          </div>
        )}
      </td>
      <td className="py-3 px-4">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => save({ notes })}
          placeholder="Add a note..."
          rows={2}
          className="w-full text-sm border border-line rounded px-2 py-1.5 focus:border-ink focus:outline-none"
        />
      </td>
      <td className="py-3 px-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            save({ status: e.target.value });
          }}
          className="text-sm border border-line rounded px-2 py-1.5 capitalize focus:border-ink focus:outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <div className="text-[10px] text-ink-faint mt-1 h-3">
          {saving === "saving" && "Saving..."}
          {saving === "saved" && "Saved"}
        </div>
      </td>
    </tr>
  );
}

function QuoteItemSummary({ item, index }: { item: QuoteItemRow; index: number }) {
  return (
    <div className="flex gap-2.5">
      {item.image_url && (
        <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
          <span
            className="block w-10 h-10 rounded border border-line bg-cover bg-center"
            style={{ backgroundImage: `url(${item.image_url})` }}
          />
        </a>
      )}
      <div>
        <div className="text-xs text-ink-faint">Item {index + 1}</div>
        <div>{item.category} / {item.product_type}</div>
        {item.variant && <div className="text-ink-muted text-xs">{item.variant}</div>}
        {item.color_preference && <div className="text-ink-muted text-xs">Color: {item.color_preference}</div>}
        <div className="text-ink-muted text-xs">Qty: {item.quantity}</div>
        {item.item_notes && <div className="text-ink-muted text-xs">{item.item_notes}</div>}
      </div>
    </div>
  );
}
