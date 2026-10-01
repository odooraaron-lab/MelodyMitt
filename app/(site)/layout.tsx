import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/site.config";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": `${site.url}/#website`,
              url: site.url,
              name: site.name,
              description: site.description,
              inLanguage: "en-NZ",
            },
            {
              "@type": "Person",
              "@id": `${site.url}/#melody`,
              name: site.name,
              jobTitle: "Artist",
              url: `${site.url}/about`,
              nationality: { "@type": "Country", name: "New Zealand" },
              ...(site.instagram ? { sameAs: [site.instagram] } : {}),
            },
          ],
        }}
      />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
