import contentFallback from "@/data/content.json";
import { getSupabase } from "./supabase";

export type HomeContent = {
  hero: { heading: string; subcopy: string };
  about: { eyebrow: string; heading: string; body: string };
  process: { eyebrow: string; heading: string; steps: { title: string; description: string }[] };
  cta: { eyebrow: string; heading: string };
};

export type CompanyStats = {
  years: { num: string; label: string };
  orders: { num: string; label: string };
  minUnits: { num: string; label: string };
  turnaround: { num: string; label: string };
};

export type AboutContent = {
  hero: { eyebrow: string; heading: string; body: string };
  story: { heading: string; body: string };
  offer: { eyebrow: string; heading: string; offerings: { title: string }[] };
  closingCta: { badge: string; heading: string; body: string };
};

export type ContactContent = {
  eyebrow: string;
  heading: string;
  email: string;
  phone: string;
  address: string;
};

export type QuoteContent = {
  intro: { eyebrow: string; heading: string; body: string };
  thankYou: { eyebrow: string; heading: string; body: string };
};

export type FooterContent = {
  tagline: string;
  social: { instagram: string; linkedin: string; behance: string };
  copyrightLine: string;
  geoLine: string;
};

export type TermsSection = {
  id: string;
  heading: string;
  factCards: { num: string; label: string }[];
  body: string;
};

export type TermsContent = {
  eyebrow: string;
  heading: string;
  intro: string;
  sections: TermsSection[];
  closingNote: string;
};

type ContentMap = {
  home: HomeContent;
  company_stats: CompanyStats;
  about: AboutContent;
  contact: ContactContent;
  quote: QuoteContent;
  footer: FooterContent;
  terms: TermsContent;
};

export type PageKey = keyof ContentMap;
export const PAGE_KEYS: PageKey[] = ["home", "company_stats", "about", "contact", "quote", "footer", "terms"];

const fallback = contentFallback as ContentMap;

async function getPageContent<K extends PageKey>(pageKey: K): Promise<ContentMap[K]> {
  const supabase = getSupabase();
  if (!supabase) return fallback[pageKey];

  const { data, error } = await supabase
    .from("page_content")
    .select("content")
    .eq("page_key", pageKey)
    .single();

  if (error || !data) return fallback[pageKey];
  return data.content as ContentMap[K];
}

export function getHomeContent() {
  return getPageContent("home");
}
export function getCompanyStats() {
  return getPageContent("company_stats");
}
export function getAboutContent() {
  return getPageContent("about");
}
export function getContactContent() {
  return getPageContent("contact");
}
export function getQuoteContent() {
  return getPageContent("quote");
}
export function getFooterContent() {
  return getPageContent("footer");
}
export function getTermsContent() {
  return getPageContent("terms");
}

/** Splits a body-text field on blank lines into separate paragraphs for rendering. */
export function paragraphs(body: string): string[] {
  return body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}
