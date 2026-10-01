# Melody Mitt

Shop for original art and collected pieces by Melody Mitt. Next.js 16 on Vercel, Neon Postgres, Vercel Blob for photos, Stripe Checkout for payments, Resend for order emails.

- Public site: `/`, `/shop`, `/shop/[slug]`, `/journal`, `/about`, `/shipping-and-returns`
- Admin: `/admin` (listings, orders, photo upload from camera or library)

## Setup

### 1. Vercel project
Import this repo into Vercel (Add New > Project). The first deploy may fail until the variables below are added.

### 2. Database (Neon)
In the Vercel project: **Storage > Create > Neon**. This adds `DATABASE_URL` automatically.
Then open the Neon SQL editor, paste the contents of `db/schema.sql`, and run it.
(Or locally: put `DATABASE_URL` in `.env.local` and run `npm run db:setup`.)

### 3. Photo storage (Vercel Blob)
**Storage > Create > Blob**, connect it to the project. This adds `BLOB_READ_WRITE_TOKEN`.

### 4. Stripe
- `STRIPE_SECRET_KEY`: Stripe dashboard > Developers > API keys (use the test key first).
- Webhook: Developers > Webhooks > Add endpoint
  - URL: `https://YOUR-SITE/api/stripe/webhook`
  - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`
  - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

The Stripe account is shared with other sites. Every checkout here is tagged `site=melodymitt` and the webhook ignores anything without that tag, so other sites are unaffected.

### 5. Emails (Resend)
- Create an API key at resend.com and set `RESEND_API_KEY`.
- Once the domain is bought, verify it in Resend, then set `EMAIL_FROM`, e.g. `Melody Mitt <orders@melodymitt.co.nz>`.
- `OWNER_EMAIL`: where Melody's sale alerts go.

Until a domain is verified, Resend only delivers to your own Resend account email. Orders still work; emails are skipped or limited.

### 6. Admin login
Set `ADMIN_USERNAME`, `ADMIN_PASSWORD` (long and unique) and `SESSION_SECRET` (run `openssl rand -base64 32`).

### 7. Site URL
`NEXT_PUBLIC_SITE_URL` = the live URL, no trailing slash. Update it when the domain is connected, then redeploy.

Redeploy after adding variables. See `.env.example` for the full list.

## Testing a purchase
With Stripe test keys, list a piece in `/admin`, then buy it with card `4242 4242 4242 4242`, any future expiry and any CVC. It should turn Sold with a red dot and appear in `/admin/orders`.

## Stripe
- Every listing is copied to the Stripe product catalogue automatically when it's saved (name, photos, availability), so sales show against the right piece in the Stripe dashboard. The price charged always comes from the site, so it can't drift out of date.
- Sold, hidden and deleted pieces are archived in Stripe automatically.
- **Admin > Setup** checks the Stripe key, the account, the webhook and every listing, and has buttons to create the webhook, sync all listings, and email yourself a sample order confirmation.

## Buyer emails
- **Order confirmation** to the buyer, with "You might also like" suggestions (same style first), and a sale alert to Melody.
- **Shipped** email with tracking and a few new pieces, sent when Melody marks the order shipped.
- **Follow-up** about 14 days after shipping, only to buyers who ticked "Email me when new pieces are listed?" at checkout, with a one-click unsubscribe. Set `CRON_SECRET` in Vercel to switch it on; it runs daily via `vercel.json`. Change the delay with `followUpDays` in `site.config.ts`.

## Browsing by style
Each piece can be given an art style in admin (Abstract, Landscape, Coastal, Botanical, Figurative, Still life). Every style and category has its own page that Google can index, for example `/shop/style/abstract` and `/shop/category/objects`, and they're linked from the Shop menu, the home page and the footer. Edit the list, and each style's Google title and intro, in `site.config.ts`.

Upgrading an existing database: the site adds the new `style` column by itself the first time it runs. To do it by hand instead, run the last line of `db/schema.sql` in the Neon SQL editor.

## Editing content
- Site name, Google titles, keywords, categories, default courier price, colour theme, About text: `site.config.ts`
- Colour theme: set `theme` to `"plaster"`, `"stone"` or `"sage"` in `site.config.ts`
- Art styles, categories and price filters: `site.config.ts`
- Share image used when pages are posted to social media or shown by Google: `public/opengraph-image.png`
- Journal posts (10 guides): `content/posts.ts`. Mark up to five with `featured: true` to list them under "Popular guides" in the footer.
- Journal posts: `content/posts.ts` (copy an entry, change slug, date and text)
- Shipping and returns wording: `app/(site)/shipping-and-returns/page.tsx`

## How sales work
Each piece is one of one. Pressing Buy now places a 30-minute hold so two people can't pay for the same piece; an abandoned checkout releases it. When payment succeeds the piece is marked Sold (red dot) and stays listed until Melody takes it down in admin. The buyer and Melody both get an email, and marking an order shipped in admin emails the buyer their tracking number.
