import Link from "next/link";

type DestinationCardProps = {
  id: string;
  slug: string;
  title: string;
  city: string;
  region: string;
  category: string;
  summary: string;
  images: string[];
  tags: string[];
  rating: number;
};

export default function DestinationCard({ 
  id, 
  slug, 
  title, 
  city, 
  region, 
  category, 
  summary, 
  images, 
  tags, 
  rating 
}: DestinationCardProps) {
  const cover = images && images.length > 0 ? images[0] : '/images/logo.png';

  return (
    <Link
      href={`/destinations/${slug}`}
      className="card"
      style={{
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
        padding: 0,
        transition: "all 0.3s ease",
      }}
    >
      <div style={{ aspectRatio: "16/10", background: "#1a1a1a", overflow: "hidden" }}>
        <img
          src={cover}
          alt={title}
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
          onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
        />
      </div>
      <div style={{ padding: 18 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ 
            padding: "4px 8px", 
            borderRadius: 6, 
            fontSize: 11, 
            fontWeight: 700,
            background: "#3b82f620",
            color: "#3b82f6"
          }}>
            {category}
          </span>
          <span style={{ 
            padding: "4px 8px", 
            borderRadius: 6, 
            fontSize: 11, 
            fontWeight: 700,
            background: "rgba(0, 108, 53, 0.1)",
            color: "var(--saudi-green)"
          }}>
            {city}
          </span>
        </div>

        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
        <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
          {summary}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#D4AF37", fontWeight: 800 }}>⭐ {rating}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>{region}</div>
        </div>
      </div>
    </Link>
  );
}