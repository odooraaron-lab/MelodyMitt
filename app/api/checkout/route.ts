import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { stripe, SITE_TAG } from "@/lib/stripe";
import { site } from "@/site.config";
import type { Product } from "@/lib/products";

const HOLD_MINUTES = 31; // Stripe sessions must stay open at least 30 minutes

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const slug = String(form.get("slug") ?? "");
  const back = (q: string) => NextResponse.redirect(`${site.url}/shop/${slug}?${q}`, 303);

  // If this browser already started checkout for the piece (then hit back), let it try again.
  const previousSession = req.cookies.get("mm_checkout")?.value ?? "";

  // Atomically place a hold, so two people can't pay for the same one-off piece.
  const held = (await sql()`
    UPDATE products
       SET status = 'reserved',
           reserved_until = now() + interval '32 minutes',
           updated_at = now()
     WHERE slug = ${slug} AND visible
       AND (status = 'available'
            OR (status = 'reserved' AND (reserved_until < now() OR reserved_session_id = ${previousSession})))
     RETURNING *`) as Product[];

  const product = held[0];
  if (!product) return back("unavailable=1");

  if (previousSession && product.reserved_session_id === previousSession) {
    await stripe().checkout.sessions.expire(previousSession).catch(() => {});
  }

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: site.currency,
            unit_amount: product.price_cents,
            product_data: {
              name: product.title,
              images: product.images.slice(0, 1),
              ...(product.medium || product.dimensions
                ? { description: [product.medium, product.dimensions].filter(Boolean).join(", ") }
                : {}),
            },
          },
        },
      ],
      shipping_address_collection: { allowed_countries: ["NZ"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            display_name: "Tracked courier, NZ-wide",
            fixed_amount: { amount: product.shipping_cents, currency: site.currency },
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 6 },
            },
          },
        },
      ],
      phone_number_collection: { enabled: true },
      metadata: { site: SITE_TAG, product_id: String(product.id) },
      payment_intent_data: { metadata: { site: SITE_TAG, product_id: String(product.id) } },
      expires_at: Math.floor(Date.now() / 1000) + HOLD_MINUTES * 60,
      success_url: `${site.url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site.url}/shop/${product.slug}`,
    });

    await sql()`UPDATE products SET reserved_session_id = ${session.id} WHERE id = ${product.id}`;

    const res = NextResponse.redirect(session.url!, 303);
    res.cookies.set("mm_checkout", session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: HOLD_MINUTES * 60,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Checkout failed", err);
    await sql()`UPDATE products SET status = 'available', reserved_until = NULL, reserved_session_id = NULL
                WHERE id = ${product.id} AND status = 'reserved'`;
    return back("error=1");
  }
}
