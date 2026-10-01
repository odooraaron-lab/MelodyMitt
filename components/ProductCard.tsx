import Image from "next/image";
import Link from "next/link";
import { formatNzd } from "@/lib/format";
import { publicStatus, type Product } from "@/lib/products";

export const productMeta = (p: Pick<Product, "medium" | "dimensions" | "year">) =>
  [p.medium, p.dimensions, p.year].filter(Boolean).join(", ");

export function StatusPrice({ product }: { product: Product }) {
  const status = publicStatus(product);
  if (status === "sold")
    return (
      <>
        <span className="red-dot" aria-hidden /> Sold
      </>
    );
  if (status === "reserved")
    return (
      <>
        <span className="hold-dot" aria-hidden /> {formatNzd(product.price_cents)}, on hold
      </>
    );
  return <>{formatNzd(product.price_cents)}</>;
}

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const status = publicStatus(product);
  return (
    <Link href={`/shop/${product.slug}`} className={`card${status === "sold" ? " is-sold" : ""}`}>
      <div className="wall">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            sizes="(min-width: 1100px) 300px, (min-width: 720px) 33vw, 50vw"
            priority={priority}
          />
        ) : (
          <span className="wall-empty">Photo coming</span>
        )}
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
  );
}
