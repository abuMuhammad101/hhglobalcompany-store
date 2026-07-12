"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${productName}"? This also removes its variants and can't be undone.`)) {
      return;
    }
    setBusy(true);
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={busy}
      className="text-xs text-ink-muted hover:text-red-700 disabled:opacity-50"
    >
      {busy ? "Deleting..." : "Delete"}
    </button>
  );
}
