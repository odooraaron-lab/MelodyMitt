import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/content/categories";
import { postsInCategory, readMinutes } from "@/content/posts";
import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/lib/format";
import { breadcrumbs, shareImage } from "@/lib/seo";
import { site } from "@/site.config";

type Props = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ id: c.id }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategory((await params).id);
  if (!cat) return {};
  return {
    title: { absolute: `${cat.seoTitle} | ${site.name}` },
    description: cat.intro.slice(0, 155),
    alternates: { canonical: `/journal/category/${cat.id}` },
    openGraph: { title: cat.title, description: cat.intro, url: `/journal/category/${cat.id}`, images: [shareImage] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const cat = getCategory((await params).id);
  if (!cat) notFound();
  const posts = postsInCategory(cat.id);
  const others = categories.filter((c) => c.id !== cat.id);

  return (
    <div className="wrap">
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["Journal", "/journal"],
          [cat.label, `/journal/category/${cat.id}`],
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: cat.title,
          description: cat.intro,
          url: `${site.url}/journal/category/${cat.id}`,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: posts.length,
            itemListElement: posts.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${site.url}/journal/${p.slug}`,
              name: p.title,
            })),
          },
        }}
      />

      <header className="page-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/journal">Journal</Link>
        </nav>
        <h1>{cat.title}</h1>
        <p>{cat.intro}</p>
        <p className="count">{posts.length} guides</p>
      </header>

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/journal/${post.slug}`}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <span className="post-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>, {readMinutes(post)} minute read
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="section" aria-labelledby="other-places">
        <div className="section-head">
          <h2 id="other-places">More guides</h2>
        </div>
        <nav className="chips chips-wrap" aria-label="Other journal categories">
          {others.map((c) => (
            <Link key={c.id} href={`/journal/category/${c.id}`} className="chip">
              {c.label}
            </Link>
          ))}
        </nav>
        <p style={{ marginTop: 24 }}>
          <Link href="/shop" className="btn">
            Shop original art
          </Link>
        </p>
      </section>
    </div>
  );
}
