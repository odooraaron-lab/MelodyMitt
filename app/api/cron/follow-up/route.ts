// Runs daily (see vercel.json). Emails buyers who opted in, a couple of weeks after their piece shipped,
// with new pieces in the shop. Each order gets at most one follow-up.
import { NextRequest, NextResponse } from "next/server";
import { sql, ensureSchema } from "@/lib/db";
import { sendFollowUpEmail } from "@/lib/email";
import type { Order } from "@/lib/orders";
import { site } from "@/site.config";

export async function GET(req: NextRequest) {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set in the project.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  await ensureSchema();

  const due = (await sql()`
    SELECT o.* FROM orders o
     WHERE o.marketing_opt_in
       AND o.follow_up_sent_at IS NULL
       AND o.status = 'shipped'
       AND o.shipped_at < now() - make_interval(days => ${site.followUpDays}::int)
       AND o.shipped_at > now() - make_interval(days => ${site.followUpDays + 30}::int)
       AND NOT EXISTS (SELECT 1 FROM email_optouts x WHERE x.email = lower(o.customer_email))
     ORDER BY o.shipped_at
     LIMIT 50`) as Order[];

  let sent = 0;
  const emailed = new Set<string>();
  for (const order of due) {
    const email = order.customer_email.toLowerCase();
    // One email per person per run, even if they bought several pieces.
    if (!emailed.has(email) && (await sendFollowUpEmail(order))) {
      sent++;
      emailed.add(email);
    }
    await sql()`UPDATE orders SET follow_up_sent_at = now() WHERE id = ${order.id}`;
  }
  return NextResponse.json({ due: due.length, sent });
}
