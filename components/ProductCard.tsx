import Image from "next/image";
import Link from "next/link";
import { formatNzd } from "@/lib/format";
import { publicStatus, isNew, type Product } from "@/lib/products";

export const productMeta = (p: Pick<Product, "medium" | "dimensions" | "year">) =>
  [p.medium, p.dimensions, p.year].filter(Boolean).join(", ");

/** Every piece shows its price; sold and held pieces say so alongside it. */
export function StatusPrice({ product }: { product: Product }) {
  const status = publicStatus(product);
  const price = formatNzd(product.price_cents);
  if (status === "sold")
    return (
      <>
        <span className="red-dot" aria-hidden /> Sold <span className="was">{price}</span>
      </>
    );
  if (status === "reserved")
    return (
      <>
        <span className="hold-dot" aria-hidden /> {price}, on hold
      </>
    );
  return <>{price}</>;
}

/**
 * A listing in a grid. `eager` loads the photo straight away (use for the first row);
 * the rest load as they scroll near, with a blurred preview showing first.
 */
export function ProductCard({ product, eager, lcp }: { product: Product; eager?: boolean; lcp?: boolean }) {
  const status = publicStatus(product);
  const cover = product.images[0];
  const blur = cover ? product.blurs?.[cover] : undefined;

  return (
    <article className={`card${status === "sold" ? " is-sold" : ""}`}>
      <Link href={`/shop/${product.slug}`} className="card-link">
        <div className="wall">
          {cover ? (
            <Image
              src={cover}
              alt={[product.title, product.medium].filter(Boolean).join(", ")}
              fill
              sizes="(min-width: 1100px) 300px, (min-width: 720px) 33vw, 50vw"
              loading={eager ? "eager" : "lazy"}
              fetchPriority={lcp ? "high" : undefined}
              placeholder={blur ? "blur" : "empty"}
              blurDataURL={blur}
            />
          ) : (
            <span className="wall-empty">Photo coming</span>
          )}
          {status === "available" && isNew(product) && <span className="new-tag">New</span>}
        </div>
        <div className="label">
          <span className="title">{product.title}</span>
          {(product.medium || product.year) && (
            <span className="meta">{[product.medium, product.year].filter(Boolean).join(", ")}</span>
          )}
          <span className="price">
            <StatusPrice product={product} />
          </span>
        </div>
      </Link>
      {status === "available" && (
        <form action="/api/checkout" method="post" className="card-buy">
          <input type="hidden" name="slug" value={product.slug} />
          <button type="submit" className="btn btn-small btn-buy">
            Buy now
          </button>
        </form>
      )}
    </article>
  );
}
