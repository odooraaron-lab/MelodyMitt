import type { Metadata } from "next";
import Link from "next/link";
import { stripe, SITE_TAG } from "@/lib/stripe";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function Success({ searchParams }: Props) {
  const { session_id } = await searchParams;
  let name = "";
  let email = "";
  let item = "";
  if (session_id?.startsWith("cs_")) {
    try {
      const s = await stripe().checkout.sessions.retrieve(session_id, { expand: ["line_items"] });
      if (s.metadata?.site === SITE_TAG) {
        name = s.customer_details?.name?.split(" ")[0] ?? "";
        email = s.customer_details?.email ?? "";
        item = s.line_items?.data[0]?.description ?? "";
      }
    } catch {
      /* fall through to the generic message */
    }
  }

  return (
    <div className="wrap">
      <header className="article-head">
        <h1>Thank you{name ? `, ${name}` : ""}.</h1>
      </header>
      <div className="prose">
        <p>
          {item ? <em>{item}</em> : "Your piece"} is yours. A confirmation is on its way
          {email ? ` to ${email}` : ""}, and you'll get tracking details once it has been couriered.
        </p>
        <p>
          <Link href="/shop">Back to the shop</Link>
        </p>
      </div>
    </div>
  );
}
