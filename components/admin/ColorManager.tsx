"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Color = { id: string; name: string; sort_order: number; is_active: boolean };

export default function ColorManager({
  categoryId,
  initialColors,
}: {
  categoryId: string;
  initialColors: Color[];
}) {
  const router = useRouter();
  const [colors, setColors] = useState(
    initialColors.slice().sort((a, b) => a.sort_order - b.sort_order)
  );
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [reordering, setReordering] = useState(false);

  async function addColor(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setAdding(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, name: newName }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || "Couldn't add that color.");
      setColors((cur) => [...cur, body.color]);
      setNewName("");
      router.refresh();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Couldn't add that color.");
    } finally {
      setAdding(false);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= colors.length || reordering) return;
    const next = colors.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setColors(next);
    setReordering(true);
    const res = await fetch("/api/admin/colors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((c) => c.id) }),
    });
    setReordering(false);
    if (!res.ok) {
      setColors(colors);
      alert("Couldn't reorder colors — please try again.");
      return;
    }
    router.refresh();
  }

  async function rename(id: string, name: string) {
    const res = await fetch(`/api/admin/colors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      alert("Couldn't save that name — please try again.");
      return false;
    }
    router.refresh();
    return true;
  }

  async function toggleActive(id: string, isActive: boolean) {
    setColors((cur) => cur.map((c) => (c.id === id ? { ...c, is_active: isActive } : c)));
    const res = await fetch(`/api/admin/colors/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    if (!res.ok) {
      setColors((cur) => cur.map((c) => (c.id === id ? { ...c, is_active: !isActive } : c)));
      alert("Couldn't save that change — please try again.");
      return;
    }
    router.refresh();
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Remove color "${name}"?`)) return;
    const res = await fetch(`/api/admin/colors/${id}`, { method: "DELETE" });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.ok) {
      alert(body.error || "Couldn't remove that color — please try again.");
      return;
    }
    setColors((cur) => cur.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div>
      <h3 className="text-sm font-medium uppercase tracking-wide mb-1">Colors</h3>
      <p className="text-xs text-ink-faint mb-4 max-w-[52ch]">
        Shared across every product in this category — e.g. &quot;Black&quot;, &quot;Brown&quot;.
        Each product&apos;s style/finish options (Small, Regular, Large, etc.) can then offer a
        photo for any of these colors. Disabling one hides it from that option; deleting one is
        only allowed once no option uses it anymore.
      </p>

      {colors.length > 0 && (
        <ul className="mb-4 space-y-2">
          {colors.map((c, i) => (
            <ColorRow
              key={c.id}
              color={c}
              index={i}
              total={colors.length}
              onMove={(dir) => move(i, dir)}
              onRename={(name) => rename(c.id, name)}
              onToggleActive={(active) => toggleActive(c.id, active)}
              onDelete={() => remove(c.id, c.name)}
            />
          ))}
        </ul>
      )}

      <form onSubmit={addColor} className="flex items-center gap-3">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New color, e.g. Tan"
          className="flex-1 text-sm border border-line rounded px-3 py-2 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={adding || !newName.trim()}
          className="shrink-0 h-9 px-4 rounded-full bg-ink text-on-dark text-xs font-medium disabled:opacity-60"
        >
          {adding ? "Adding..." : "+ Add"}
        </button>
      </form>
      {addError && <p className="text-xs text-red-700 mt-2">{addError}</p>}
    </div>
  );
}

function ColorRow({
  color,
  index,
  total,
  onMove,
  onRename,
  onToggleActive,
  onDelete,
}: {
  color: Color;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onRename: (name: string) => Promise<boolean>;
  onToggleActive: (active: boolean) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(color.name);
  const [saving, setSaving] = useState<"idle" | "saving" | "error">("idle");

  async function handleBlur() {
    if (!name.trim() || name === color.name) return;
    setSaving("saving");
    const ok = await onRename(name);
    setSaving(ok ? "idle" : "error");
  }

  return (
    <li className="flex items-center gap-3 border border-line rounded-lg px-3 py-2">
      <div className="flex flex-col shrink-0">
        <button
          type="button"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          aria-label="Move earlier"
          className="w-5 h-5 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove(1)}
          disabled={index === total - 1}
          aria-label="Move later"
          className="w-5 h-5 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-30"
        >
          ↓
        </button>
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        className="flex-1 min-w-0 text-sm border border-line rounded px-2.5 py-1.5 focus:border-ink focus:outline-none"
      />

      {saving === "error" && <span className="text-xs text-red-700 shrink-0">Couldn&apos;t save</span>}

      <label className="flex items-center gap-1.5 text-xs text-ink-muted shrink-0 cursor-pointer">
        <input
          type="checkbox"
          checked={color.is_active}
          onChange={(e) => onToggleActive(e.target.checked)}
          className="accent-ink"
        />
        Active
      </label>

      <button
        type="button"
        onClick={onDelete}
        className="text-xs text-ink-muted hover:text-red-700 shrink-0"
      >
        Delete
      </button>
    </li>
  );
}
