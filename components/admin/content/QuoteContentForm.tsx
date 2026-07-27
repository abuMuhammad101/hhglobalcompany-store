"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuoteContent } from "@/lib/content";
import { Section, Field, SaveBar, saveJson, type SavingState, inputClass } from "@/components/admin/FormKit";

export default function QuoteContentForm({ initial }: { initial: QuoteContent }) {
  const router = useRouter();
  const [content, setContent] = useState<QuoteContent>(initial);
  const [saving, setSaving] = useState<SavingState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    try {
      await saveJson("/api/admin/content/quote", "PATCH", content);
      router.refresh();
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1500);
    } catch {
      setSaving("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section title="Quote Page Intro">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input
              value={content.intro.eyebrow}
              onChange={(e) => setContent((c) => ({ ...c, intro: { ...c.intro, eyebrow: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={content.intro.heading}
              onChange={(e) => setContent((c) => ({ ...c, intro: { ...c.intro, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Body Text">
            <textarea
              value={content.intro.body}
              onChange={(e) => setContent((c) => ({ ...c, intro: { ...c.intro, body: e.target.value } }))}
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Thank-You Page" hint="Shown after a quote request is submitted.">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input
              value={content.thankYou.eyebrow}
              onChange={(e) => setContent((c) => ({ ...c, thankYou: { ...c.thankYou, eyebrow: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={content.thankYou.heading}
              onChange={(e) => setContent((c) => ({ ...c, thankYou: { ...c.thankYou, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Body Text">
            <textarea
              value={content.thankYou.body}
              onChange={(e) => setContent((c) => ({ ...c, thankYou: { ...c.thankYou, body: e.target.value } }))}
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <SaveBar saving={saving} />
    </form>
  );
}
