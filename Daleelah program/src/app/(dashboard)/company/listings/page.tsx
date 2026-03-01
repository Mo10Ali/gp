"use client";

import { useState } from "react";
import Link from "next/link";

type Listing = {
  id: string;
  title: string;
  type: "tour" | "package" | "activity";
  description: string;
  price: number;
  duration: string;
  maxParticipants: number;
  status: "active" | "inactive" | "draft";
  bookingsCount: number;
  rating: number;
  image?: string;
};

const initialListings: Listing[] = [
  {
    id: "L001",
    title: "جولة تراثية في الدرعية",
    type: "tour",
    description: "استكشف التاريخ النجدي في الدرعية التاريخية",
    price: 1200,
    duration: "يوم كامل",
    maxParticipants: 15,
    status: "active",
    bookingsCount: 24,
    rating: 4.8,
    image: "/images/diriyah_1.webp",
  },
  {
    id: "L002",
    title: "تجربة الصحراء - سفاري",
    type: "activity",
    description: "مغامرة صحراوية مع التخييم والعشاء البدوي",
    price: 800,
    duration: "4 ساعات",
    maxParticipants: 20,
    status: "active",
    bookingsCount: 18,
    rating: 4.9,
  },
  {
    id: "L003",
    title: "جولة المشي في حي الطريف",
    type: "tour",
    description: "جولة مشي إرشادية في الحي التاريخي",
    price: 450,
    duration: "2 ساعة",
    maxParticipants: 10,
    status: "inactive",
    bookingsCount: 12,
    rating: 4.5,
  },
  {
    id: "L004",
    title: "باقة الرياض الكاملة - 3 أيام",
    type: "package",
    description: "تجربة شاملة تشمل الإقامة والمواصلات",
    price: 2500,
    duration: "3 أيام",
    maxParticipants: 8,
    status: "draft",
    bookingsCount: 0,
    rating: 0,
  },
];

export default function CompanyListingsPage() {
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [filter, setFilter] = useState<string>("all");

  const filteredListings = filter === "all" ? listings : listings.filter((l) => l.status === filter);

  const handleToggleStatus = (id: string) => {
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const newStatus = l.status === "active" ? "inactive" : "active";
          return { ...l, status: newStatus as "active" | "inactive" };
        }
        return l;
      })
    );
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذه القائمة؟");
    if (confirmed) {
      setListings((prev) => prev.filter((l) => l.id !== id));
      alert("تم الحذف بنجاح");
    }
  };

  const activeCount = listings.filter((l) => l.status === "active").length;
  const inactiveCount = listings.filter((l) => l.status === "inactive").length;
  const draftCount = listings.filter((l) => l.status === "draft").length;

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>إدارة القوائم</h1>
          <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>إدارة الجولات والأنشطة والباقات السياحية</p>
        </div>
        <Link href="/company/listings/new" className="btnPrimary">
          + إضافة قائمة جديدة
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <StatCard title="قوائم نشطة" value={activeCount} color="#22c55e" />
        <StatCard title="قوائم متوقفة" value={inactiveCount} color="#6b7280" />
        <StatCard title="مسودات" value={draftCount} color="#eab308" />
        <StatCard title="إجمالي الحجوزات" value={listings.reduce((sum, l) => sum + l.bookingsCount, 0)} color="#3b82f6" />
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <FilterTab label="الكل" count={listings.length} active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterTab label="نشطة" count={activeCount} active={filter === "active"} onClick={() => setFilter("active")} />
        <FilterTab label="متوقفة" count={inactiveCount} active={filter === "inactive"} onClick={() => setFilter("inactive")} />
        <FilterTab label="مسودات" count={draftCount} active={filter === "draft"} onClick={() => setFilter("draft")} />
      </div>

      {filteredListings.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>لا توجد قوائم</h3>
          <p style={{ margin: 0, color: "var(--muted)" }}>ابدأ بإضافة قائمة جديدة</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onToggle={handleToggleStatus} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </main>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 900, color }}>{value}</div>
    </div>
  );
}

function FilterTab({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        borderRadius: 12,
        border: active ? "1px solid var(--saudi-green)" : "1px solid var(--border)",
        background: active ? "rgba(0, 108, 53, 0.15)" : "transparent",
        color: active ? "var(--saudi-green)" : "var(--text)",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 14,
      }}
    >
      {label} ({count})
    </button>
  );
}

function ListingCard({
  listing,
  onToggle,
  onDelete,
}: {
  listing: Listing;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const statusColors = {
    active: { bg: "#22c55e20", color: "#22c55e" },
    inactive: { bg: "#6b728020", color: "#6b7280" },
    draft: { bg: "#eab30820", color: "#eab308" },
  };

  const statusLabels = {
    active: "نشطة",
    inactive: "متوقفة",
    draft: "مسودة",
  };

  const typeLabels = {
    tour: "جولة",
    package: "باقة",
    activity: "نشاط",
  };

  const style = statusColors[listing.status];

  return (
    <div className="card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      {listing.image && (
        <div style={{ width: 250, flexShrink: 0, background: "#1a1a1a" }}>
          <img src={listing.image} alt={listing.title} style={{ width: "100%", height: "100%", objectFit: "cover", minHeight: 200 }} />
        </div>
      )}
      <div style={{ flex: 1, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", minWidth: 300 }}>
        <div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 700,
                background: "#3b82f620",
                color: "#3b82f6",
              }}
            >
              {typeLabels[listing.type]}
            </span>
            <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: style.bg, color: style.color }}>
              {statusLabels[listing.status]}
            </span>
          </div>

          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{listing.title}</h3>
          <p style={{ margin: "0 0 12px", color: "var(--muted)", lineHeight: 1.6 }}>{listing.description}</p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12, marginBottom: 12 }}>
            <InfoItem label="السعر" value={listing.price + " SAR"} />
            <InfoItem label="المدة" value={listing.duration} />
            <InfoItem label="الحد الأقصى" value={listing.maxParticipants + " شخص"} />
            {listing.rating > 0 && <InfoItem label="التقييم" value={"⭐ " + listing.rating} />}
          </div>

          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {listing.bookingsCount} حجز حتى الآن
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
          <button className="btn" style={{ fontSize: 14 }}>
            تعديل
          </button>
          {listing.status !== "draft" && (
            <button onClick={() => onToggle(listing.id)} className="btn" style={{ fontSize: 14 }}>
              {listing.status === "active" ? "إيقاف" : "تفعيل"}
            </button>
          )}
          <button
            onClick={() => onDelete(listing.id)}
            style={{
              padding: "8px 14px",
              borderRadius: 12,
              border: "1px solid #ef4444",
              background: "rgba(239, 68, 68, 0.1)",
              color: "#ef4444",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 14 }}>{value}</div>
    </div>
  );
}