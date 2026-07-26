"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CompanyStats } from "@/lib/content";
import { Section, Field, SaveBar, inputClass } from "@/components/admin/FormKit";

const STAT_KEYS = ["years", "orders", "minUnits", "turnaround"] as const;

export default function CompanyStatsForm({ initial }: { initial: CompanyStats }) {
  const router = useRouter();
  const [stats, setStats] = useState<CompanyStats>(initial);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    await fetch("/api/admin/content/company_stats", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stats),
    });
    router.refresh();
    setSaving("saved");
    setTimeout(() => setSaving("idle"), 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section title="Company Stats" hint="These four numbers also appear on the About page.">
        <div className="grid sm:grid-cols-2 gap-6">
          {STAT_KEYS.map((key) => (
            <div key={key} className="border border-line rounded-lg p-4 space-y-3">
              <Field label="Number">
                <input
                  value={stats[key].num}
                  onChange={(e) => setStats((s) => ({ ...s, [key]: { ...s[key], num: e.target.value } }))}
                  className={inputClass}
                />
              </Field>
              <Field label="Label">
                <input
                  value={stats[key].label}
                  onChange={(e) => setStats((s) => ({ ...s, [key]: { ...s[key], label: e.target.value } }))}
                  className={inputClass}
                />
              </Field>
            </div>
          ))}
        </div>
      </Section>
      <SaveBar saving={saving} />
    </form>
  );
}
