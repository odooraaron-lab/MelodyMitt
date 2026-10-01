import Link from "next/link";

export default function NotFound() {
  return (
    <div className="login">
      <div style={{ textAlign: "center", display: "grid", gap: 14 }}>
        <h1 style={{ fontSize: 32 }}>This page has moved on</h1>
        <p className="muted">The piece may have been taken down, or the link is mistyped.</p>
        <p>
          <Link href="/shop">Browse the shop</Link>
        </p>
      </div>
    </div>
  );
}
