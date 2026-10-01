import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import { site } from "@/site.config";

export const dynamic = "force-dynamic";

export default async function Panel({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <div className="admin-bar">
        <div className="wrap">
          <Link href="/admin" className="wordmark" style={{ fontSize: 20 }}>
            {site.name}
          </Link>
          <nav>
            <Link href="/admin">Listings</Link>
            <Link href="/admin/orders">Orders</Link>
            <Link href="/" target="_blank">
              View site
            </Link>
            <form action={logout}>
              <button className="link" type="submit">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </div>
      <div className="wrap admin-main">{children}</div>
    </>
  );
}
