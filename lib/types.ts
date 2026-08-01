export type Variant = {
  id?: string;
  name: string;
  imageUrl?: string | null;
};

export type ProductImage = {
  id?: string;
  imageUrl: string;
};

export type Product = {
  id?: string;
  slug: string;
  name: string;
  type: string;
  material: string;
  description: string;
  images: ProductImage[];
  variants: Variant[];
  /** What to call the variant options on the product page — e.g. "Color" for
   * a garment, "Style / Finish" for a leather good. Defaults to "Style / Finish"
   * when not set. */
  variantLabel?: string;
};

export type Category = {
  id?: string;
  slug: string;
  name: string;
  catalogueNumber: string;
  description: string;
  imageUrl?: string | null;
  products: Product[];
};

export type QuoteItemRow = {
  id: string;
  category: string | null;
  product_type: string | null;
  variant: string | null;
  color_preference: string | null;
  quantity: number | null;
  image_url: string | null;
  item_notes: string | null;
  sort_order: number;
};

export type QuoteRow = {
  id: number;
  created_at?: string;
  updated_at?: string;
  full_name: string;
  email: string;
  phone: string | null;
  category: string;
  product_type: string;
  variant: string | null;
  quantity: number;
  details: string | null;
  status: string;
  notes: string | null;
  quote_items?: QuoteItemRow[];
};
