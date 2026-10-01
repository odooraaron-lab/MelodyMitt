import { Resend } from "resend";
import { site } from "@/site.config";
import { formatNzd } from "./format";
import { addressLines, type Order } from "./orders";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function layout(heading: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#EEE8DF;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#2B2724">
  <table role="presentation" width="100%" style="max-width:520px;margin:0 auto;background:#FAF8F4;border-radius:4px">
    <tr><td style="padding:32px 28px">
      <p style="margin:0 0 24px;font-size:18px">${esc(site.name)}</p>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:normal">${esc(heading)}</h1>
      <div style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3833">${body}</div>
    </td></tr>
  </table></body></html>`;
}

function summary(o: Order) {
  const addr = [o.shipping_name, ...addressLines(o.shipping_address)].filter(Boolean).map(esc).join("<br>");
  return `<table role="presentation" width="100%" style="border-top:1px solid #ddd5c9;margin:20px 0;font-size:15px">
    <tr><td style="padding:12px 0">${esc(o.product_title)}</td><td align="right">${formatNzd(o.amount_total - o.shipping_amount)}</td></tr>
    <tr><td style="padding:4px 0;color:#7a7066">Courier</td><td align="right" style="color:#7a7066">${formatNzd(o.shipping_amount)}</td></tr>
    <tr><td style="padding:12px 0;border-top:1px solid #ddd5c9"><strong>Total paid</strong></td><td align="right" style="border-top:1px solid #ddd5c9"><strong>${formatNzd(o.amount_total)}</strong></td></tr>
  </table>
  <p style="margin:0 0 4px;color:#7a7066">Delivering to</p><p style="margin:0">${addr}</p>`;
}

async function send(to: string, subject: string, html: string, replyTo?: string) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM || !to) {
    console.warn(`Email skipped (Resend not configured): ${subject}`);
    return;
  }
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: process.env.EMAIL_FROM, to, subject, html, replyTo });
  if (error) console.error("Email failed:", subject, error);
}

export async function sendOrderEmails(o: Order) {
  const owner = process.env.OWNER_EMAIL || "";

  await send(
    o.customer_email,
    `Your order: ${o.product_title}`,
    layout(
      "Thank you, it's yours",
      `<p>Hi ${esc(o.customer_name.split(" ")[0] || "there")},</p>
       <p>Your payment has gone through and <em>${esc(o.product_title)}</em> is now reserved for you alone. ${esc(site.dispatchNote)} You'll get another email with tracking once it's on its way.</p>
       ${summary(o)}
       <p style="margin-top:24px">Questions about your order? Just reply to this email.</p>`
    ),
    owner || undefined
  );

  await send(
    owner,
    `Sold: ${o.product_title} (${formatNzd(o.amount_total)})`,
    layout(
      "You made a sale",
      `<p><em>${esc(o.product_title)}</em> has sold and is now marked with a red dot on the site.</p>
       <p><strong>Buyer</strong><br>${esc(o.customer_name)}<br>${esc(o.customer_email)}${o.customer_phone ? `<br>${esc(o.customer_phone)}` : ""}</p>
       ${summary(o)}
       <p style="margin-top:24px"><a href="${site.url}/admin/orders" style="color:#2B2724">Open orders in admin</a> to add tracking when it ships.</p>`
    ),
    o.customer_email
  );
}

export async function sendShippedEmail(o: Order) {
  await send(
    o.customer_email,
    `On its way: ${o.product_title}`,
    layout(
      "Your piece is on its way",
      `<p>Hi ${esc(o.customer_name.split(" ")[0] || "there")},</p>
       <p><em>${esc(o.product_title)}</em> has been packed and handed to the courier.</p>
       ${o.tracking ? `<p>Tracking: <strong>${esc(o.tracking)}</strong></p>` : ""}
       <p>Thank you for giving it a home.</p>`
    ),
    process.env.OWNER_EMAIL || undefined
  );
}
