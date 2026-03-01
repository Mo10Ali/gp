import Link from "next/link";
import type { Guide } from "@/types/guide";

export default function GuideCard({ item }: { item: Guide }) {
  const cover = item.avatar;
  const languages = (item.languages ?? []).join(" / ");
  const mainSpecialty = item.specialties?.[0] ?? "Guide";
  const price = typeof item.pricePerHour === "number" ? item.pricePerHour : 0;
  const rating = typeof item.rating === "number" ? item.rating : 0;

  return (
    <Link
      href={`/guides/${item.slug}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 18,
        overflow: "hidden",
        display: "grid",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", gap: 12, padding: 14, alignItems: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 999,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            flex: "0 0 auto",
          }}
        >
          {cover ? (
            <img
              src={cover}
              alt={item.fullName}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
          ) : null}
        </div>

        <div style={{ minWidth: 0, display: "grid", gap: 6, flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
            <div style={{ fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>
              {item.fullName}
            </div>
            <div style={{ opacity: 0.9, fontWeight: 800, whiteSpace: "nowrap" }}>
              ⭐ {rating.toFixed(1)}
            </div>
          </div>

          <div style={{ opacity: 0.8, fontSize: 13, lineHeight: 1.6 }}>
            {item.city} • {item.region}
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.06)",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {mainSpecialty}
            </span>

            {languages ? (
              <span style={{ fontSize: 12, opacity: 0.75 }}>
                {languages}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 14px 14px", display: "grid", gap: 10 }}>
        <div style={{ opacity: 0.85, lineHeight: 1.8 }}>
          {item.bio}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(item.specialties ?? []).slice(0, 2).map((t) => (
              <span key={t} style={{ fontSize: 12, opacity: 0.75 }}>
                #{t}
              </span>
            ))}
          </div>

          <div style={{ fontWeight: 900, opacity: 0.92, whiteSpace: "nowrap" }}>
            {price} SAR/Hour
          </div>
        </div>
      </div>
    </Link>
  );
}
