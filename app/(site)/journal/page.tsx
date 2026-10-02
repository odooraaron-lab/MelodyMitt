import type { Metadata } from "next";
import Link from "next/link";
import { sortedPosts, readMinutes, postsByYear, postsInCategory } from "@/content/posts";
import { categories, getCategory } from "@/content/categories";
import { JsonLd } from "@/components/JsonLd";
import { PostCover } from "@/components/PostCover";
import { formatDate } from "@/lib/format";
import { shareImage } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Journal: art guides for Auckland, Queenstown, Christchurch and more",
  description: `Guides from ${site.name} to art galleries, buying, hanging and caring for original art in Auckland, Queenstown, Christchurch, Hamilton, New Plymouth, Tauranga and Whangārei.`,
  alternates: { canonical: "/journal" },
  openGraph: { title: `Journal | ${site.name}`, url: "/journal", images: [shareImage] },
};

export default function Journal() {
  const all = sortedPosts();
  const [lead, ...rest] = all;
  const latest = rest.slice(0, 8);
  const archive = postsByYear(rest.slice(8));

  return (
    <div className="wrap">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${site.name} Journal`,
          url: `${site.url}/journal`,
          blogPost: all.slice(0, 20).map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${site.url}/journal/${p.slug}`,
            datePublished: p.date,
          })),
        }}
      />
      <header className="page-head">
        <h1>Journal</h1>
        <p>Guides to galleries, buying, hanging and living with original art, from Whangārei to Queenstown.</p>
      </header>

      <nav className="chips chips-wrap" aria-label="Browse the journal by place or topic">
        {categories.map((c) => (
          <Link key={c.id} href={`/journal/category/${c.id}`} className="chip">
            {c.label} <span className="chip-count">{postsInCategory(c.id).length}</span>
          </Link>
        ))}
      </nav>

      {lead && (
        <Link href={`/journal/${lead.slug}`} className="post-lead">
          <PostCover post={lead} variant="wide" priority />
          <span className="post-meta">
            Latest, {getCategory(lead.category)?.label}, {readMinutes(lead)} minute read
          </span>
          <h2>{lead.title}</h2>
          <p>{lead.description}</p>
        </Link>
      )}

      <ul className="post-list">
        {latest.map((post) => (
          <li key={post.slug}>
            <Link href={`/journal/${post.slug}`}>
              <PostCover post={post} />
              <span className="post-meta">
                {getCategory(post.category)?.label}, <time dateTime={post.date}>{formatDate(post.date)}</time>,{" "}
                {readMinutes(post)} minute read
              </span>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {archive.length > 0 && (
        <section className="archive" aria-labelledby="archive-title">
          <h2 id="archive-title">From the archive</h2>
          {archive.map(([year, posts]) => (
            <details key={year} className="archive-year">
              <summary>
                {year} <span className="muted">({posts.length})</span>
              </summary>
              <ul>
                {posts.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/journal/${p.slug}`}>{p.title}</Link>
                    <span className="post-meta">{getCategory(p.category)?.label}</span>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}
