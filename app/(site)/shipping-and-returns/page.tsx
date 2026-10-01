import type { Metadata } from "next";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Shipping and returns",
  description: `How ${site.name} ships original art and objects across New Zealand, plus returns and privacy.`,
  alternates: { canonical: "/shipping-and-returns" },
};

export default function Policies() {
  return (
    <div className="wrap">
      <header className="article-head">
        <h1>Shipping and returns</h1>
      </header>
      <div className="prose">
        <h2>Shipping</h2>
        <p>
          {site.dispatchNote} The courier cost for each piece is shown on its page and added at checkout. You'll get a
          confirmation email when you order and another with tracking once your piece is on its way.
        </p>
        <p>We currently ship within New Zealand only.</p>
        <h2>Returns</h2>
        <p>
          Every piece is one of one, so we don't offer refunds for change of mind. This doesn't affect your rights under
          the Consumer Guarantees Act.
        </p>
        <p>
          If your piece arrives damaged, please get in touch within 48 hours of delivery with photos of the item and its
          packaging, and we'll put it right.
        </p>
        <h2>Payments and privacy</h2>
        <p>
          Payments are processed securely by Stripe. Card details never reach this website. Your name, email, phone and
          delivery address are used only to deliver your order and contact you about it.
        </p>
      </div>
    </div>
  );
}
