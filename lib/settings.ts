import settingsFallback from "@/data/settings.json";
import { getSupabase } from "./supabase";

export type SiteSettings = {
  logoUrl: string | null;
  brandName: string;
};

const DEFAULT_BRAND_NAME = "H&H Global";

function fallbackSettings(): SiteSettings {
  return { brandName: DEFAULT_BRAND_NAME, ...settingsFallback } as SiteSettings;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();
  if (!supabase) return fallbackSettings();

  const { data, error } = await supabase.from("site_settings").select("key, value");
  if (error || !data) return fallbackSettings();

  const map = Object.fromEntries(data.map((row) => [row.key, row.value]));
  return {
    logoUrl: map.logo_url ?? null,
    brandName: map.brand_name || DEFAULT_BRAND_NAME,
  };
}
