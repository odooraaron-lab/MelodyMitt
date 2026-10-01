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

  const photoInputs = (
    <>
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
    </>
  );

  return (
    <form action={action} className="form">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="images" value={JSON.stringify(urls)} />
      {photoInputs}

      <section className="step">
        <div className="step-head">
          <span className="num">1</span>
          <h2>Photos</h2>
        </div>
        {photos.length > 0 && (
          <div className="photos">
            {photos.map((p, i) => (
              <div key={p.key} className={`photo${!p.url && !p.error ? " uploading" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.preview ?? p.url} alt={`Photo ${i + 1}`} />
                {i === 0 && p.url && <span className="cover-tag">Cover</span>}
                {!p.url && !p.error && <span className="progress">Uploading</span>}
                {p.error && <span className="progress form-error">{p.error}</span>}
                <div className="photo-tools">
                  {i > 0 && p.url ? (
                    <button type="button" onClick={() => makeCover(p.key)}>
                      Cover
                    </button>
                  ) : (
                    <span />
                  )}
                  <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => remove(p.key)}>
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="photo-drop">
          <div className="field-row">
            <button type="button" className="btn" onClick={() => cameraInput.current?.click()}>
              Take photo
            </button>
            <button type="button" className="btn btn-quiet" onClick={() => libraryInput.current?.click()}>
              Choose photos
            </button>
          </div>
          <p className="hint">
            {photos.length ? "The first photo is the cover. Tap Cover on another to swap." : "Daylight against a plain wall works best."}
          </p>
        </div>
      </section>

      <section className="step">
        <div className="step-head">
          <span className="num">2</span>
          <h2>About the piece</h2>
        </div>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input className="input" id="title" name="title" defaultValue={product?.title} required />
        </div>
        <div className="field">
          <label htmlFor="description">
            Description <span className="optional">(recommended)</span>
          </label>
          <textarea
            className="textarea"
            id="description"
            name="description"
            placeholder="What it is, the story behind it, its condition."
            defaultValue={product?.description}
          />
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
          <label htmlFor="style">
            Style <span className="optional">(helps buyers browse)</span>
          </label>
          <select className="select" id="style" name="style" defaultValue={product?.style ?? ""}>
            <option value="">No particular style</option>
            {site.styles.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="medium">
            Medium or material <span className="optional">(optional)</span>
          </label>
          <input className="input" id="medium" name="medium" placeholder="Oil on canvas" defaultValue={product?.medium} />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="dimensions">
              Size <span className="optional">(optional)</span>
            </label>
            <input className="input" id="dimensions" name="dimensions" placeholder="60 × 80 cm" defaultValue={product?.dimensions} />
          </div>
          <div className="field">
            <label htmlFor="year">
              Year <span className="optional">(optional)</span>
            </label>
            <input className="input" id="year" name="year" inputMode="numeric" placeholder="2026" defaultValue={product?.year} />
          </div>
        </div>
      </section>

      <section className="step">
        <div className="step-head">
          <span className="num">3</span>
          <h2>Price</h2>
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="price">Price</label>
            <div className="money">
              <span aria-hidden>$</span>
              <input className="input" id="price" name="price" inputMode="decimal" placeholder="450" defaultValue={cents(product?.price_cents)} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="shipping">Courier</label>
            <div className="money">
              <span aria-hidden>$</span>
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
        </div>
        <p className="hint">NZ dollars. The buyer pays the courier cost on top of the price.</p>
      </section>

      {state.error && (
        <p className="form-error" role="alert">
          {state.error}
        </p>
      )}

      <div className="form-actions">
        {product ? (
          <>
            <button className="btn" type="submit" disabled={saving || uploading}>
              {uploading ? "Waiting for photos" : saving ? "Saving" : "Save changes"}
            </button>
            <a className="btn btn-quiet" href="/admin">
              Cancel
            </a>
          </>
        ) : (
          <>
            <button className="btn" type="submit" name="intent" value="publish" disabled={saving || uploading}>
              {uploading ? "Waiting for photos" : saving ? "Saving" : "Put in shop"}
            </button>
            <button className="btn btn-quiet" type="submit" name="intent" value="hide" disabled={saving || uploading}>
              Save hidden
            </button>
          </>
        )}
      </div>
    </form>
  );
}
