import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/content/posts";
import { Markdown } from "@/lib/markdown";
import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/lib/format";
import { site } from "@/site.config";
import { breadcrumbs, shareImage } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
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
          mainEntityOfPage: `${site.url}/journal/${post.slug}`,
          image: `${site.url}/opengraph-image.png`,
          author: { "@type": "Person", name: site.name, url: `${site.url}/about` },
          publisher: { "@type": "Person", name: site.name },
        }}
      />
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["Journal", "/journal"],
          [post.title, `/journal/${post.slug}`],
        ])}
      />
      <article>
        <header className="article-head">
          <h1>{post.title}</h1>
          <p>
            By {site.name}, <time dateTime={post.date}>{formatDate(post.date)}</time>
          </p>
        </header>
        <div className="prose">
          <Markdown source={post.body} />
        </div>
      </article>
      <Link href="/journal" className="back-link">
        More from the journal
      </Link>
    </div>
  );
}
