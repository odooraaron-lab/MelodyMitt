import Link from "next/link";

export default function NotFound() {
  return (
    <main className="studio">
      <div className="wall-label" style={{ maxWidth: 380 }}>
        <div className="label-head">
          <p className="label-artist">Melody Mitt</p>
          <p className="label-title">This page has moved on</p>
          <p className="label-medium">The piece may have sold and been taken down, or the link is mistyped.</p>
        </div>
        <Link href="/shop" className="btn">
          Browse the shop
        </Link>
      </div>
    </main>
  );
}
