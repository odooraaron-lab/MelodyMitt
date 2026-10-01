import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { sql } from "@/lib/db";
import { stripe, SITE_TAG } from "@/lib/stripe";
import { sendOrderEmails } from "@/lib/email";
import type { Order } from "@/lib/orders";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(body, signature ?? "", process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch (err) {
    console.error("Webhook signature check failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!event.type.startsWith("checkout.session.")) return NextResponse.json({ ignored: true });

  const session = event.data.object as Stripe.Checkout.Session;
  // Shared Stripe account: ignore sessions from the other sites.
  if (session.metadata?.site !== SITE_TAG) return NextResponse.json({ ignored: true });

  const productId = Number(session.metadata.product_id);

  if (event.type === "checkout.session.expired") {
    await sql()`UPDATE products
                   SET status = 'available', reserved_until = NULL, reserved_session_id = NULL, updated_at = now()
                 WHERE id = ${productId} AND status = 'reserved' AND reserved_session_id = ${session.id}`;
    revalidatePath("/", "layout");
    return NextResponse.json({ released: true });
  }

  const paid =
    (event.type === "checkout.session.completed" && session.payment_status === "paid") ||
    event.type === "checkout.session.async_payment_succeeded";
  if (!paid) return NextResponse.json({ waiting: true });

  const customer = session.customer_details;
  // Newer API versions keep shipping under collected_information.
  const shipping =
    session.collected_information?.shipping_details ??
    (session as unknown as { shipping_details?: Stripe.Checkout.Session.CollectedInformation.ShippingDetails })
      .shipping_details ??
    null;
  const address = shipping?.address ?? customer?.address ?? {};

  const products = (await sql()`SELECT title FROM products WHERE id = ${productId}`) as { title: string }[];

  // Insert once per session; Stripe can deliver the same event more than once.
  const inserted = (await sql()`
    INSERT INTO orders (product_id, product_title, stripe_session_id, customer_name, customer_email,
                        customer_phone, shipping_name, shipping_address, amount_total, shipping_amount)
    VALUES (${productId}, ${products[0]?.title ?? "Piece"}, ${session.id}, ${customer?.name ?? ""},
            ${customer?.email ?? ""}, ${customer?.phone ?? ""}, ${shipping?.name ?? customer?.name ?? ""},
            ${JSON.stringify(address)}, ${session.amount_total ?? 0}, ${session.shipping_cost?.amount_total ?? 0})
    ON CONFLICT (stripe_session_id) DO NOTHING
    RETURNING *`) as Order[];

  if (inserted[0]) {
    await sql()`UPDATE products
                   SET status = 'sold', sold_at = now(), reserved_until = NULL, reserved_session_id = NULL, updated_at = now()
                 WHERE id = ${productId}`;
    revalidatePath("/", "layout");
    await sendOrderEmails(inserted[0]);
  }

  return NextResponse.json({ received: true });
}
