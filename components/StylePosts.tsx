import Link from "next/link";
import { getCategory } from "@/content/categories";
import { PostThumb } from "./PostThumb";
import { postsForStyle, readMinutes } from "@/content/posts";

/** A swipeable row of journal guides that relate to an art style. Sits above the listings on style pages. */
export function StylePosts({ styleId, label }: { styleId: string; label: string }) {
  const posts = postsForStyle(styleId, 6);
  if (!posts.length) return null;
  const name = label.toLowerCase();

  return (
    <section className="style-posts" aria-labelledby="style-posts-title">
      <div className="section-head">
        <h2 id="style-posts-title">Guides and stories about {name} art</h2>
        <Link href="/journal">All guides</Link>
      </div>
      <ul className="hscroll" aria-label={`Guides about ${name} art, scroll sideways`}>
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/journal/${p.slug}`} className="hpost">
              <PostThumb post={p} />
              <span className="hpost-kicker">{getCategory(p.category)?.label}</span>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <span className="hpost-meta">{readMinutes(p)} minute read</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
