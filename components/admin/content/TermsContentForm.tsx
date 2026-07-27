"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TermsContent } from "@/lib/content";
import { Section, Field, SaveBar, saveJson, type SavingState, inputClass } from "@/components/admin/FormKit";

export default function TermsContentForm({ initial }: { initial: TermsContent }) {
  const router = useRouter();
  const [content, setContent] = useState<TermsContent>(initial);
  const [saving, setSaving] = useState<SavingState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    try {
      await saveJson("/api/admin/content/terms", "PATCH", content);
      router.refresh();
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1500);
    } catch {
      setSaving("error");
    }
  }

  function updateSection(index: number, patch: Partial<TermsContent["sections"][number]>) {
    setContent((c) => ({
      ...c,
      sections: c.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    }));
  }

  function updateFactCard(sectionIndex: number, cardIndex: number, field: "num" | "label", value: string) {
    setContent((c) => ({
      ...c,
      sections: c.sections.map((s, i) =>
        i === sectionIndex
          ? { ...s, factCards: s.factCards.map((f, j) => (j === cardIndex ? { ...f, [field]: value } : f)) }
          : s
      ),
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section title="Page Intro">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input value={content.eyebrow} onChange={(e) => setContent((c) => ({ ...c, eyebrow: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Heading">
            <input value={content.heading} onChange={(e) => setContent((c) => ({ ...c, heading: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Intro Text">
            <textarea value={content.intro} onChange={(e) => setContent((c) => ({ ...c, intro: e.target.value }))} rows={2} className={inputClass} />
          </Field>
        </div>
      </Section>

      {content.sections.map((s, i) => (
        <Section key={s.id} title={s.heading || `Section ${i + 1}`}>
          <div className="space-y-6">
            <Field label="Section Heading">
              <input value={s.heading} onChange={(e) => updateSection(i, { heading: e.target.value })} className={inputClass} />
            </Field>
            {s.factCards.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {s.factCards.map((f, j) => (
                  <div key={j} className="border border-line rounded-lg p-4 space-y-3">
                    <Field label="Number">
                      <input value={f.num} onChange={(e) => updateFactCard(i, j, "num", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Label">
                      <input value={f.label} onChange={(e) => updateFactCard(i, j, "label", e.target.value)} className={inputClass} />
                    </Field>
                  </div>
                ))}
              </div>
            )}
            <Field label="Body Text" hint="Leave a blank line between paragraphs.">
              <textarea value={s.body} onChange={(e) => updateSection(i, { body: e.target.value })} rows={6} className={inputClass} />
            </Field>
          </div>
        </Section>
      ))}

      <Section title="Closing Note">
        <Field label="Text">
          <textarea value={content.closingNote} onChange={(e) => setContent((c) => ({ ...c, closingNote: e.target.value }))} rows={2} className={inputClass} />
        </Field>
      </Section>

      <SaveBar saving={saving} />
    </form>
  );
}
