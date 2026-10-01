-- Melody Mitt shop schema. Paste into the Neon SQL editor, or run: npm run db:setup

CREATE TABLE IF NOT EXISTS products (
  id                  SERIAL PRIMARY KEY,
  slug                TEXT UNIQUE NOT NULL,
  title               TEXT NOT NULL,
  description         TEXT NOT NULL DEFAULT '',
  category            TEXT NOT NULL DEFAULT 'art',
  style               TEXT NOT NULL DEFAULT '',
  medium              TEXT NOT NULL DEFAULT '',
  dimensions          TEXT NOT NULL DEFAULT '',
  year                TEXT NOT NULL DEFAULT '',
  price_cents         INTEGER NOT NULL CHECK (price_cents >= 50),
  shipping_cents      INTEGER NOT NULL DEFAULT 0 CHECK (shipping_cents >= 0),
  images              JSONB NOT NULL DEFAULT '[]'::jsonb,
  blurs               JSONB NOT NULL DEFAULT '{}'::jsonb,
  stripe_product_id   TEXT NOT NULL DEFAULT '',
  status              TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold')),
  visible             BOOLEAN NOT NULL DEFAULT TRUE,
  reserved_until      TIMESTAMPTZ,
  reserved_session_id TEXT,
  sold_at             TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_visible_idx ON products (visible, created_at DESC);

CREATE TABLE IF NOT EXISTS orders (
  id                SERIAL PRIMARY KEY,
  product_id        INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_title     TEXT NOT NULL,
  product_style     TEXT NOT NULL DEFAULT '',
  stripe_session_id TEXT UNIQUE NOT NULL,
  customer_name     TEXT NOT NULL DEFAULT '',
  customer_email    TEXT NOT NULL DEFAULT '',
  customer_phone    TEXT NOT NULL DEFAULT '',
  shipping_name     TEXT NOT NULL DEFAULT '',
  shipping_address  JSONB NOT NULL DEFAULT '{}'::jsonb,
  amount_total      INTEGER NOT NULL DEFAULT 0,
  shipping_amount   INTEGER NOT NULL DEFAULT 0,
  status            TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'shipped')),
  tracking          TEXT NOT NULL DEFAULT '',
  marketing_opt_in  BOOLEAN NOT NULL DEFAULT FALSE,
  follow_up_sent_at TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  shipped_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS orders_created_idx ON orders (created_at DESC);

-- People who unsubscribed from follow-up emails
CREATE TABLE IF NOT EXISTS email_optouts (
  email      TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Columns added after launch. The site adds these itself on first run (lib/db.ts);
-- they're here so an older database can also be upgraded by hand. Safe to run more than once.
ALTER TABLE products ADD COLUMN IF NOT EXISTS style TEXT NOT NULL DEFAULT '';
ALTER TABLE products ADD COLUMN IF NOT EXISTS blurs JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS stripe_product_id TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS product_style TEXT NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS follow_up_sent_at TIMESTAMPTZ;
