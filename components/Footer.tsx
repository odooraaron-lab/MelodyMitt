import Link from "next/link";
import { site } from "@/site.config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <p className="footer-name">{site.name}</p>
          <p>{site.tagline}. Every piece is one of one, couriered anywhere in New Zealand.</p>
        </div>
        <nav aria-label="Shop by style" className="footer-col">
          <h2>Art by style</h2>
          {site.styles.map((s) => (
            <Link key={s.id} href={`/shop/style/${s.id}`}>
              {s.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Shop" className="footer-col">
          <h2>Shop</h2>
          <Link href="/shop">All pieces</Link>
          {site.categories.map((c) => (
            <Link key={c.id} href={`/shop/category/${c.id}`}>
              {c.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Information" className="footer-col">
          <h2>Information</h2>
          <Link href="/about">About</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/shipping-and-returns">Shipping and returns</Link>
          {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>}
          {site.instagram && (
            <a href={site.instagram} rel="me noopener">
              Instagram
            </a>
          )}
        </nav>
        <p className="footer-legal">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
