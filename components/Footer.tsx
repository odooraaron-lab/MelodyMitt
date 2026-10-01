import Link from "next/link";
import { site } from "@/site.config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p className="footer-name">{site.name}</p>
        <p>{site.tagline}. Every piece is one of one, couriered anywhere in New Zealand.</p>
        <nav aria-label="Footer">
          <Link href="/shop">Shop</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/about">About</Link>
          <Link href="/shipping-and-returns">Shipping and returns</Link>
          {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>}
          {site.instagram && <a href={site.instagram} rel="me noopener">Instagram</a>}
        </nav>
        <p>© {new Date().getFullYear()} {site.name}</p>
      </div>
    </footer>
  );
}
