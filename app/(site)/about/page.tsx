import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "About Melody Mitt, New Zealand artist",
  description: site.about.short.slice(0, 155),
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <div className="wrap">
      <header className="article-head">
        <h1>About {site.name}</h1>
      </header>
      <div className="prose">
        {site.about.long.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        <p>
          <Link href="/shop">See the pieces available now</Link>, or read the <Link href="/journal">journal</Link> for
          notes on living with art.
        </p>
      </div>
    </div>
  );
}
