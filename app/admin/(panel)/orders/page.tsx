import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listOrders, addressLines } from "@/lib/orders";
import { formatNzd, formatDate } from "@/lib/format";
import { markShipped } from "../../actions";

export const metadata = { title: "Orders" };

export default async function Orders() {
  await requireAdmin();
  const orders = await listOrders();

  return (
    <>
      <div className="admin-title">
        <h1>Orders</h1>
      </div>
      {!orders.length && <p className="empty">No orders yet. Sales will appear here the moment they're paid.</p>}
      {orders.map((o) => (
        <section key={o.id} className="order">
          <div className="order-top">
            <span className="title" style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 19 }}>
              {o.product_id ? <Link href={`/admin/listings/${o.product_id}`}>{o.product_title}</Link> : o.product_title}
            </span>
            <strong>{formatNzd(o.amount_total)}</strong>
          </div>
          <p className="muted" style={{ fontSize: 14 }}>
            Paid {formatDate(o.created_at)}, includes {formatNzd(o.shipping_amount)} courier
          </p>
          <address>
            <strong>{o.shipping_name || o.customer_name}</strong>
            <br />
            {addressLines(o.shipping_address).map((l) => (
              <span key={l}>
                {l}
                <br />
              </span>
            ))}
            <a href={`mailto:${o.customer_email}`}>{o.customer_email}</a>
            {o.customer_phone && (
              <>
                <br />
                <a href={`tel:${o.customer_phone}`}>{o.customer_phone}</a>
              </>
            )}
          </address>
          {o.status === "shipped" ? (
            <p className="sub" style={{ fontSize: 14 }}>
              Shipped {o.shipped_at ? formatDate(o.shipped_at) : ""}
              {o.tracking ? `, tracking ${o.tracking}` : ""}. The buyer has been emailed.
            </p>
          ) : (
            <form action={markShipped}>
              <input type="hidden" name="id" value={o.id} />
              <input className="input" name="tracking" placeholder="Courier tracking number" aria-label="Tracking number" />
              <button className="btn btn-small" type="submit">
                Mark shipped and email buyer
              </button>
            </form>
          )}
        </section>
      ))}
    </>
  );
}
