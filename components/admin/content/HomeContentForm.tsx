"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { HomeContent } from "@/lib/content";
import { Section, Field, SaveBar, inputClass } from "@/components/admin/FormKit";

export default function HomeContentForm({ initial }: { initial: HomeContent }) {
  const router = useRouter();
  const [content, setContent] = useState<HomeContent>(initial);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    await fetch("/api/admin/content/home", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    router.refresh();
    setSaving("saved");
    setTimeout(() => setSaving("idle"), 1500);
  }

  function updateStep(index: number, field: "title" | "description", value: string) {
    setContent((c) => ({
      ...c,
      process: {
        ...c.process,
        steps: c.process.steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
      },
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section title="Hero">
        <div className="space-y-6">
          <Field label="Heading">
            <input
              value={content.hero.heading}
              onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Subcopy">
            <textarea
              value={content.hero.subcopy}
              onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, subcopy: e.target.value } }))}
              rows={3}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="About Us Section" hint="Appears below the hero, with a link through to the full About page.">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input
              value={content.about.eyebrow}
              onChange={(e) => setContent((c) => ({ ...c, about: { ...c.about, eyebrow: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={content.about.heading}
              onChange={(e) => setContent((c) => ({ ...c, about: { ...c.about, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Body Text" hint="Leave a blank line between paragraphs.">
            <textarea
              value={content.about.body}
              onChange={(e) => setContent((c) => ({ ...c, about: { ...c.about, body: e.target.value } }))}
              rows={6}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="How It Works" hint="The four-step process section.">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input
              value={content.process.eyebrow}
              onChange={(e) => setContent((c) => ({ ...c, process: { ...c.process, eyebrow: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={content.process.heading}
              onChange={(e) => setContent((c) => ({ ...c, process: { ...c.process, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-6">
            {content.process.steps.map((step, i) => (
              <div key={i} className="border border-line rounded-lg p-4 space-y-3">
                <span className="block font-mono-ui text-xs uppercase tracking-wide text-ink-faint">Step {i + 1}</span>
                <Field label="Title">
                  <input value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Description">
                  <textarea value={step.description} onChange={(e) => updateStep(i, "description", e.target.value)} rows={2} className={inputClass} />
                </Field>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Bottom Call-to-Action">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input
              value={content.cta.eyebrow}
              onChange={(e) => setContent((c) => ({ ...c, cta: { ...c.cta, eyebrow: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={content.cta.heading}
              onChange={(e) => setContent((c) => ({ ...c, cta: { ...c.cta, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <SaveBar saving={saving} />
    </form>
  );
}
