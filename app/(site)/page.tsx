import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { RevealGrid } from "@/components/RevealGrid";
import { listPublicProducts } from "@/lib/products";
import { sortedPosts } from "@/content/posts";
import { formatDate } from "@/lib/format";
import { PostThumb } from "@/components/PostThumb";
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
    <>
      {/* Deep ink band: strong contrast straight away */}
      <section className="band band-deep intro-band">
        <div className="glow glow-dark" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <div className="wrap intro">
          <h1>Original art and collected pieces, each one of one.</h1>
          <p>
            New work and found objects from {site.name}, photographed and listed from the studio. Couriered anywhere in
            New Zealand.
          </p>
          <div className="intro-actions">
            <Link href="/shop" className="btn btn-light">
              Shop all pieces
            </Link>
            <Link href="/about#how-it-works" className="btn btn-ghost-light">
              How buying works
            </Link>
          </div>
        </div>
      </section>

      <section className="wrap section-tight" aria-labelledby="new-in">
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

      <div className="wrap">
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
      </div>

      {/* Tinted band so the journal reads as its own space */}
      <section className="band band-tint" aria-labelledby="journal">
        <div className="wrap">
          <div className="section-head">
            <h2 id="journal">From the journal</h2>
            <Link href="/journal">All guides</Link>
          </div>
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/journal/${post.slug}`}>
                  <PostThumb post={post} />
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Kept low on the page until there are more pieces in each style */}
      <section className="wrap section" aria-labelledby="styles">
        <div className="section-head">
          <h2 id="styles">Browse by style</h2>
          <Link href="/shop">Shop all</Link>
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
    </>
  );
}
