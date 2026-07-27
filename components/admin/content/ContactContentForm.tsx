"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactContent } from "@/lib/content";
import { Section, Field, SaveBar, saveJson, type SavingState, inputClass } from "@/components/admin/FormKit";

export default function ContactContentForm({ initial }: { initial: ContactContent }) {
  const router = useRouter();
  const [content, setContent] = useState<ContactContent>(initial);
  const [saving, setSaving] = useState<SavingState>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving("saving");
    try {
      await saveJson("/api/admin/content/contact", "PATCH", content);
      router.refresh();
      setSaving("saved");
      setTimeout(() => setSaving("idle"), 1500);
    } catch {
      setSaving("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <Section title="Contact Page">
        <div className="space-y-6">
          <Field label="Eyebrow Label">
            <input value={content.eyebrow} onChange={(e) => setContent((c) => ({ ...c, eyebrow: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Heading">
            <input value={content.heading} onChange={(e) => setContent((c) => ({ ...c, heading: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Email">
            <input value={content.email} onChange={(e) => setContent((c) => ({ ...c, email: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input value={content.phone} onChange={(e) => setContent((c) => ({ ...c, phone: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Address">
            <input value={content.address} onChange={(e) => setContent((c) => ({ ...c, address: e.target.value }))} className={inputClass} />
          </Field>
        </div>
      </Section>
      <SaveBar saving={saving} />
    </form>
  );
}
