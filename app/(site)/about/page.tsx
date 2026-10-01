import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { listPublicProducts } from "@/lib/products";
import { breadcrumbs, shareImage } from "@/lib/seo";
import { site } from "@/site.config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Melody Mitt, New Zealand artist",
  description: `${site.about.short} How every piece is made, photographed, sold and couriered across New Zealand.`.slice(0, 155),
  alternates: { canonical: "/about" },
  openGraph: { title: `About ${site.name}`, url: "/about", images: [shareImage] },
};

const { min: hMin, max: hMax } = site.shipping.handlingDays;

const steps = [
  { title: "Made or found", text: "Each piece is made in the studio, or found and chosen for its quality and character." },
  { title: "Photographed by Melody", text: "Melody photographs and lists every piece herself, so what you see is what arrives." },
  { title: "Listed as one of one", text: "There are no editions or restocks. Once a piece sells, it's marked with a red dot for good." },
  {
    title: "Packed and couriered",
    text: `Your piece is packed carefully and sent by tracked courier within ${hMax} working days, anywhere in New Zealand.`,
  },
];

export default async function About() {
  // A recent piece behind the frosted card; falls back to soft colour if nothing is listed yet.
  const cover = (await listPublicProducts({ limit: 12 }).catch(() => [])).find((p) => p.images[0])?.images[0];

  return (
    <div className="wrap">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          url: `${site.url}/about`,
          name: `About ${site.name}`,
          mainEntity: {
            "@type": "Person",
            "@id": `${site.url}/#melody`,
            name: site.name,
            jobTitle: "Artist",
            description: site.about.short,
            nationality: { "@type": "Country", name: "New Zealand" },
          },
        }}
      />
      <JsonLd
        data={breadcrumbs([
          ["Home", "/"],
          ["About", "/about"],
        ])}
      />

      <section className="feature-glass about-hero">
        <div className="feature-art" aria-hidden>
          {cover ? (
            <Image src={cover} alt="" fill sizes="100vw" loading="eager" />
          ) : (
            <div className="glow glow-static">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>
        <div className="glass feature-card">
          <h1>About {site.name}</h1>
          <p>{site.about.short}</p>
        </div>
      </section>

      <div className="about-body">
        <div className="prose">
          {site.about.long.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <section id="how-it-works" className="about-steps" aria-labelledby="steps-title">
          <h2 id="steps-title">How a piece reaches you</h2>
          <ol>
            {steps.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="about-faq" aria-labelledby="faq-title">
          <h2 id="faq-title">Good to know</h2>
          <dl>
            <div>
              <dt>Is every piece original?</dt>
              <dd>Yes. Everything listed is a single original. There are no prints, editions or restocks.</dd>
            </div>
            <div>
              <dt>How long does delivery take?</dt>
              <dd>
                Pieces are packed within {hMin} to {hMax} working days and sent by tracked courier anywhere in New
                Zealand. You'll get an email with tracking once it's on its way.
              </dd>
            </div>
            <div>
              <dt>Is paying online safe?</dt>
              <dd>Yes. Checkout is handled securely by Stripe, and card details never reach this site.</dd>
            </div>
            <div>
              <dt>What if it arrives damaged?</dt>
              <dd>
                Get in touch within 48 hours with photos and it will be put right. See{" "}
                <Link href="/shipping-and-returns#returns">shipping and returns</Link>.
              </dd>
            </div>
            <div>
              <dt>What does the red dot mean?</dt>
              <dd>Galleries mark sold works with a red dot. Sold pieces stay on the site so you can see what Melody has made.</dd>
            </div>
          </dl>
        </section>

        <section className="about-cta">
          <h2>Find your piece</h2>
          <div className="chips chips-wrap">
            {site.styles.map((s) => (
              <Link key={s.id} href={`/shop/style/${s.id}`} className="chip">
                {s.label}
              </Link>
            ))}
          </div>
          <Link href="/shop" className="btn">
            Shop all pieces
          </Link>
        </section>
      </div>
    </div>
  );
}
