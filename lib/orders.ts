import { sql } from "./db";

export type Address = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

export type Order = {
  id: number;
  product_id: number | null;
  product_title: string;
  stripe_session_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_name: string;
  shipping_address: Address;
  amount_total: number;
  shipping_amount: number;
  status: "paid" | "shipped";
  tracking: string;
  created_at: string;
  shipped_at: string | null;
};

// NZ style: street, suburb, "City 1234". Country is omitted since every order ships within NZ.
export const addressLines = (a: Address) =>
  [a.line1, a.line2, a.state, [a.city, a.postal_code].filter(Boolean).join(" ")]
    .map((s) => (s ?? "").trim())
    .filter(Boolean);

export async function listOrders() {
  return (await sql()`SELECT * FROM orders ORDER BY created_at DESC LIMIT 200`) as Order[];
}

export async function getOrder(id: number) {
  const rows = (await sql()`SELECT * FROM orders WHERE id = ${id}`) as Order[];
  return rows[0] ?? null;
}
