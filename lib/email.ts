import { Resend } from "resend";
import { site, styleLabel } from "@/site.config";
import { formatNzd } from "./format";
import { addressLines, type Order } from "./orders";
import { getProductById, listPublicProducts, type Product } from "./products";
import { unsubscribeUrl } from "./unsubscribe";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const INK = "#2B2724";
const MUTED = "#7a7066";
const LINE = "#ddd5c9";

function layout(heading: string, body: string, footer = "") {
  return `<!doctype html><html><body style="margin:0;background:#EEE8DF;padding:32px 12px;font-family:Georgia,'Times New Roman',serif;color:${INK}">
  <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#FAF8F4;border-radius:4px">
    <tr><td style="padding:32px 28px">
      <p style="margin:0 0 24px;font-size:18px"><a href="${site.url}" style="color:${INK};text-decoration:none">${esc(site.name)}</a></p>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:normal">${esc(heading)}</h1>
      <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3833">${body}</div>
    </td></tr>
  </table>
  <p style="max-width:560px;margin:16px auto 0;text-align:center;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:${MUTED}">
    ${esc(site.name)}, ${esc(site.tagline.toLowerCase())}. <a href="${site.url}/shipping-and-returns" style="color:${MUTED}">Shipping and returns</a>${footer}
  </p></body></html>`;
}

function summary(o: Order) {
  const addr = [o.shipping_name, ...addressLines(o.shipping_address)].filter(Boolean).map(esc).join("<br>");
  return `<table role="presentation" width="100%" style="border-top:1px solid ${LINE};margin:20px 0;font-size:15px">
    <tr><td style="padding:12px 0">${esc(o.product_title)}</td><td align="right">${formatNzd(o.amount_total - o.shipping_amount)}</td></tr>
    <tr><td style="padding:4px 0;color:${MUTED}">Courier</td><td align="right" style="color:${MUTED}">${formatNzd(o.shipping_amount)}</td></tr>
    <tr><td style="padding:12px 0;border-top:1px solid ${LINE}"><strong>Total paid</strong></td><td align="right" style="border-top:1px solid ${LINE}"><strong>${formatNzd(o.amount_total)}</strong></td></tr>
  </table>
  <p style="margin:0 0 4px;color:${MUTED}">Delivering to</p><p style="margin:0">${addr}</p>`;
}

// ---------- Upsell ----------

/** Small, fast email image via the site's image optimiser instead of the full-size original. */
const thumb = (src: string) => `${site.url}/_next/image?url=${encodeURIComponent(src)}&w=384&q=75`;
const tracked = (path: string, campaign: string) =>
  `${site.url}${path}?utm_source=email&utm_medium=email&utm_campaign=${campaign}`;

/** Available pieces to suggest: same style as the one bought first, then the newest. */
async function suggestions(boughtId: number | null, n = 3, since?: Date): Promise<Product[]> {
  const bought = boughtId ? await getProductById(boughtId).catch(() => null) : null;
  const available = (await listPublicProducts().catch(() => [] as Product[])).filter(
    (p) => p.id !== boughtId && p.status === "available" && p.images.length && (!since || new Date(p.created_at) > since)
  );
  const sameStyle = available.filter((p) => bought?.style && p.style === bought.style);
  return [...sameStyle, ...available.filter((p) => !sameStyle.includes(p))].slice(0, n);
}

function upsell(items: Product[], heading: string, campaign: string) {
  if (!items.length) return "";
  const cells = items
    .map(
      (p) => `<td width="${Math.floor(100 / items.length)}%" valign="top" style="padding:0 6px">
        <a href="${tracked(`/shop/${p.slug}`, campaign)}" style="color:${INK};text-decoration:none">
          <img src="${thumb(p.images[0])}" alt="${esc(p.title)}" width="160" style="display:block;width:100%;max-width:160px;height:auto;background:#e9e2d6;border:0">
          <span style="display:block;margin-top:8px;font-family:Georgia,serif;font-style:italic;font-size:15px;line-height:1.3">${esc(p.title)}</span>
          <span style="display:block;font-size:13px;color:${MUTED}">${formatNzd(p.price_cents)}</span>
        </a></td>`
    )
    .join("");
  return `<div style="margin-top:32px;padding-top:24px;border-top:1px solid ${LINE}">
    <p style="margin:0 0 14px;font-family:Georgia,serif;font-size:19px;color:${INK}">${esc(heading)}</p>
    <table role="presentation" width="100%" style="margin:0 -6px"><tr>${cells}</tr></table>
    <p style="margin:18px 0 0"><a href="${tracked("/shop", campaign)}" style="color:${INK}">See everything available</a></p>
  </div>`;
}

// ---------- Sending ----------

async function send(opts: { to: string; subject: string; html: string; replyTo?: string; headers?: Record<string, string> }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !opts.to) {
    console.warn(`Email skipped (Resend not configured): ${opts.subject}`);
    return false;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: process.env.EMAIL_FROM, ...opts });
  if (error) console.error("Email failed:", opts.subject, error);
  return !error;
}

