import Link from "next/link";
import type { Product } from "@/lib/catalog";

const gradients = [
  "linear-gradient(160deg,#EFEDE6,#D7D3C6)",
  "linear-gradient(160deg,#DDE0DA,#AEB3A8)",
  "linear-gradient(160deg,#F3E4D0,#D9B98C)",
  "linear-gradient(160deg,#E7D9C9,#B98A5C)",
  "linear-gradient(160deg,#D9CBB8,#8C6E4F)",
  "linear-gradient(160deg,#DDE0DA,#B9B3A0)",
];

export default function ProductCard({ product, index }: { product: Product; index: number }) {
  const coverImageUrl =
    product.imageUrl ?? product.images[0]?.imageUrl ?? product.variants.find((v) => v.imageUrl)?.imageUrl ?? null;
  const styleCount = product.variants.length;

  return (
    <Link href={`/product/${product.slug}`} className="group block focus-visible:outline-none">
      <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-2xl border border-line focus-visible:ring-2 focus-visible:ring-ink">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          style={
            coverImageUrl
              ? { backgroundImage: `url(${coverImageUrl})` }
              : { background: gradients[index % gradients.length] }
          }
        />
        {!coverImageUrl && (
          <span className="absolute inset-0 flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint">
            {product.type} photo
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {styleCount > 0 && (
          <span className="absolute top-3 left-3 font-mono-ui text-[10px] uppercase tracking-wide text-ink bg-bg/90 backdrop-blur px-2.5 py-1 rounded-full">
            {styleCount} {styleCount === 1 ? "Style" : "Styles"}
          </span>
        )}

        <span className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-bg text-ink flex items-center justify-center opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <span className="block text-[15px] font-medium group-hover:text-ink-muted transition-colors">
        {product.name}
      </span>
      <span className="block font-mono-ui text-[11px] uppercase tracking-wide text-ink-muted mt-1">
        {product.type}
        {product.material ? ` / ${product.material}` : ""}
      </span>
    </Link>
  );
}
