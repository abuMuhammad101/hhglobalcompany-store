export type VariantColor = {
  id?: string;
  name: string;
  imageUrl: string;
  /** Extra photos for this color beyond its cover photo (`imageUrl`), the
   * same relationship a product's Featured Image has to its Detail Photos. */
  images?: ProductImage[];
};

export type Variant = {
  id?: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
  colors?: VariantColor[];
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
  /** The single featured/cover photo — shown on shop pages, product listings,
   * and as the main product page photo. Separate from `images`, the detail
   * gallery. */
  imageUrl?: string | null;
  images: ProductImage[];
  variants: Variant[];
};

export type Category = {
  id?: string;
  slug: string;
  name: string;
  catalogueNumber: string;
  description: string;
  imageUrl?: string | null;
  isActive?: boolean;
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
