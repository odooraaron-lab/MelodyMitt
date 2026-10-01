import { sql, ensureSchema } from "./db";
import { site } from "@/site.config";

export type ProductStatus = "available" | "reserved" | "sold";

export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  style: string;
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

export type ProductFilter = { category?: string; style?: string; price?: string; limit?: number };

/** Visible pieces, available first then sold, newest first. The catalogue is small, so filtering happens here. */
export async function listPublicProducts(f: ProductFilter = {}) {
  await ensureSchema();
  const rows = (await sql()`SELECT * FROM products WHERE visible
                            ORDER BY (status = 'sold'), created_at DESC LIMIT 1000`) as Product[];
  const band = site.priceBands.find((b) => b.id === f.price);
  return rows
    .filter((p) => !f.category || p.category === f.category)
    .filter((p) => !f.style || p.style === f.style)
    .filter((p) => !band || (p.price_cents >= band.min && p.price_cents <= band.max))
    .slice(0, f.limit ?? 1000);
}

export async function getPublicProduct(slug: string) {
  await ensureSchema();
  const rows = (await sql()`SELECT * FROM products WHERE slug = ${slug} AND visible LIMIT 1`) as Product[];
  return rows[0] ?? null;
}

export async function listAllProducts() {
  await ensureSchema();
  return (await sql()`SELECT * FROM products ORDER BY created_at DESC`) as Product[];
}

export async function getProductById(id: number) {
  await ensureSchema();
  const rows = (await sql()`SELECT * FROM products WHERE id = ${id} LIMIT 1`) as Product[];
  return rows[0] ?? null;
}
