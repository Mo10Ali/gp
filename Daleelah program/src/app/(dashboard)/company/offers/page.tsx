"use client";

import { useState } from "react";

type Offer = {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
  bookingsCount: number;
};

const initialOffers: Offer[] = [
  {
    id: "OF001",
    title: "باقة العلا التراثية",
    description: "جولة 3 أيام تشمل مدائن صالح والإقامة والمواصلات",
    originalPrice: 3500,
    discountedPrice: 2800,
    discount: 20,
    validFrom: "2026-03-01",
    validUntil: "2026-05-31",
    active: true,
    bookingsCount: 8,
  },
  {
    id: "OF002",
    title: "عطلة الرياض الثقافية",
    description: "تجربة التراث النجدي والمعالم الحديثة",
    originalPrice: 1800,
    discountedPrice: 1400,
    discount: 22,
    validFrom: "2026-02-15",
    validUntil: "2026-04-30",
    active: true,
    bookingsCount: 12,
  },
];

export default function CompanyOffersPage() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [showForm, setShowForm] = useState(false);

  const handleToggle = (id: string) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, active: !o.active } : o)));
  };

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>إدارة العروض</h1>
          <p style={{ margin: "8px 0 0", color: "var(--muted)" }}>إنشاء وإدارة العروض الترويجية</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btnPrimary">
          {showForm ? "✕ إلغاء" : "+ عرض جديد"}
        </button>
      </div>

      {showForm && <CreateOfferForm onClose={() => setShowForm(false)} />}

      <div style={{ display: "grid", gap: 12 }}>
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} onToggle={handleToggle} />
        ))}
      </div>
    </main>
  );
}

function CreateOfferForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="card" style={{ padding: 20, background: "rgba(0, 108, 53, 0.05)" }}>
      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, marginBottom: 16 }}>إنشاء عرض جديد</h3>
      <div style={{ display: "grid", gap: 14 }}>
        <div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>عنوان العرض</label>
          <input className="input" type="text" placeholder="مثال: باقة جدة الساحلية" />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>الوصف</label>
          <textarea className="input" rows={3} placeholder="وصف مفصل للعرض..." style={{ resize: "vertical" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>السعر الأصلي</label>
            <input className="input" type="number" placeholder="2000" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>السعر بعد الخصم</label>
            <input className="input" type="number" placeholder="1600" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>تاريخ البدء</label>
            <input className="input" type="date" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 14, marginBottom: 6, fontWeight: 600 }}>تاريخ الانتهاء</label>
            <input className="input" type="date" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btnPrimary" onClick={() => alert("سيتم الحفظ قريباً")}>
            حفظ العرض
          </button>
          <button className="btn" onClick={onClose}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

function OfferCard({ offer, onToggle }: { offer: Offer; onToggle: (id: string) => void }) {
  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{offer.title}</h3>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 700,
                background: offer.active ? "#22c55e20" : "#6b728020",
                color: offer.active ? "#22c55e" : "#6b7280",
              }}
            >
              {offer.active ? "نشط" : "متوقف"}
            </span>
          </div>
          <p style={{ margin: "0 0 12px", color: "var(--muted)", lineHeight: 1.6 }}>{offer.description}</p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 10 }}>
            <div>
              <span style={{ textDecoration: "line-through", opacity: 0.5, marginRight: 8 }}>{offer.originalPrice} SAR</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "var(--saudi-green)" }}>{offer.discountedPrice} SAR</span>
            </div>
            <div
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                background: "var(--saudi-gold)",
                color: "#1a1a1a",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              خصم {offer.discount}%
            </div>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            صالح من {offer.validFrom} إلى {offer.validUntil} • {offer.bookingsCount} حجوزات
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
          <button onClick={() => onToggle(offer.id)} className="btn" style={{ fontSize: 14 }}>
            {offer.active ? "إيقاف" : "تفعيل"}
          </button>
          <button className="btn" style={{ fontSize: 14 }}>
            تعديل
          </button>
        </div>
      </div>
    </div>
  );
}
