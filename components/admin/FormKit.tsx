export const inputClass =
  "w-full text-base bg-transparent border border-line rounded px-3 py-2.5 focus:border-ink focus:outline-none";

export type SavingState = "idle" | "saving" | "saved" | "error";

// Every admin form PATCHes/POSTs JSON and needs the same "did it actually
// work" check — plain fetch() only rejects on a network failure, not on a
// 4xx/5xx response, so callers must check res.ok themselves or a failed save
// silently reports success.
export async function saveJson(url: string, method: string, body: unknown): Promise<void> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || "Save failed.");
  }
}

export function Section({
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

export function Field({
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

export function SaveBar({
  saving,
  label = "Save Changes",
}: {
  saving: SavingState;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-5">
      <button
        type="submit"
        disabled={saving === "saving"}
        className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
      >
        {saving === "saving" ? "Saving..." : label}
      </button>
      {saving === "saved" && <span className="text-xs text-ink-muted">Saved</span>}
      {saving === "error" && <span className="text-xs text-red-700">Couldn&apos;t save — try again</span>}
    </div>
  );
}
