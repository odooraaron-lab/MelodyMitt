import Link from "next/link";
import { site } from "@/site.config";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="glow" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <div className="wrap">
        <div className="footer-inner">
          <div className="footer-brand">
            <p className="footer-name">{site.name}</p>
            <p>Original art and collected pieces. One of one, couriered NZ-wide.</p>
          </div>

          <nav aria-label="Shop" className="footer-col">
            <h2>Shop</h2>
            <Link href="/shop">All pieces</Link>
            {site.categories.map((c) => (
              <Link key={c.id} href={`/shop/category/${c.id}`}>
                {c.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Art by style" className="footer-col">
            <h2>Art by style</h2>
            {site.styles.map((s) => (
              <Link key={s.id} href={`/shop/style/${s.id}`}>
                {s.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Studio" className="footer-col">
            <h2>Studio</h2>
            <Link href="/about">About</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/shipping-and-returns">Shipping and returns</Link>
            <Link href="/shipping-and-returns#privacy">Privacy</Link>
            {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>Email</a>}
            {site.instagram && (
              <a href={site.instagram} rel="me noopener">
                Instagram
              </a>
            )}
          </nav>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {site.name}. Secure checkout by Stripe.
          </p>
          <a href="#top" className="text-link">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
