import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { listPublicProducts } from "@/lib/products";
import { site, categoryLabel } from "@/site.config";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ c?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { c } = await searchParams;
  const valid = site.categories.some((x) => x.id === c);
  const title = valid ? `${categoryLabel(c!)} for sale` : "Shop original art and collected pieces";
  return {
    title,
    description: valid
      ? `Original ${categoryLabel(c!).toLowerCase()} by ${site.name}. One of a kind, couriered NZ-wide.`
      : `Shop original artworks and one-of-a-kind pieces by NZ artist ${site.name}. Every piece is a single original, couriered NZ-wide.`,
    alternates: { canonical: valid ? `/shop?c=${c}` : "/shop" },
  };
}

export default async function Shop({ searchParams }: Props) {
  const { c } = await searchParams;
  const category = site.categories.some((x) => x.id === c) ? c : undefined;
  const products = await listPublicProducts({ category });
  const sold = products.filter((p) => p.status === "sold").length;
  const available = products.length - sold;

  return (
    <div className="wrap">
      <header className="page-head">
        <h1>{category ? categoryLabel(category) : "Shop"}</h1>
        <p>
          {available} available{sold ? `, ${sold} sold` : ""}
        </p>
      </header>

      <nav className="chips" aria-label="Categories">
        <Link href="/shop" className="chip" aria-current={!category ? "page" : undefined}>
          All
        </Link>
        {site.categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?c=${cat.id}`}
            className="chip"
            aria-current={category === cat.id ? "page" : undefined}
          >
            {cat.label}
          </Link>
        ))}
      </nav>

      {products.length ? (
        <div className="grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 4} />
          ))}
        </div>
      ) : (
        <p className="empty">Nothing here yet. Try another category or check back soon.</p>
      )}
    </div>
  );
}
