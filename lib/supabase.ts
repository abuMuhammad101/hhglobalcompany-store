import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SECRET_KEY;

// Returns null if the store owner hasn't connected Supabase yet.
// The site still works without it — quotes just arrive by email only.
export function getSupabase() {
  if (!url || !key) return null;
  return createClient(url, key);
}

export type QuoteRow = {
  id?: number;
  created_at?: string;
  full_name: string;
  email: string;
  phone: string;
  category: string;
  product_type: string;
  variant: string | null;
  quantity: number;
  details: string | null;
  status?: string;
};
