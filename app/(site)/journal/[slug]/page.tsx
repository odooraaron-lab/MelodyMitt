import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts, relatedPosts, readMinutes, wordCount } from "@/content/posts";
import { getCategory } from "@/content/categories";
import { PostThumb } from "@/components/PostThumb";
import { Markdown, headings } from "@/lib/markdown";
import { JsonLd } from "@/components/JsonLd";
import { ProductCard } from "@/components/ProductCard";
import { listPublicProducts, type Product } from "@/lib/products";
import { formatDate } from "@/lib/format";
import { breadcrumbs, shareImage } from "@/lib/seo";
import { site } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
// Posts are static; the pieces shown under them refresh hourly.
export const revalidate = 3600;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: { absolute: `${post.seoTitle} | ${site.name}` },
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/journal/${post.slug}`,
      publishedTime: post.date,
      authors: [site.name],
      images: [shareImage],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();

  const cat = getCategory(post.category);
  const toc = headings(post.body);
  const related = relatedPosts(post);
  // A few pieces to shop at the end, if the post points at a style. Never let the database break a post.
  let pieces: Product[] = [];
  if (post.shop?.style) {
    pieces = await listPublicProducts({ style: post.shop.style })
      .then((list) => list.filter((p) => p.status !== "sold").slice(0, 4))
      .catch(() => []);
  }

  return (
    <div className="wrap">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.date,
          keywords: post.keywords.join(", "),
          wordCount: wordCount(post),
          inLanguage: "en-NZ",
          mainEntityOfPage: `${site.url}/journal/${post.slug}`,
          image: `${site.url}${shareImage.url}`,
          author: { "@type": "Person", name: site.name, url: `${site.url}/about` },
          publisher: { "@type": "Organization", name: site.name, logo: `${site.url}/icon-512.png` },
        }}
      />
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["Journal", "/journal"],
          ...(cat ? ([[cat.label, `/journal/category/${cat.id}`]] as [string, string][]) : []),
          [post.title, `/journal/${post.slug}`],
        ])}
      />

      <article className="article">
        <header className="article-head">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/journal">Journal</Link>
            {cat && (
              <>
                <span aria-hidden> / </span>
                <Link href={`/journal/category/${cat.id}`}>{cat.label}</Link>
              </>
            )}
          </nav>
          <h1>{post.title}</h1>
          <PostThumb post={post} size={72} />
          <p>
            By <Link href="/about">{site.name}</Link>, <time dateTime={post.date}>{formatDate(post.date)}</time>.{" "}
            {readMinutes(post)} minute read
          </p>
        </header>

        {toc.length >= 3 && (
          <nav className="toc" aria-label="In this guide">
            <h2>In this guide</h2>
            <ol>
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`}>{h.text.replace(/^\d+\.\s*/, "")}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="prose">
          <Markdown source={post.body} />
        </div>

        {post.shop && (
          <aside className="post-shop" aria-label="Shop">
            {pieces.length > 0 && (
              <div className="grid">
                {pieces.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
            <Link href={post.shop.href} className="btn">
              {post.shop.label}
            </Link>
          </aside>
        )}
      </article>

      {related.length > 0 && (
        <section className="section" aria-labelledby="more-guides">
          <div className="section-head">
            <h2 id="more-guides">Keep reading</h2>
            <Link href={cat ? `/journal/category/${cat.id}` : "/journal"}>{cat ? `All ${cat.label} guides` : "All guides"}</Link>
          </div>
          <ul className="post-list">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/journal/${r.slug}`}>
                  <PostThumb post={r} />
                  <span className="post-meta">{readMinutes(r)} minute read</span>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
