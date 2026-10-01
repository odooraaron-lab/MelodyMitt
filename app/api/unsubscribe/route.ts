import { NextRequest } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { verifyUnsubscribe } from "@/lib/unsubscribe";
import { site } from "@/site.config";

const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><html lang="en-NZ"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${title} | ${site.name}</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#e9e2d6;font-family:Georgia,serif;color:#2b2724;padding:24px">
<main style="max-width:380px;background:#fbf9f5;padding:28px 24px;box-shadow:6px 10px 18px -6px rgba(43,39,36,.18)">
<p style="margin:0 0 6px;font:600 15px Helvetica,Arial,sans-serif">${site.name}</p>
<h1 style="margin:0 0 12px;font-weight:normal;font-style:italic;font-size:24px">${title}</h1>
${body}</main></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } }
  );

const params = (req: NextRequest) => ({
  email: (req.nextUrl.searchParams.get("e") ?? "").trim().toLowerCase(),
  token: req.nextUrl.searchParams.get("t") ?? "",
});

// GET shows a confirm button (link scanners in inboxes open links, so GET must not unsubscribe on its own).
export async function GET(req: NextRequest) {
  const { email, token } = params(req);
  if (!email || !verifyUnsubscribe(email, token))
    return page("This link has expired", '<p style="font-family:Helvetica,Arial,sans-serif">Reply to any of our emails and we\'ll remove you by hand.</p>', 400);
  return page(
    "Unsubscribe?",
    `<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6">Stop emails about new pieces to ${email}? Order and delivery emails still arrive.</p>
     <form method="post"><button style="margin-top:8px;width:100%;height:48px;border:0;border-radius:3px;background:#2b2724;color:#f8f5f0;font:500 16px Helvetica,Arial,sans-serif;cursor:pointer">Unsubscribe</button></form>`
  );
}

// POST unsubscribes: from the button above, or from "one-click" unsubscribe in Gmail and Apple Mail.
export async function POST(req: NextRequest) {
  const { email, token } = params(req);
  if (!email || !verifyUnsubscribe(email, token)) return page("This link has expired", "", 400);
  await ensureSchema();
  await sql()`INSERT INTO email_optouts (email) VALUES (${email}) ON CONFLICT (email) DO NOTHING`;
  await sql()`UPDATE orders SET marketing_opt_in = FALSE WHERE lower(customer_email) = ${email}`;
  return page("You're unsubscribed", '<p style="font-family:Helvetica,Arial,sans-serif;font-size:15px">You won\'t get emails about new pieces any more.</p>');
}
