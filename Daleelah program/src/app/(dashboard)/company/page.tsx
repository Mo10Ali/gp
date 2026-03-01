import Link from "next/link";

export default function CompanyDashboard() {
  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>لوحة تحكم الشركة 🏢</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>إدارة عروضك وخدماتك السياحية</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <Link href="/company/destinations" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏝️</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#3b82f6' }}>إدارة الوجهات</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>إضافة وتعديل الوجهات السياحية</p>
        </Link>

        <Link href="/company/bookings" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#22c55e' }}>الحجوزات</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>متابعة حجوزات العملاء</p>
        </Link>

        <Link href="/company/offers" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎁</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#a855f7' }}>العروض</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>إدارة العروض والخصومات</p>
        </Link>

        <Link href="/company/listings" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#f59e0b' }}>القوائم</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>إدارة الباقات والأنشطة</p>
        </Link>
      </div>
    </main>
  );
}
