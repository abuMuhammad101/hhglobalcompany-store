"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error(body.error || "Incorrect username or password.");
      const next = searchParams.get("next") || "/admin";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-bg-soft">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-bg border border-line rounded-2xl p-8">
        <span className="text-xl text-ink-faint mb-3 block">*</span>
        <h1 className="text-2xl font-medium mb-1">Admin Login</h1>
        <p className="text-sm text-ink-muted mb-8">HH Global Company — internal access only.</p>

        <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
          Username
        </label>
        <input
          autoFocus
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full text-base border border-line rounded px-3 py-2.5 mb-5 focus:border-ink focus:outline-none"
        />

        <label className="block text-xs font-medium uppercase tracking-wide text-ink-muted mb-2">
          Password
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full text-base border border-line rounded px-3 py-2.5 mb-6 focus:border-ink focus:outline-none"
        />

        {error && <p className="text-sm text-red-700 mb-5">{error}</p>}

        <button
          type="submit"
          disabled={submitting || !username || !password}
          className="w-full h-11 rounded-full bg-ink text-on-dark text-sm font-medium disabled:opacity-60"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
