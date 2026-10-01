import type { Metadata } from "next";
import Link from "next/link";
import { sortedPosts, readMinutes } from "@/content/posts";
import { JsonLd } from "@/components/JsonLd";
import { formatDate } from "@/lib/format";
import { shareImage } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Journal: guides to choosing, hanging and living with art",
  description: `Practical guides from ${site.name} on choosing, framing, hanging, styling and caring for original art in New Zealand homes.`,
  alternates: { canonical: "/journal" },
  openGraph: { title: `Journal | ${site.name}`, url: "/journal", images: [shareImage] },
};

export default function Journal() {
  const [lead, ...rest] = sortedPosts();
  return (
    <div className="wrap">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${site.name} Journal`,
          url: `${site.url}/journal`,
          blogPost: sortedPosts().map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${site.url}/journal/${p.slug}`,
            datePublished: p.date,
          })),
        }}
      />
      <header className="page-head">
        <h1>Journal</h1>
        <p>Practical guides to choosing, hanging and living with original art and objects.</p>
      </header>

      {lead && (
        <Link href={`/journal/${lead.slug}`} className="post-lead">
          <span className="post-meta">
            Latest, {readMinutes(lead)} minute read
          </span>
          <h2>{lead.title}</h2>
          <p>{lead.description}</p>
        </Link>
      )}

      <ul className="post-list">
        {rest.map((post) => (
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
    </div>
  );
}
