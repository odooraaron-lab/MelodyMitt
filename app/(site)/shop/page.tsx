import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";
import { listPublicProducts } from "@/lib/products";
import { site } from "@/site.config";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ c?: string; price?: string }> };

export const metadata: Metadata = {
  title: "Shop original art and collected pieces",
  description: `Shop original artworks and one-of-a-kind pieces by NZ artist ${site.name}. Browse by style or price. Every piece is a single original, couriered NZ-wide.`,
  alternates: { canonical: "/shop" },
};

export default async function Shop({ searchParams }: Props) {
  const { c, price } = await searchParams;
  // Old category links (/shop?c=art) now live at their own address.
  if (c && site.categories.some((x) => x.id === c)) permanentRedirect(`/shop/category/${c}`);

  const band = site.priceBands.find((b) => b.id === price);
  const products = await listPublicProducts({ price: band?.id });

  return (
    <CollectionView
      title={band ? `Pieces ${band.label.charAt(0).toLowerCase()}${band.label.slice(1)}` : "Shop"}
      intro={band ? "Prices are in NZ dollars, before courier." : undefined}
      path="/shop"
      crumbs={[
        ["Home", "/"],
        ["Shop", "/shop"],
      ]}
      products={products}
      active={{ price: band?.id }}
    />
  );
}
