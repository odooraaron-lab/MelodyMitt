import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "./Gallery";
import { JsonLd } from "@/components/JsonLd";
import { StatusPrice, productMeta } from "@/components/ProductCard";
import { getPublicProduct, publicStatus } from "@/lib/products";
import { formatNzd } from "@/lib/format";
import { site, categoryLabel } from "@/site.config";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ unavailable?: string; error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPublicProduct(slug);
  if (!p) return { title: "Piece not found" };
  const meta = productMeta(p);
  const description =
    (p.description || `${p.title}${meta ? `, ${meta}` : ""}. An original piece by ${site.name}.`)
      .replace(/\s+/g, " ")
      .slice(0, 155);
  return {
    title: `${p.title}${p.medium ? `, ${p.medium}` : ""}`,
    description,
    alternates: { canonical: `/shop/${p.slug}` },
    openGraph: {
      type: "website",
      title: `${p.title} by ${site.name}`,
      description,
      url: `/shop/${p.slug}`,
      images: p.images.slice(0, 1).map((url) => ({ url, alt: p.title })),
    },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { unavailable, error } = await searchParams;
  const p = await getPublicProduct(slug);
  if (!p) notFound();

  const status = publicStatus(p);
  const meta = productMeta(p);

  const buyForm = (
    <form action="/api/checkout" method="post">
      <input type="hidden" name="slug" value={p.slug} />
      {status === "available" ? (
        <button className="btn" type="submit">
          Buy now
        </button>
      ) : (
        <button className="btn" type="button" disabled>
          {status === "sold" ? "Sold" : "On hold"}
        </button>
      )}
    </form>
  );

  return (
    <div className="wrap">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.title,
          description: p.description || meta,
          image: p.images,
          url: `${site.url}/shop/${p.slug}`,
          category: categoryLabel(p.category),
          brand: { "@type": "Brand", name: site.name },
          ...(p.medium ? { material: p.medium } : {}),
          offers: {
            "@type": "Offer",
            price: (p.price_cents / 100).toFixed(2),
            priceCurrency: "NZD",
            availability: status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: `${site.url}/shop/${p.slug}`,
            seller: { "@type": "Person", name: site.name },
            shippingDetails: {
              "@type": "OfferShippingDetails",
              shippingRate: { "@type": "MonetaryAmount", value: (p.shipping_cents / 100).toFixed(2), currency: "NZD" },
              shippingDestination: { "@type": "DefinedRegion", addressCountry: "NZ" },
            },
          },
        }}
      />

      <article className="product">
        <Gallery images={p.images} title={p.title} />

        <div className="product-info">
          {unavailable && (
            <p className="notice" role="status">
              Someone else is checking out this piece right now. If they don't complete it, it will be available again
              within about 30 minutes.
            </p>
          )}
          {error && (
            <p className="notice" role="alert">
              Checkout couldn't be started. Please try again in a moment.
            </p>
          )}

          <h1>{p.title}</h1>
          <p className="artist-line">{site.name}</p>
          {meta && <p className="product-meta">{meta}</p>}

          <p className="product-price">
            <StatusPrice product={p} />
          </p>
          {status === "sold" && <p className="status-note">This piece has found its home.</p>}
          {status === "reserved" && (
            <p className="status-note">Someone is checking out. If they don't finish, it becomes available again.</p>
          )}

          <div className="buy-inline">{buyForm}</div>

          {p.description && <div className="product-desc">{p.description}</div>}

          <dl className="details">
            {p.medium && (
              <div>
                <dt>Medium</dt>
                <dd>{p.medium}</dd>
              </div>
            )}
            {p.dimensions && (
              <div>
                <dt>Size</dt>
                <dd>{p.dimensions}</dd>
              </div>
            )}
            {p.year && (
              <div>
                <dt>Year</dt>
                <dd>{p.year}</dd>
              </div>
            )}
            <div>
              <dt>Category</dt>
              <dd>
                <Link href={`/shop?c=${p.category}`}>{categoryLabel(p.category)}</Link>
              </dd>
            </div>
            <div>
              <dt>Courier</dt>
              <dd>
                {formatNzd(p.shipping_cents)}. {site.dispatchNote}
              </dd>
            </div>
          </dl>

          <Link href="/shop" className="back-link">
            Back to all pieces
          </Link>
        </div>
      </article>

      {status !== "sold" && (
        <>
          <div className="buy-bar-spacer" />
          <div className="buy-bar">
            <p className="price">
              {formatNzd(p.price_cents)}
              <small>One of one</small>
            </p>
            {buyForm}
          </div>
        </>
      )}
    </div>
  );
}
