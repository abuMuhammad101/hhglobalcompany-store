export type Variant = {
  id?: string;
  name: string;
  imageUrl?: string | null;
};

export type Product = {
  id?: string;
  slug: string;
  name: string;
  type: string;
  material: string;
  description: string;
  imageUrl?: string | null;
  variants: Variant[];
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
};
