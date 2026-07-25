import type { Metadata } from "next";
import Link from "next/link";
import { getCategory } from "@/lib/catalog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Leather Products — Wallets, Clutches, Card Holders & Belts",
  description:
    "Full-grain leather goods manufactured to order: long wallets, ladies' clutches, card holders, men's wallets and belts, in plain, mild and plated finishes.",
};

export default async function LeatherPage() {
  const category = await getCategory("leather");
  if (!category) return null;

  return (
    <main className="py-16">
      <div className="max-w-[1320px] mx-auto px-6">
        <span className="font-mono-ui text-[11px] uppercase tracking-wider text-ink-muted mb-3 block">
          Catalogue — {category.catalogueNumber}
        </span>
        <h1 className="text-[clamp(32px,5vw,52px)] font-medium tracking-tight mb-4">{category.name}</h1>
        <p className="text-ink-muted max-w-[50ch] mb-10">{category.description}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-8 border-t border-line">
          {category.products.map((p) => {
            const cardImageUrl = p.images[0]?.imageUrl ?? p.variants.find((v) => v.imageUrl)?.imageUrl ?? null;
            return (
              <Link key={p.slug} href={`/product/${p.slug}`}>
                <article>
                  <div
                    className="aspect-[4/3] mb-4 flex items-center justify-center font-mono-ui text-[11px] uppercase tracking-wide text-ink-faint bg-cover bg-center rounded-xl overflow-hidden"
                    style={
                      cardImageUrl
                        ? { backgroundImage: `url(${cardImageUrl})` }
                        : { background: "radial-gradient(120% 100% at 40% 10%, #F3E4D0 0%, #D9B98C 60%, #B98A5C 100%)" }
                    }
                  >
                    {!cardImageUrl && `${p.type} photo`}
                  </div>
                  <h3 className="text-[17px] font-medium mb-3">{p.type}</h3>
                  <ul className="flex flex-col gap-2">
                    {p.variants.map((v) => (
                      <li key={v.name} className="text-[13.5px] text-ink-muted pl-4 relative before:content-['•'] before:absolute before:left-0">
                        {v.name}
                      </li>
                    ))}
                  </ul>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
