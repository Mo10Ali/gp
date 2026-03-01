"use client";

import { useMemo, useState } from "react";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const list = useMemo(() => images?.filter(Boolean) ?? [], [images]);
  const [active, setActive] = useState(0);

  if (!list.length) return null;

  const main = list[Math.min(active, list.length - 1)];

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <div
        style={{
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.04)",
        }}
      >
        <img
          src={main}
          alt={title}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {list.length > 1 ? (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {list.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              style={{
                width: 90,
                height: 58,
                borderRadius: 12,
                overflow: "hidden",
                border: i === active ? "2px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                padding: 0,
                cursor: "pointer",
              }}
              aria-label={`Image ${i + 1}`}
            >
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
