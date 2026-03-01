"use client";

import Link from "next/link";
import { notFound } from "next/navigation";

type Tour = {
  id: string;
  title: string;
  touristName: string;
  touristEmail: string;
  touristPhone: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  price: number;
  notes?: string;
  meetingPoint?: string;
  participants?: number;
};

const mockTours: Tour[] = [
  {
    id: "T001",
    title: "جولة تراثية في الدرعية",
    touristName: "سارة عبدالله",
    touristEmail: "sarah@example.com",
    touristPhone: "+966 50 111 2222",
    date: "2026-02-18",
    time: "09:00 AM",
    duration: "4 ساعات",
    location: "الدرعية التاريخية",
    status: "upcoming",
    price: 600,
    notes: "مهتمة بالتصوير الفوتوغرافي",
    meetingPoint: "مدخل حي الطريف",
    participants: 1,
  },
  {
    id: "T002",
    title: "جولة تصوير في الرياض القديمة",
    touristName: "محمد علي",
    touristEmail: "mohammed@example.com",
    touristPhone: "+966 50 333 4444",
    date: "2026-02-22",
    time: "04:00 PM",
    duration: "3 ساعات",
    location: "وسط الرياض",
    status: "upcoming",
    price: 450,
    meetingPoint: "ميدان الصفاة",
    participants: 2,
  },
  {
    id: "T003",
    title: "رحلة عائلية - منتزهات الرياض",
    touristName: "فاطمة حسن",
    touristEmail: "fatima@example.com",
    touristPhone: "+966 50 555 6666",
    date: "2026-02-25",
    time: "10:00 AM",
    duration: "4 ساعات",
    location: "منتزه الملك عبدالله",
    status: "upcoming",
    price: 750,
    notes: "عائلة مع 3 أطفال",
    meetingPoint: "البوابة الرئيسية",
    participants: 5,
  },
  {
    id: "T004",
    title: "جولة تاريخية - قصر المصمك",
    touristName: "أحمد ناصر",
    touristEmail: "ahmed@example.com",
    touristPhone: "+966 50 777 8888",
    date: "2026-02-10",
    time: "02:00 PM",
    duration: "2 ساعات",
    location: "قصر المصمك",
    status: "completed",
    price: 400,
    meetingPoint: "مدخل القصر",
    participants: 1,
  },
  {
    id: "T005",
    title: "جولة طعام في الرياض",
    touristName: "ليلى إبراهيم",
    touristEmail: "layla@example.com",
    touristPhone: "+966 50 999 0000",
    date: "2026-02-08",
    time: "06:00 PM",
    duration: "3 ساعات",
    location: "حي الحمراء",
    status: "completed",
    price: 500,
    meetingPoint: "مطعم نجد التراثي",
    participants: 2,
  },
];

