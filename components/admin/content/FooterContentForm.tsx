"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FooterContent } from "@/lib/content";
import { Section, Field, SaveBar, inputClass } from "@/components/admin/FormKit";

export default function FooterContentForm({ initial }: { initial: FooterContent }) {
  const router = useRouter();
  const [content, setContent] = useState<FooterContent>(initial);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    await fetch("/api/admin/content/footer", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    router.refresh();
    setSaving("saved");
    setTimeout(() => setSaving("idle"), 1500);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section title="Footer">
        <div className="space-y-6">
          <Field label="Tagline">
            <textarea value={content.tagline} onChange={(e) => setContent((c) => ({ ...c, tagline: e.target.value }))} rows={3} className={inputClass} />
          </Field>
          <Field label="Copyright Line" hint="The year is added automatically in front of this.">
            <input value={content.copyrightLine} onChange={(e) => setContent((c) => ({ ...c, copyrightLine: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Location Line">
            <input value={content.geoLine} onChange={(e) => setContent((c) => ({ ...c, geoLine: e.target.value }))} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Social Links">
        <div className="space-y-6">
          <Field label="Instagram URL">
            <input
              value={content.social.instagram}
              onChange={(e) => setContent((c) => ({ ...c, social: { ...c.social, instagram: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              value={content.social.linkedin}
              onChange={(e) => setContent((c) => ({ ...c, social: { ...c.social, linkedin: e.target.value } }))}
              className={inputClass}
            />
          </Field>
          <Field label="Behance URL">
            <input
              value={content.social.behance}
              onChange={(e) => setContent((c) => ({ ...c, social: { ...c.social, behance: e.target.value } }))}
              className={inputClass}
            />
          </Field>
        </div>
      </Section>

      <SaveBar saving={saving} />
    </form>
  );
}
