import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/site.config";
import { returnPolicy, shippingService, policyUrl } from "@/lib/schema";

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
              "@type": "OnlineStore",
              "@id": `${site.url}/#store`,
              name: site.name,
              url: site.url,
              logo: `${site.url}/icon-512.png`,
              description: site.description,
              founder: { "@id": `${site.url}/#melody` },
              ...(site.contactEmail
                ? { contactPoint: { "@type": "ContactPoint", contactType: "Customer Service", email: site.contactEmail } }
                : {}),
              ...(site.instagram ? { sameAs: [site.instagram] } : {}),
              hasMerchantReturnPolicy: { ...returnPolicy(), merchantReturnLink: policyUrl },
              hasShippingService: shippingService(),
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