const firstName = (o: Order) => esc(o.customer_name.split(" ")[0] || "there");

export async function sendOrderEmails(o: Order) {
  const owner = process.env.OWNER_EMAIL || "";
  const more = await suggestions(o.product_id);
  const bought = o.product_id ? await getProductById(o.product_id).catch(() => null) : null;
  const heading = bought?.style && more[0]?.style === bought.style
    ? `More ${styleLabel(bought.style).toLowerCase()} pieces you might like`
    : "You might also like";

  await send({
    to: o.customer_email,
    subject: `Your order: ${o.product_title}`,
    html: layout(
      "Thank you, it's yours",
      `<p>Hi ${firstName(o)},</p>
       <p>Your payment has gone through and <em>${esc(o.product_title)}</em> is now yours alone. ${esc(site.dispatchNote)} You'll get another email with tracking once it's on its way.</p>
       ${summary(o)}
       <p style="margin-top:24px">Questions about your order? Just reply to this email.</p>
       ${upsell(more, heading, "order-confirmation")}`
    ),
    replyTo: owner || undefined,
  });

  await send({
    to: owner,
    subject: `Sold: ${o.product_title} (${formatNzd(o.amount_total)})`,
    html: layout(
      "You made a sale",
      `<p><em>${esc(o.product_title)}</em> has sold and is now marked with a red dot on the site.</p>
       <p><strong>Buyer</strong><br>${esc(o.customer_name)}<br>${esc(o.customer_email)}${o.customer_phone ? `<br>${esc(o.customer_phone)}` : ""}</p>
       ${summary(o)}
       <p style="margin-top:24px"><a href="${site.url}/admin/orders" style="color:${INK}">Open orders in admin</a> to add tracking when it ships.</p>`
    ),
    replyTo: o.customer_email,
  });
}

export async function sendShippedEmail(o: Order) {
  const more = await suggestions(o.product_id);
  await send({
    to: o.customer_email,
    subject: `On its way: ${o.product_title}`,
    html: layout(
      "Your piece is on its way",
      `<p>Hi ${firstName(o)},</p>
       <p><em>${esc(o.product_title)}</em> has been packed by hand and handed to the courier.</p>
       ${o.tracking ? `<p>Tracking number: <strong>${esc(o.tracking)}</strong></p>` : ""}
       <p>Thank you for giving it a home.</p>
       ${upsell(more, "New in the studio", "shipped")}`
    ),
    replyTo: process.env.OWNER_EMAIL || undefined,
  });
}

/** Sent a couple of weeks after delivery, only to buyers who opted in. Carries an unsubscribe link. */
export async function sendFollowUpEmail(o: Order) {
  const fresh = await suggestions(o.product_id, 3, new Date(o.created_at));
  const more = fresh.length ? fresh : await suggestions(o.product_id, 3);
  if (!more.length) return false; // nothing to show, so don't send an empty nudge
  const unsub = unsubscribeUrl(o.customer_email);
  return send({
    to: o.customer_email,
    subject: `How does ${o.product_title} look at home?`,
    html: layout(
      "How does it look on the wall?",
      `<p>Hi ${firstName(o)},</p>
       <p>It's been a little while since <em>${esc(o.product_title)}</em> arrived. I hope it's found the right spot. If you'd like help choosing where to hang it, <a href="${tracked("/journal/how-high-to-hang-art", "follow-up")}" style="color:${INK}">this short guide</a> covers heights and spacing.</p>
       <p>${fresh.length ? "Here's what's new in the studio since your order." : "Here are a few pieces still looking for a home."} Every piece is one of one, so once it's gone, it's gone.</p>
       ${upsell(more, fresh.length ? "New in the studio" : "Still available", "follow-up")}
       <p style="margin-top:24px">Melody</p>`,
      `<br>You're getting this because you asked to hear about new pieces at checkout. <a href="${unsub}" style="color:${MUTED}">Unsubscribe</a>`
    ),
    replyTo: process.env.OWNER_EMAIL || undefined,
    headers: {
      "List-Unsubscribe": `<${unsub}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}

/** A realistic preview of the buyer's confirmation, sent to Melody from the Setup page. */
export async function sendSampleEmail(to: string) {
  if (!to) return false;
  const [piece] = await listPublicProducts({ limit: 1 }).catch(() => [] as Product[]);
  const more = await suggestions(piece?.id ?? null);
  return send({
    to,
    subject: "Sample: what buyers receive after paying",
    html: layout(
      "Thank you, it's yours",
      `<p style="padding:10px 12px;background:#efe7da">This is a sample of the confirmation buyers get. The real one includes their order and address.</p>
       <p>Hi there,</p>
       <p>Your payment has gone through and <em>${esc(piece?.title ?? "your piece")}</em> is now yours alone. ${esc(site.dispatchNote)}</p>
       ${upsell(more, "You might also like", "sample")}`
    ),
  });
}
