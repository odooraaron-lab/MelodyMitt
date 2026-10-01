import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { RevealGrid } from "@/components/RevealGrid";
import { listPublicProducts } from "@/lib/products";
import { sortedPosts } from "@/content/posts";
import { formatDate } from "@/lib/format";
import { site } from "@/site.config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const all = await listPublicProducts();
  const latest = all.slice(0, 8);
  const posts = sortedPosts().slice(0, 3);
  // A piece from further down the list, so the about panel doesn't repeat the first photo on the page.
  const aboutCover = (all.find((p, i) => i >= 4 && p.images[0]) ?? all.find((p) => p.images[0]))?.images[0];

  // One cover image per style, taken from its newest available piece (sold pieces as a fallback).
  const styleTiles = site.styles.map((s) => {
    const inStyle = all.filter((p) => p.style === s.id && p.images[0]);
    const cover = inStyle.find((p) => p.status !== "sold") ?? inStyle[0];
    return { ...s, cover: cover?.images[0], count: inStyle.filter((p) => p.status !== "sold").length };
  });

  return (
    <div className="wrap">
      <section className="intro">
        <h1>Original art and collected pieces, each one of one.</h1>
        <p>
          New work and found objects from {site.name}, photographed and listed from the studio. Couriered anywhere in
          New Zealand.
        </p>
      </section>

      <section aria-labelledby="new-in">
        <div className="section-head">
          <h2 id="new-in">Latest pieces</h2>
          <Link href="/shop">See everything</Link>
        </div>
        {latest.length ? (
          <RevealGrid>
            {latest.map((p, i) => (
              <ProductCard key={p.id} product={p} eager={i < 4} lcp={i === 0} />
            ))}
          </RevealGrid>
        ) : (
          <p className="empty">New pieces are being photographed. Check back soon.</p>
        )}
      </section>

      <section className="section" aria-labelledby="styles">
        <div className="section-head">
          <h2 id="styles">Browse by style</h2>
        </div>
        <RevealGrid className="style-tiles">
          {styleTiles.map((s) => (
            <Link key={s.id} href={`/shop/style/${s.id}`} className="style-tile card">
              <span className="style-wall">
                {s.cover ? (
                  <Image src={s.cover} alt="" fill sizes="(min-width: 1100px) 200px, (min-width: 720px) 30vw, 45vw" />
                ) : (
                  <span className={`style-swatch swatch-${s.id}`} aria-hidden />
                )}
              </span>
              <span className="style-name">{s.label}</span>
              <span className="style-count">{s.count ? `${s.count} available` : "Coming soon"}</span>
            </Link>
          ))}
        </RevealGrid>
      </section>

      <section className="section feature-glass home-about" aria-labelledby="about-title">
        <div className="feature-art" aria-hidden>
          {aboutCover ? (
            <Image src={aboutCover} alt="" fill sizes="100vw" />
          ) : (
            <div className="glow glow-static">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
        <div className="glass feature-card">
          <h2 id="about-title">About the studio</h2>
          <p>{site.about.short}</p>
          <div className="feature-links">
            <Link href="/about" className="btn">
              About Melody
            </Link>
            <Link href="/about#how-it-works" className="text-link">
              How buying works
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="journal">
        <div className="section-head">
          <h2 id="journal">From the journal</h2>
          <Link href="/journal">All posts</Link>
        </div>
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/journal/${post.slug}`}>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