export default function TourDetailsPage({ params }: { params: { id: string } }) {
  const tour = mockTours.find((t) => t.id === params.id);

  if (!tour) return notFound();

  const statusColors = {
    upcoming: { bg: "#3b82f620", color: "#3b82f6" },
    ongoing: { bg: "#eab30820", color: "#eab308" },
    completed: { bg: "#22c55e20", color: "#22c55e" },
    cancelled: { bg: "#ef444420", color: "#ef4444" },
  };

  const statusLabels = {
    upcoming: "قادمة",
    ongoing: "جارية",
    completed: "مكتملة",
    cancelled: "ملغاة",
  };

  const style = statusColors[tour.status];

  return (
    <main style={{ display: "grid", gap: 20 }}>
      <Link href="/guide/tours" className="btn" style={{ width: "fit-content" }}>
        ← العودة للجولات
      </Link>

      <div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 10 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>جولة #{tour.id}</h1>
          <span style={{ padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 700, background: style.bg, color: style.color }}>
            {statusLabels[tour.status]}
          </span>
        </div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "var(--muted)" }}>{tour.title}</h2>
      </div>

      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "1fr 350px" }}>
        {/* Left Column */}
        <div style={{ display: "grid", gap: 16 }}>
          {/* Tour Details */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, marginBottom: 16 }}>تفاصيل الجولة</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <DetailRow icon="📅" label="التاريخ" value={tour.date} />
              <DetailRow icon="⏰" label="الوقت" value={tour.time} />
              <DetailRow icon="⏱️" label="المدة" value={tour.duration} />
              <DetailRow icon="📍" label="الموقع" value={tour.location} />
              {tour.meetingPoint && <DetailRow icon="🚩" label="نقطة اللقاء" value={tour.meetingPoint} />}
              {tour.participants && <DetailRow icon="👥" label="عدد المشاركين" value={tour.participants + " أشخاص"} />}
            </div>
          </div>

          {/* Notes */}
          {tour.notes && (
            <div className="card" style={{ padding: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, marginBottom: 16 }}>ملاحظات خاصة</h3>
              <div style={{ padding: 14, background: "rgba(0, 108, 53, 0.05)", borderRadius: 12, lineHeight: 1.8 }}>
                {tour.notes}
              </div>
            </div>
          )}

          {/* Tour Checklist */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, marginBottom: 16 }}>قائمة المهام</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <ChecklistItem label="التأكد من المعدات" checked={true} />
              <ChecklistItem label="مراجعة المسار" checked={true} />
              <ChecklistItem label="التواصل مع السائح" checked={false} />
              <ChecklistItem label="تجهيز المواد التعريفية" checked={false} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
          {/* Tourist Info */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, marginBottom: 16 }}>معلومات السائح</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{tour.touristName}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>الهاتف</div>
                <div style={{ fontWeight: 600 }}>{tour.touristPhone}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>البريد الإلكتروني</div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{tour.touristEmail}</div>
              </div>
            </div>

            {tour.status === "upcoming" && (
              <div style={{ marginTop: 16, display: "grid", gap: 8 }}>
                <a href={'tel:' + tour.touristPhone} className="btnPrimary" style={{ textAlign: "center" }}>
                  📞 اتصل بالسائح
                </a>
                <a href={'mailto:' + tour.touristEmail} className="btn" style={{ textAlign: "center" }}>
                  ✉️ إرسال بريد
                </a>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, marginBottom: 16 }}>التفاصيل المالية</h3>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>سعر الجولة</span>
                <span style={{ fontWeight: 700 }}>{tour.price} SAR</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)" }}>عمولة المنصة (10%)</span>
                <span style={{ fontWeight: 700 }}>-{(tour.price * 0.1).toFixed(0)} SAR</span>
              </div>
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 10,
                  marginTop: 6,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 900 }}>صافي الربح</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "var(--saudi-green)" }}>
                  {(tour.price * 0.9).toFixed(0)} SAR
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          {tour.status === "upcoming" && (
            <button
              onClick={() => alert("سيتم إضافة وظيفة الإلغاء قريباً")}
              style={{
                padding: "14px 20px",
                borderRadius: 12,
                border: "1px solid #ef4444",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              إلغاء الجولة
            </button>
          )}

          {tour.status === "completed" && (
            <div className="card" style={{ padding: 16, background: "rgba(34, 197, 94, 0.05)" }}>
              <div style={{ fontSize: 14, color: "#22c55e", fontWeight: 700, marginBottom: 8 }}>✓ جولة مكتملة</div>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>تم إكمال هذه الجولة بنجاح</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "start" }}>
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 600 }}>{value}</div>
      </div>
    </div>
  );
}

function ChecklistItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: "2px solid " + (checked ? "var(--saudi-green)" : "var(--border)"),
          background: checked ? "var(--saudi-green)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          color: "white",
        }}
      >
        {checked ? "✓" : ""}
      </div>
      <div style={{ opacity: checked ? 0.7 : 1, textDecoration: checked ? "line-through" : "none" }}>{label}</div>
    </div>
  );
}