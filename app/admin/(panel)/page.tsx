import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listAllProducts, publicStatus, type Product } from "@/lib/products";
import { formatNzd } from "@/lib/format";

type Props = { searchParams: Promise<{ f?: string; saved?: string; deleted?: string }> };

const filters = [
  { id: "all", label: "All" },
  { id: "available", label: "For sale" },
  { id: "sold", label: "Sold" },
  { id: "hidden", label: "Hidden" },
];

const matches = (p: Product, f: string) =>
  f === "hidden" ? !p.visible : f === "sold" ? p.status === "sold" : f === "available" ? p.status !== "sold" && p.visible : true;

export default async function Listings({ searchParams }: Props) {
  await requireAdmin();
  const { f = "all", saved, deleted } = await searchParams;
  const all = await listAllProducts();
  const shown = all.filter((p) => matches(p, f));

  return (
    <>
      <div className="admin-title">
        <h1>Listings</h1>
        <Link href="/admin/listings/new" className="btn btn-small">
          New listing
        </Link>
      </div>

      {saved && (
        <p className="notice" role="status">
          Saved “{saved}”.
        </p>
      )}
      {deleted && (
        <p className="notice" role="status">
          Listing deleted.
        </p>
      )}

      <nav className="tabs" aria-label="Filter listings">
        {filters.map((x) => (
          <Link
            key={x.id}
            href={x.id === "all" ? "/admin" : `/admin?f=${x.id}`}
            className="chip"
            aria-current={f === x.id ? "page" : undefined}
          >
            {x.label} ({all.filter((p) => matches(p, x.id)).length})
          </Link>
        ))}
      </nav>

      {shown.length ? (
        <ul className="row-list">
          {shown.map((p) => {
            const status = publicStatus(p);
            return (
              <li key={p.id}>
                <Link href={`/admin/listings/${p.id}`} className="row">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="row-thumb" src={p.images[0]} alt="" />
                  ) : (
                    <span className="row-thumb" />
                  )}
                  <span>
                    <span className="title">{p.title}</span>
                    <span className="sub">
                      {formatNzd(p.price_cents)}
                      {status === "sold" && (
                        <>
                          <span className="red-dot" aria-hidden /> Sold
                        </>
                      )}
                      {status === "reserved" && <span className="badge">In checkout</span>}
                      {!p.visible && <span className="badge">Hidden</span>}
                    </span>
                  </span>
                  <span className="muted" aria-hidden>
                    Edit
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="empty">
          {all.length ? "Nothing in this view." : "No listings yet. Tap New listing to photograph your first piece."}
        </p>
      )}
    </>
  );
}
