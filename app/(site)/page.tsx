import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { listPublicProducts } from "@/lib/products";
import { sortedPosts } from "@/content/posts";
import { formatDate } from "@/lib/format";
import { site } from "@/site.config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listPublicProducts({ limit: 8 });
  const posts = sortedPosts().slice(0, 3);

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
        {products.length ? (
          <div className="grid">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 4} />
            ))}
          </div>
        ) : (
          <p className="empty">New pieces are being photographed. Check back soon.</p>
        )}
      </section>

      <section className="section about-strip">
        <p>{site.about.short}</p>
        <Link href="/about">About Melody</Link>
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
