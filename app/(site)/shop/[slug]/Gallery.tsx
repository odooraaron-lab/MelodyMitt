"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = track.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };
  const go = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  if (!images.length)
    return (
      <div className="gallery">
        <div className="wall">
          <span className="wall-empty">Photo coming</span>
        </div>
      </div>
    );

  return (
    <div className="gallery">
      <div className="gallery-track" ref={track} onScroll={onScroll}>
        {images.map((src, i) => (
          <div className="gallery-slide" key={src}>
            <div className="wall">
              <Image
                src={src}
                alt={i === 0 ? title : `${title}, view ${i + 1}`}
                fill
                sizes="(min-width: 900px) 55vw, 100vw"
                priority={i === 0}
              />
            </div>
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="gallery-dots">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Show photo ${i + 1} of ${images.length}`}
              aria-current={i === index}
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
