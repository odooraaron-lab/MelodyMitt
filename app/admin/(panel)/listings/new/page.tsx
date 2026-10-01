import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { ListingForm } from "../../ListingForm";

export const metadata = { title: "New piece" };

export default async function NewListing() {
  await requireAdmin();
  return (
    <>
      <Link href="/admin" className="back">
        Back to listings
      </Link>
      <div className="admin-title">
        <h1>New piece</h1>
      </div>
      <ListingForm />
    </>
  );
}
