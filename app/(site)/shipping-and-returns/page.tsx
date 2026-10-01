import type { Metadata } from "next";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: "Shipping and returns",
  description: `How ${site.name} ships original art and objects across New Zealand, delivery times, returns and privacy.`,
  alternates: { canonical: "/shipping-and-returns" },
};

export default function Policies() {
  const { handlingDays: h, transitDays: t } = site.shipping;
  const days = site.returns.days;

  return (
    <div className="wrap">
      <header className="article-head">
        <h1>Shipping and returns</h1>
      </header>
      <div className="prose">
        <h2 id="shipping">Shipping within New Zealand</h2>
        <p>
          Every piece is sent by tracked courier anywhere in New Zealand. The courier cost is shown on each piece's page
          and added at checkout.
        </p>
        <p>
          Orders are packed and handed to the courier within {h.min === h.max ? h.max : `${h.min} to ${h.max}`} working
          days. Delivery then usually takes {t.min === t.max ? t.max : `${t.min} to ${t.max}`} working days, so most
          orders arrive within {h.min + t.min} to {h.max + t.max} working days. Rural addresses can take a little longer.
        </p>
        <p>
          You'll get a confirmation email when you order and another with your tracking number once your piece is on its
          way. We don't currently ship outside New Zealand.
        </p>

        <h2 id="returns">Returns</h2>
        {days ? (
          <p>
            You can return a piece within {days} days of delivery for a full refund. Please get in touch first, then send
            it back by tracked courier in its original packaging. Return postage is paid by you.
          </p>
        ) : (
          <p>
            Every piece is one of one, so we don't accept returns for change of mind. This doesn't affect your rights
            under the Consumer Guarantees Act.
          </p>
        )}
        <p>
          If your piece arrives damaged or isn't as described, please get in touch within 48 hours of delivery with
          photos of the item and its packaging, and we'll put it right with a repair or a full refund.
        </p>

        <h2 id="privacy">Payments and privacy</h2>
        <p>
          Payments are processed securely by Stripe. Card details never reach this website. Your name, email, phone and
          delivery address are used only to deliver your order and contact you about it.
        </p>
        {site.contactEmail && (
          <p>
            Questions? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
          </p>
        )}
      </div>
    </div>
  );
}
