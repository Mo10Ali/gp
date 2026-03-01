"use client";

import { useState } from "react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: "regulation" | "event" | "update" | "alert";
  status: "draft" | "published";
  publishDate: string;
  views: number;
};

const initialAnnouncements: Announcement[] = [
  {
    id: "A001",
    title: "تنظيمات جديدة للمرشدين السياحيين",
    content: "تم إصدار تعليمات جديدة تتعلق بتراخيص المرشدين السياحيين...",
    category: "regulation",
    status: "published",
    publishDate: "2026-02-10",
    views: 1245,
  },
  {
    id: "A002",
    title: "تمديد أوقات زيارة المواقع التراثية",
    content: "قررت الوزارة تمديد أوقات الزيارة في المواقع التراثية...",
    category: "update",
    status: "published",
    publishDate: "2026-02-05",
    views: 2130,
  },
  {
    id: "A003",
    title: "إطلاق صندوق تطوير السياحة Q1",
    content: "تفتح الوزارة باب التقديم على صندوق تطوير القطاع السياحي...",
    category: "event",
    status: "draft",
    publishDate: "2026-01-28",
    views: 0,
  },
];

export default function MinistryAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [showForm, setShowForm] = useState(false);

  const handlePublish = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "published" as const } : a))
    );
    alert("✓ تم نشر الإعلان");
  };

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("هل أنت متأكد من حذف هذا الإعلان؟");
    if (confirmed) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>إدارة الإعلانات</h1>
          <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>إصدار وإدارة الإعلانات الرسمية</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btnPrimary">
          {showForm ? "✕ إلغاء" : "+ إعلان جديد"}
        </button>
      </div>

      {showForm && <CreateAnnouncementForm onClose={() => setShowForm(false)} />}

      <div style={{ display: "grid", gap: 12 }}>
        {announcements.map((announcement) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            onPublish={handlePublish}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </main>
  );
}

function CreateAnnouncementForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="card" style={{ padding: 20, background: "rgba(0, 108, 53, 0.05)" }}>
      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, marginBottom: 16 }}>إنشاء إعلان جديد</h3>
      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>عنوان الإعلان</label>
          <input className="input" type="text" placeholder="مثال: قرارات جديدة..." />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>التصنيف</label>
          <select className="input">
            <option>تنظيمات</option>
            <option>فعاليات</option>
            <option>تحديثات</option>
            <option>تنبيهات</option>
          </select>
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>المحتوى</label>
          <textarea className="input" rows={5} placeholder="تفاصيل الإعلان..." style={{ resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btnPrimary" onClick={() => alert("سيتم الحفظ قريباً")}>
            نشر الإعلان
          </button>
          <button className="btn" onClick={() => alert("سيتم الحفظ كمسودة")}>
            حفظ كمسودة
          </button>
          <button className="btn" onClick={onClose}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function AnnouncementCard({
  announcement,
  onPublish,
  onDelete,
}: {
  announcement: Announcement;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const categoryColors = {
    regulation: { bg: "#ef444420", color: "#ef4444", label: "تنظيمات" },
    event: { bg: "#3b82f620", color: "#3b82f6", label: "فعاليات" },
    update: { bg: "#22c55e20", color: "#22c55e", label: "تحديثات" },
    alert: { bg: "#eab30820", color: "#eab308", label: "تنبيهات" },
  };

  const statusColors = {
    draft: { bg: "#6b728020", color: "#6b7280", label: "مسودة" },
    published: { bg: "#22c55e20", color: "#22c55e", label: "منشور" },
  };

  const category = categoryColors[announcement.category];
  const status = statusColors[announcement.status];

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: category.bg, color: category.color }}>
              {category.label}
            </span>
            <span style={{ padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700, background: status.bg, color: status.color }}>
              {status.label}
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{announcement.title}</h3>
          <p style={{ margin: "0 0 12px", color: "var(--muted)", lineHeight: 1.7 }}>{announcement.content}</p>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            {announcement.publishDate} • {announcement.views.toLocaleString()} مشاهدة
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          {announcement.status === "draft" && (
            <button onClick={() => onPublish(announcement.id)} className="btnPrimary" style={{ fontSize: 14 }}>
              نشر
            </button>
          )}
          <button className="btn" style={{ fontSize: 14 }}>
            تعديل
          </button>
          <button
            onClick={() => onDelete(announcement.id)}
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
