import { sql } from "./db";

export type ProductStatus = "available" | "reserved" | "sold";

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  medium: string;
  dimensions: string;
  year: string;
  price_cents: number;
  shipping_cents: number;
  images: string[];
  status: ProductStatus;
  visible: boolean;
  reserved_until: string | null;
  reserved_session_id: string | null;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
};

/** A reservation older than its expiry no longer blocks a sale. */
export const isOnHold = (p: Product) =>
  p.status === "reserved" && !!p.reserved_until && new Date(p.reserved_until) > new Date();

export const publicStatus = (p: Product): ProductStatus =>
  p.status === "reserved" && !isOnHold(p) ? "available" : p.status;

export async function listPublicProducts(opts: { category?: string; limit?: number } = {}) {
  const db = sql();
  const limit = opts.limit ?? 500;
  const rows = opts.category
    ? await db`SELECT * FROM products WHERE visible AND category = ${opts.category}
               ORDER BY (status = 'sold'), created_at DESC LIMIT ${limit}`
    : await db`SELECT * FROM products WHERE visible
               ORDER BY (status = 'sold'), created_at DESC LIMIT ${limit}`;
  return rows as Product[];
}

export async function getPublicProduct(slug: string) {
  const rows = (await sql()`SELECT * FROM products WHERE slug = ${slug} AND visible LIMIT 1`) as Product[];
  return rows[0] ?? null;
}

export async function listAllProducts() {
  return (await sql()`SELECT * FROM products ORDER BY created_at DESC`) as Product[];
}

export async function getProductById(id: number) {
  const rows = (await sql()`SELECT * FROM products WHERE id = ${id} LIMIT 1`) as Product[];
  return rows[0] ?? null;
}
