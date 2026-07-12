"use client";

import { useState } from "react";
import type { QuoteRow as QuoteRowType } from "@/lib/types";

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
        <div>{quote.category} / {quote.product_type}</div>
        {quote.variant && <div className="text-ink-muted text-xs">{quote.variant}</div>}
        {quote.details && (
          <div className="text-ink-muted text-xs mt-1 max-w-[260px]">{quote.details}</div>
        )}
      </td>
      <td className="py-3 px-4">{quote.quantity}</td>
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
