import type { Metadata } from "next";
import Link from "next/link";
import { sortedPosts } from "@/content/posts";
import { formatDate } from "@/lib/format";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Journal: art and interiors",
  description: `Notes from ${site.name} on choosing, hanging, styling and caring for original art in New Zealand homes.`,
  alternates: { canonical: "/journal" },
};

export default function Journal() {
  return (
    <div className="wrap">
      <header className="page-head">
        <h1>Journal</h1>
        <p>Notes on choosing, hanging and living with original art and objects.</p>
      </header>
      <ul className="post-list">
        {sortedPosts().map((post) => (
          <li key={post.slug}>
            <Link href={`/journal/${post.slug}`}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
