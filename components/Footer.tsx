import Link from "next/link";
import { site } from "@/site.config";
import { featuredPosts } from "@/content/posts";

const { min: hMin, max: hMax } = site.shipping.handlingDays;
const { min: tMin, max: tMax } = site.shipping.transitDays;

export function Footer() {
  const guides = featuredPosts().slice(0, 5);
  return (
    <footer className="site-footer">
      <div className="glow" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <div className="wrap footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <p className="footer-name">{site.name}</p>
            <p>{site.about.short}</p>
            <p>
              <Link href="/about" className="text-link">
                About Melody
              </Link>
            </p>
          </div>
          <ul className="footer-promises glass" aria-label="Buying from Melody Mitt">
            <li>
              <strong>One of one</strong>
              <span>Every piece is a single original. When it sells, it gets a red dot.</span>
            </li>
            <li>
              <strong>Tracked courier, NZ-wide</strong>
              <span>
                Usually with you in {hMin + tMin} to {hMax + tMax} working days.
              </span>
            </li>
            <li>
              <strong>Secure checkout</strong>
              <span>Payments are handled by Stripe. Card details never touch this site.</span>
            </li>
          </ul>
        </div>

        <div className="footer-cols">
          <nav aria-label="Shop" className="footer-col">
            <h2>Shop</h2>
            <Link href="/shop">All pieces</Link>
            {site.categories.map((c) => (
              <Link key={c.id} href={`/shop/category/${c.id}`}>
                {c.label}
              </Link>
            ))}
            {site.priceBands.map((b) => (
              <Link key={b.id} href={`/shop?price=${b.id}`}>
                {b.label}
              </Link>
            ))}
          </nav>
          <nav aria-label="Art by style" className="footer-col">
            <h2>Art by style</h2>
            {site.styles.map((s) => (
              <Link key={s.id} href={`/shop/style/${s.id}`}>
                {s.label} art
              </Link>
            ))}
          </nav>
          <nav aria-label="Popular guides" className="footer-col footer-guides">
            <h2>Popular guides</h2>
            {guides.map((p) => (
              <Link key={p.slug} href={`/journal/${p.slug}`}>
                {p.title}
              </Link>
            ))}
            <Link href="/journal" className="text-link">
              All guides
            </Link>
          </nav>
          <nav aria-label="Studio" className="footer-col">
            <h2>Studio</h2>
            <Link href="/about">About Melody</Link>
            <Link href="/about#how-it-works">How buying works</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/shipping-and-returns">Shipping and returns</Link>
            <Link href="/shipping-and-returns#privacy">Privacy</Link>
            {site.contactEmail && <a href={`mailto:${site.contactEmail}`}>Email Melody</a>}
            {site.instagram && (
              <a href={site.instagram} rel="me noopener">
                Instagram
              </a>
            )}
          </nav>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {site.name}. Made in New Zealand.
          </p>
          <a href="#top" className="text-link">
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
