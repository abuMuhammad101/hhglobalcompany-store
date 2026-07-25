import heroFallback from "@/data/hero-slides.json";
import { getSupabase } from "./supabase";

export type HeroSlide = {
  id?: string;
  label: string;
  imageUrl: string | null;
};

function fallbackSlides(): HeroSlide[] {
  return heroFallback as HeroSlide[];
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const supabase = getSupabase();
  if (!supabase) return fallbackSlides();

  const { data, error } = await supabase
    .from("hero_slides")
    .select("id, image_url, label, sort_order")
    .order("sort_order");

  if (error || !data || data.length === 0) return fallbackSlides();

  return data.map((s) => ({ id: s.id, label: s.label ?? "", imageUrl: s.image_url }));
}
