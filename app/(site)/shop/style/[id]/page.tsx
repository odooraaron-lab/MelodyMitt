import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/CollectionView";
import { listPublicProducts } from "@/lib/products";
import { site } from "@/site.config";
import { shareImage } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

const find = (id: string) => site.styles.find((s) => s.id === id);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const style = find((await params).id);
  if (!style) return {};
  return {
    title: style.title,
    description: style.intro,
    alternates: { canonical: `/shop/style/${style.id}` },
    openGraph: { title: `${style.title} | ${site.name}`, description: style.intro, url: `/shop/style/${style.id}`, images: [shareImage] },
  };
}

export default async function StylePage({ params }: Props) {
  const style = find((await params).id);
  if (!style) notFound();
  const products = await listPublicProducts({ style: style.id });
  return (
    <CollectionView
      title={`${style.label} art`}
      intro={style.intro}
      path={`/shop/style/${style.id}`}
      crumbs={[
        ["Home", "/"],
        ["Shop", "/shop"],
        [style.label, `/shop/style/${style.id}`],
      ]}
      products={products}
      active={{ style: style.id }}
    />
  );
}
