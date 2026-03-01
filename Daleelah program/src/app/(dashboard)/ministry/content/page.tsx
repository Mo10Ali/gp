"use client";

import { useState } from "react";

type ContentItem = {
  id: string;
  title: string;
  type: "destination" | "guide" | "company" | "review";
  status: "pending" | "approved" | "rejected";
  submittedBy: string;
  submittedDate: string;
  description?: string;
};

const initialContent: ContentItem[] = [
  {
    id: "C001",
    title: "وجهة جديدة: جزر فرسان",
    type: "destination",
    status: "pending",
    submittedBy: "شركة البحر الأحمر للسياحة",
    submittedDate: "2026-02-12",
    description: "جزر فرسان - أرخبيل ساحر في البحر الأحمر",
  },
  {
    id: "C002",
    title: "طلب ترخيص مرشد: سعد المالكي",
    type: "guide",
    status: "pending",
    submittedBy: "سعد المالكي",
    submittedDate: "2026-02-10",
    description: "مرشد متخصص في المواقع التاريخية بالرياض",
  },
  {
    id: "C003",
    title: "شركة سياحية جديدة: رحلات الصحراء",
    type: "company",
    status: "approved",
    submittedBy: "رحلات الصحراء المحدودة",
    submittedDate: "2026-02-05",
  },
  {
    id: "C004",
    title: "مراجعة محتوى غير لائق",
    type: "review",
    status: "rejected",
    submittedBy: "سائح مجهول",
    submittedDate: "2026-02-08",
    description: "تقييم يحتوي على لغة غير مناسبة",
  },
];

export default function MinistryContentPage() {
  const [content, setContent] = useState<ContentItem[]>(initialContent);
  const [filter, setFilter] = useState<string>("all");

  const filteredContent = filter === "all" ? content : content.filter((c) => c.status === filter);

  const handleApprove = (id: string) => {
    const confirmed = window.confirm("هل تريد الموافقة على هذا المحتوى؟");
    if (confirmed) {
      setContent((prev) => prev.map((c) => (c.id === id ? { ...c, status: "approved" as const } : c)));
      alert("✓ تمت الموافقة بنجاح");
    }
  };

  const handleReject = (id: string) => {
    const confirmed = window.confirm("هل تريد رفض هذا المحتوى؟");
    if (confirmed) {
      setContent((prev) => prev.map((c) => (c.id === id ? { ...c, status: "rejected" as const } : c)));
      alert("تم الرفض");
    }
  };

  const pendingCount = content.filter((c) => c.status === "pending").length;
  const approvedCount = content.filter((c) => c.status === "approved").length;
  const rejectedCount = content.filter((c) => c.status === "rejected").length;

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>إدارة المحتوى</h1>
        <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>
          مراجعة والموافقة على الوجهات والمرشدين والشركات
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <StatCard title="قيد المراجعة" value={pendingCount} color="#eab308" />
        <StatCard title="تمت الموافقة" value={approvedCount} color="#22c55e" />
        <StatCard title="مرفوض" value={rejectedCount} color="#ef4444" />
        <StatCard title="إجمالي المحتوى" value={content.length} color="#3b82f6" />
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <FilterTab label="الكل" count={content.length} active={filter === "all"} onClick={() => setFilter("all")} />
        <FilterTab label="قيد المراجعة" count={pendingCount} active={filter === "pending"} onClick={() => setFilter("pending")} />
        <FilterTab label="موافق عليه" count={approvedCount} active={filter === "approved"} onClick={() => setFilter("approved")} />
        <FilterTab label="مرفوض" count={rejectedCount} active={filter === "rejected"} onClick={() => setFilter("rejected")} />
      </div>

      {/* Content List */}
      {filteredContent.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>لا يوجد محتوى</h3>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {filteredContent.map((item) => (
            <ContentCard key={item.id} item={item} onApprove={handleApprove} onReject={handleReject} />
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

function ContentCard({
  item,
  onApprove,
  onReject,
}: {
  item: ContentItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const typeColors = {
    destination: { bg: "#3b82f620", color: "#3b82f6", label: "وجهة" },
    guide: { bg: "#22c55e20", color: "#22c55e", label: "مرشد" },
    company: { bg: "#a855f720", color: "#a855f7", label: "شركة" },
    review: { bg: "#f59e0b20", color: "#f59e0b", label: "تقييم" },
  };

  const statusColors = {
    pending: { bg: "#eab30820", color: "#eab308", label: "قيد المراجعة" },
    approved: { bg: "#22c55e20", color: "#22c55e", label: "موافق عليه" },
    rejected: { bg: "#ef444420", color: "#ef4444", label: "مرفوض" },
  };

  const type = typeColors[item.type];
  const status = statusColors[item.status];

  return (
    <div className="card" style={{ padding: 18, display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 300 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: type.bg, color: type.color }}>
            {type.label}
          </span>
          <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: status.bg, color: status.color }}>
            {status.label}
          </span>
        </div>

        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{item.title}</h3>

        {item.description && (
          <p style={{ margin: "0 0 10px", color: "var(--muted)", lineHeight: 1.7 }}>{item.description}</p>
        )}

        <div style={{ fontSize: 13, color: "var(--muted)" }}>
          مُقدم من: {item.submittedBy} • {item.submittedDate}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
        {item.status === "pending" && (
          <>
            <button
              onClick={() => onApprove(item.id)}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              ✓ موافقة
            </button>
            <button
              onClick={() => onReject(item.id)}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                border: "1px solid #ef4444",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              ✕ رفض
            </button>
          </>
        )}
        <button className="btn" style={{ fontSize: 14 }}>
          عرض التفاصيل
        </button>
      </div>
    </div>
  );
}