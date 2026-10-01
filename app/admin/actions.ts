"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { del } from "@vercel/blob";
import { sql } from "@/lib/db";
import { requireAdmin, checkCredentials, startSession, endSession } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { getOrder } from "@/lib/orders";
import { sendShippedEmail } from "@/lib/email";
import { slugify, toCents } from "@/lib/format";
import { site } from "@/site.config";

const refresh = () => revalidatePath("/", "layout");

async function deleteBlobs(urls: string[]) {
  if (!urls.length || !process.env.BLOB_READ_WRITE_TOKEN) return;
  await del(urls).catch((e) => console.error("Photo cleanup failed", e));
}

// ---------- Session ----------

export async function login(formData: FormData) {
  const ok = checkCredentials(String(formData.get("username") ?? ""), String(formData.get("password") ?? ""));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 800)); // slows down password guessing
    redirect("/admin/login?error=1");
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---------- Listings ----------

export type SaveState = { error: string };

export async function saveListing(_prev: SaveState, formData: FormData): Promise<SaveState> {
  await requireAdmin();

  const id = Number(formData.get("id") || 0);
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "art");
  const medium = String(formData.get("medium") ?? "").trim();
  const dimensions = String(formData.get("dimensions") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const price = toCents(formData.get("price"));
  const shipping = toCents(formData.get("shipping"));
  const intent = String(formData.get("intent") ?? "");
  let images: string[] = [];
  try {
    images = (JSON.parse(String(formData.get("images") ?? "[]")) as unknown[]).filter(
      (u): u is string => typeof u === "string" && u.startsWith("https://")
    );
  } catch {
    /* handled below */
  }

  if (!title) return { error: "Add a title." };
  if (!images.length) return { error: "Add at least one photo." };
  if (!Number.isFinite(price) || price < 50) return { error: "Enter a price of at least $0.50." };
  if (!Number.isFinite(shipping) || shipping < 0) return { error: "Enter a courier cost (0 for free)." };
  if (!site.categories.some((c) => c.id === category)) return { error: "Choose a category." };

  const imagesJson = JSON.stringify(images);

  if (id) {
    const existing = await getProductById(id);
    if (!existing) return { error: "This listing no longer exists." };
    await sql()`UPDATE products SET
        title = ${title}, description = ${description}, category = ${category}, medium = ${medium},
        dimensions = ${dimensions}, year = ${year}, price_cents = ${price}, shipping_cents = ${shipping},
        images = ${imagesJson}::jsonb, updated_at = now()
      WHERE id = ${id}`;
    await deleteBlobs(existing.images.filter((u) => !images.includes(u)));
  } else {
    const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 6)}`;
    await sql()`INSERT INTO products
        (slug, title, description, category, medium, dimensions, year, price_cents, shipping_cents, images, visible)
      VALUES (${slug}, ${title}, ${description}, ${category}, ${medium}, ${dimensions}, ${year},
              ${price}, ${shipping}, ${imagesJson}::jsonb, ${intent !== "hide"})`;
  }

  refresh();
  redirect(`/admin?saved=${encodeURIComponent(title)}`);
}

export async function setSold(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const sold = formData.get("sold") === "1";
  if (sold) {
    await sql()`UPDATE products SET status = 'sold', sold_at = now(), reserved_until = NULL,
                reserved_session_id = NULL, updated_at = now() WHERE id = ${id}`;
  } else {
    await sql()`UPDATE products SET status = 'available', sold_at = NULL, reserved_until = NULL,
                reserved_session_id = NULL, updated_at = now() WHERE id = ${id}`;
  }
  refresh();
  redirect(`/admin/listings/${id}`);
}

export async function setVisible(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const visible = formData.get("visible") === "1";
  await sql()`UPDATE products SET visible = ${visible}, updated_at = now() WHERE id = ${id}`;
  refresh();
  redirect(`/admin/listings/${id}`);
}

export async function deleteListing(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const product = await getProductById(id);
  if (product) {
    await sql()`DELETE FROM products WHERE id = ${id}`;
    await deleteBlobs(product.images);
  }
  refresh();
  redirect("/admin?deleted=1");
}

// ---------- Orders ----------

export async function markShipped(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const tracking = String(formData.get("tracking") ?? "").trim();
  await sql()`UPDATE orders SET status = 'shipped', tracking = ${tracking}, shipped_at = now() WHERE id = ${id}`;
  const order = await getOrder(id);
  if (order) await sendShippedEmail(order);
  redirect("/admin/orders");
}
