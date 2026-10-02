import type { ReactNode } from "react";
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { RevealGrid } from "./RevealGrid";
import { JsonLd } from "./JsonLd";
import { breadcrumbs } from "@/lib/seo";
import type { Product } from "@/lib/products";
import { site } from "@/site.config";

type Props = {
  title: string;
  intro?: string;
  path: string; // canonical path of this page
  crumbs: [string, string][];
  products: Product[];
  /** Which filter chip is active */
  active?: { style?: string; category?: string; price?: string };
  /** Shown between the filter chips and the listings, for example related guides */
  lead?: ReactNode;
  /** Heading above the listings; set it when there is something above them */
  productsHeading?: string;
};

export function CollectionView({ title, intro, path, crumbs, products, active = {}, lead, productsHeading }: Props) {
  const sold = products.filter((p) => p.status === "sold").length;
  const available = products.length - sold;

  return (
    <div className="wrap">
      <JsonLd data={breadcrumbs(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description: intro,
          url: `${site.url}${path}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: products.length,
            itemListElement: products.slice(0, 30).map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${site.url}/shop/${p.slug}`,
              name: p.title,
            })),
          },
        }}
      />

      <header className="page-head">
        {crumbs.length > 2 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            {crumbs.slice(1, -1).map(([name, href]) => (
              <span key={href}>
                <Link href={href}>{name}</Link>
                <span aria-hidden> / </span>
              </span>
            ))}
          </nav>
        )}
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
        <p className="count">
          {available} available{sold ? `, ${sold} sold` : ""}
        </p>
      </header>

      <nav className="chips" aria-label="Browse by style">
        <Link href="/shop" className="chip" aria-current={!active.style && !active.category && !active.price ? "page" : undefined}>
          All
        </Link>
        {site.styles.map((s) => (
          <Link
            key={s.id}
            href={`/shop/style/${s.id}`}
            className="chip"
            aria-current={active.style === s.id ? "page" : undefined}
          >
            {s.label}
          </Link>
        ))}
        {site.categories
          .filter((c) => c.id !== "art")
          .map((c) => (
            <Link
              key={c.id}
              href={`/shop/category/${c.id}`}
              className="chip"
              aria-current={active.category === c.id ? "page" : undefined}
            >
              {c.label}
            </Link>
          ))}
      </nav>

      {lead}

      {productsHeading && (
        <div className="section-head products-head">
          <h2>{productsHeading}</h2>
        </div>
      )}

      {products.length ? (
        <RevealGrid>
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} eager={i < 4} lcp={i === 0} />
          ))}
        </RevealGrid>
      ) : (
        <div className="empty">
          <p>Nothing here right now. New pieces are added often.</p>
          <p>
            <Link href="/shop">See everything available</Link>
          </p>
        </div>
      )}
    </div>
  );
}
