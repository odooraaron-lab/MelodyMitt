import { requireAdmin } from "@/lib/auth";
import { ListingForm } from "../../ListingForm";

export const metadata = { title: "New listing" };

export default async function NewListing() {
  await requireAdmin();
  return (
    <>
      <div className="admin-title">
        <h1>New listing</h1>
      </div>
      <ListingForm />
    </>
  );
}
