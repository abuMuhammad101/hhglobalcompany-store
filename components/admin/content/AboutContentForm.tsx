"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AboutContent } from "@/lib/content";
import { Section, Field, SaveBar, saveJson, type SavingState, inputClass } from "@/components/admin/FormKit";

export default function AboutContentForm({ initial }: { initial: AboutContent }) {
  const router = useRouter();
  const [content, setContent] = useState<AboutContent>(initial);
  const [saving, setSaving] = useState<SavingState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    try {
      await saveJson("/api/admin/content/about", "PATCH", content);
      router.refresh();
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1500);
    } catch {
      setSaving("error");
    }
  }

  function updateOffering(index: number, title: string) {
    setContent((c) => ({
      ...c,
      offer: { ...c.offer, offerings: c.offer.offerings.map((o, i) => (i === index ? { title } : o)) },
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section title="Hero">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input
              value={content.hero.eyebrow}
              onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, eyebrow: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={content.hero.heading}
              onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Body Text">
            <textarea
              value={content.hero.body}
              onChange={(e) => setContent((c) => ({ ...c, hero: { ...c.hero, body: e.target.value } }))}
              rows={4}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="Our Story">
        <div className="space-y-6">
          <Field label="Heading">
            <input
              value={content.story.heading}
              onChange={(e) => setContent((c) => ({ ...c, story: { ...c.story, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Body Text" hint="Leave a blank line between paragraphs.">
            <textarea
              value={content.story.body}
              onChange={(e) => setContent((c) => ({ ...c, story: { ...c.story, body: e.target.value } }))}
              rows={8}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <Section title="What We Offer" hint="Icons are fixed per position — only the titles below are editable.">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input
              value={content.offer.eyebrow}
              onChange={(e) => setContent((c) => ({ ...c, offer: { ...c.offer, eyebrow: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={content.offer.heading}
              onChange={(e) => setContent((c) => ({ ...c, offer: { ...c.offer, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            {content.offer.offerings.map((o, i) => (
              <Field key={i} label={`Offering ${i + 1}`}>
                <input value={o.title} onChange={(e) => updateOffering(i, e.target.value)} className={inputClass} />
              </Field>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Closing Call-to-Action">
        <div className="space-y-6">
          <Field label="Badge Label">
            <input
              value={content.closingCta.badge}
              onChange={(e) => setContent((c) => ({ ...c, closingCta: { ...c.closingCta, badge: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Heading">
            <input
              value={content.closingCta.heading}
              onChange={(e) => setContent((c) => ({ ...c, closingCta: { ...c.closingCta, heading: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Body Text">
            <textarea
              value={content.closingCta.body}
              onChange={(e) => setContent((c) => ({ ...c, closingCta: { ...c.closingCta, body: e.target.value } }))}
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
