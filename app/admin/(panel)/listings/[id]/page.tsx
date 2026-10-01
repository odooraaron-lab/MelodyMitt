import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProductById } from "@/lib/products";
import { ListingForm } from "../../ListingForm";
import { setSold, setVisible, deleteListing } from "../../../actions";
import { ConfirmButton } from "../../ConfirmButton";

export const metadata = { title: "Edit listing" };

type Props = { params: Promise<{ id: string }> };

export default async function EditListing({ params }: Props) {
  await requireAdmin();
  const product = await getProductById(Number((await params).id));
  if (!product) notFound();

  return (
    <>
      <div className="admin-title">
        <h1>Edit listing</h1>
        {product.visible && (
          <Link href={`/shop/${product.slug}`} target="_blank" className="btn btn-quiet btn-small">
            View
          </Link>
        )}
      </div>

      <ListingForm product={product} />

      <div className="danger-zone">
        <form action={setSold}>
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="sold" value={product.status === "sold" ? "0" : "1"} />
          <button className="btn btn-quiet btn-small" type="submit">
            {product.status === "sold" ? "Mark as available" : "Mark as sold"}
          </button>
        </form>
        <form action={setVisible}>
          <input type="hidden" name="id" value={product.id} />
          <input type="hidden" name="visible" value={product.visible ? "0" : "1"} />
          <button className="btn btn-quiet btn-small" type="submit">
            {product.visible ? "Take down from shop" : "Put back in shop"}
          </button>
        </form>
        <form action={deleteListing}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmButton message={`Delete “${product.title}” and its photos for good?`}>Delete for good</ConfirmButton>
        </form>
      </div>
    </>
  );
}
