import { neon } from "@neondatabase/serverless";

let client: ReturnType<typeof neon> | null = null;

export function sql() {
  if (!client) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    client = neon(process.env.DATABASE_URL);
  }
  return client;
}

// Columns added after launch. The site adds any that are missing itself, so a database created
// from an older schema.sql keeps working without anyone running SQL by hand.
const LATER_COLUMNS: [table: string, column: string, definition: string][] = [
  ["products", "style", "TEXT NOT NULL DEFAULT ''"],
  ["products", "blurs", "JSONB NOT NULL DEFAULT '{}'::jsonb"],
  ["products", "stripe_product_id", "TEXT NOT NULL DEFAULT ''"],
  ["orders", "product_style", "TEXT NOT NULL DEFAULT ''"],
  ["orders", "marketing_opt_in", "BOOLEAN NOT NULL DEFAULT FALSE"],
  ["orders", "follow_up_sent_at", "TIMESTAMPTZ"],
];

let schemaReady: Promise<void> | null = null;

/** Checked once per server instance; cheap after that. */
export function ensureSchema() {
  schemaReady ??= (async () => {
    const db = sql();
    const existing = (await db`SELECT table_name, column_name FROM information_schema.columns
                               WHERE table_name IN ('products', 'orders')`) as { table_name: string; column_name: string }[];
    const have = new Set(existing.map((r) => `${r.table_name}.${r.column_name}`));
    await db`CREATE TABLE IF NOT EXISTS email_optouts (
               email TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
    for (const [table, column, definition] of LATER_COLUMNS) {
      // Identifiers come from the constant list above, never from user input.
      if (!have.has(`${table}.${column}`)) await db.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${column} ${definition}`);
    }
  })().catch((err) => {
    schemaReady = null; // try again on the next request
    throw err;
  });
  return schemaReady;
}
