"use client";

import { useActionState, useRef, useState } from "react";
import { saveListing, type SaveState } from "../actions";
import { site } from "@/site.config";
import type { Product } from "@/lib/products";

type Photo = { key: string; url?: string; preview?: string; error?: string };

const MAX_EDGE = 2000;

/** Shrinks phone photos (often 5-12 MB) to a sharp ~2000px JPEG before upload. */
async function resize(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.86));
    return blob ?? file;
  } catch {
    return file; // unusual formats: upload as-is
  }
}

const cents = (c?: number) => (c === undefined ? "" : (c / 100).toFixed(c % 100 ? 2 : 0));

export function ListingForm({ product }: { product?: Product }) {
  const [state, action, saving] = useActionState<SaveState, FormData>(saveListing, { error: "" });
  const [photos, setPhotos] = useState<Photo[]>(
    (product?.images ?? []).map((url) => ({ key: url, url }))
  );
  const cameraInput = useRef<HTMLInputElement>(null);
  const libraryInput = useRef<HTMLInputElement>(null);

  const uploading = photos.some((p) => !p.url && !p.error);
  const urls = photos.filter((p) => p.url).map((p) => p.url!);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const batch = Array.from(files).map((file) => ({
      file,
      key: `${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...batch.map(({ key, preview }) => ({ key, preview }))]);

    await Promise.all(
      batch.map(async ({ file, key }) => {
        const update = (patch: Partial<Photo>) =>
          setPhotos((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));
        try {
          const body = new FormData();
          body.append("file", await resize(file), "photo.jpg");
          const res = await fetch("/api/admin/upload", { method: "POST", body });
          const data = await res.json().catch(() => ({}));
          if (!res.ok || !data.url) throw new Error(data.error || "Upload failed. Check your connection and try again.");
          update({ url: data.url });
        } catch (e) {
          update({ error: e instanceof Error ? e.message : "Upload failed." });
        }
      })
    );
  }

  const remove = (key: string) => setPhotos((prev) => prev.filter((p) => p.key !== key));
  const makeCover = (key: string) =>
    setPhotos((prev) => [...prev.filter((p) => p.key === key), ...prev.filter((p) => p.key !== key)]);

  return (
    <form action={action} className="form">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="images" value={JSON.stringify(urls)} />

      <div className="field">
        <span className="field-label">Photos</span>
        <span className="hint">The first photo is the cover. Shoot against a plain wall in daylight for the best result.</span>
        <div className="photo-actions">
          <button type="button" className="btn btn-quiet" onClick={() => cameraInput.current?.click()}>
            Take photo
          </button>
          <button type="button" className="btn btn-quiet" onClick={() => libraryInput.current?.click()}>
            Upload photos
          </button>
        </div>
        <input
          ref={cameraInput}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={libraryInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {photos.length > 0 && (
          <div className="photos">
            {photos.map((p, i) => (
              <div key={p.key} className={`photo${!p.url && !p.error ? " uploading" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview ?? p.url} alt={`Photo ${i + 1}`} />
                {i === 0 && p.url && <span className="cover-tag">Cover</span>}
                {!p.url && !p.error && <span className="progress">Uploading</span>}
                {p.error && (
                  <span className="progress form-error" style={{ padding: 8, textAlign: "center" }}>
                    {p.error}
                  </span>
                )}
                <div className="photo-tools">
                  {i > 0 && p.url ? (
                    <button type="button" aria-label="Make cover photo" title="Make cover" onClick={() => makeCover(p.key)}>
                      ★
                    </button>
                  ) : (
                    <span />
                  )}
                  <button type="button" aria-label="Remove photo" title="Remove" onClick={() => remove(p.key)}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="title">Title</label>
        <input className="input" id="title" name="title" defaultValue={product?.title} required />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="price">Price (NZD)</label>
          <input
            className="input"
            id="price"
            name="price"
            inputMode="decimal"
            placeholder="450"
            defaultValue={cents(product?.price_cents)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="shipping">Courier (NZD)</label>
          <input
            className="input"
            id="shipping"
            name="shipping"
            inputMode="decimal"
            defaultValue={product ? cents(product.shipping_cents) : String(site.defaultShippingNzd)}
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="category">Category</label>
        <select className="select" id="category" name="category" defaultValue={product?.category ?? "art"}>
          {site.categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <span className="hint">What it is, the story behind it, condition. A few sentences helps buyers and Google.</span>
        <textarea className="textarea" id="description" name="description" defaultValue={product?.description} />
      </div>

      <div className="field">
        <label htmlFor="medium">Medium or material</label>
        <input className="input" id="medium" name="medium" placeholder="Oil on canvas" defaultValue={product?.medium} />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="dimensions">Size</label>
          <input
            className="input"
            id="dimensions"
            name="dimensions"
            placeholder="60 × 80 cm"
            defaultValue={product?.dimensions}
          />
        </div>
        <div className="field">
          <label htmlFor="year">Year</label>
          <input className="input" id="year" name="year" inputMode="numeric" placeholder="2026" defaultValue={product?.year} />
        </div>
      </div>

      <label className="check">
        <input type="checkbox" name="visible" defaultChecked={product?.visible ?? true} />
        Show in shop
      </label>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      <div className="form-actions">
        <button className="btn" type="submit" disabled={saving || uploading}>
          {uploading ? "Waiting for photos" : saving ? "Saving" : product ? "Save changes" : "Publish listing"}
        </button>
        <a className="btn btn-quiet" href="/admin">
          Cancel
        </a>
      </div>
    </form>
  );
}
