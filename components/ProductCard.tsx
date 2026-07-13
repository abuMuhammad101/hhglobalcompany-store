import Link from "next/link";
import type { Product } from "@/lib/catalog";

const gradients = [
  "linear-gradient(160deg,#EFEDE6,#D7D3C6)",
  "linear-gradient(160deg,#DDE0DA,#AEB3A8)",
  "linear-gradient(160deg,#E7D9C9,#B98A5C)",
  "linear-gradient(160deg,#F3D9A8,#9DACA6)",
];

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <article>
      <div
        className="aspect-[3/4] mb-3 flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint bg-cover bg-center"
        style={
          product.imageUrl
            ? { backgroundImage: `url(${product.imageUrl})` }
            : { background: gradients[index % gradients.length] }
        }
      >
        {!product.imageUrl && `${product.type} photo`}
      </div>
      <div className="flex justify-between items-baseline gap-3">
        <span className="text-[15px] font-medium">{product.name}</span>
        <Link
          href={`/quote?type=${encodeURIComponent(product.type)}`}
          className="font-mono-ui text-[12px] uppercase tracking-wide border-b border-ink shrink-0"
        >
          Enquire
        </Link>
      </div>
      <span className="block font-mono-ui text-[11px] uppercase tracking-wide text-ink-muted mt-0.5">
        {product.type} / {product.material}
      </span>
    </article>
  );
}
