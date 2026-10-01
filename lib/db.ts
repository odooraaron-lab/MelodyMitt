import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | null = null;

export function sql() {
  if (!client) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}

// Adds columns introduced after launch, so a database created from an older schema.sql keeps working
// without anyone having to run SQL by hand. Checked once per server instance.
let schemaReady: Promise<void> | null = null;

export function ensureSchema() {
  schemaReady ??= (async () => {
    const db = sql();
    const has = (await db`SELECT 1 FROM information_schema.columns
                          WHERE table_name = 'products' AND column_name = 'style'`) as unknown[];
    if (!has.length) await db`ALTER TABLE products ADD COLUMN IF NOT EXISTS style TEXT NOT NULL DEFAULT ''`;
  })().catch((err) => {
    schemaReady = null; // try again on the next request
    throw err;
  });
  return schemaReady;
}
