import Link from "next/link";

export default function GuideDashboard() {
  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>لوحة تحكم المرشد 🎯</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>إدارة ملفك الشخصي وحجوزاتك</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <Link href="/guide/profile" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👤</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#3b82f6' }}>الملف الشخصي</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>تعديل بياناتك ومعلوماتك</p>
        </Link>

        <Link href="/guide/destinations" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#22c55e' }}>الوجهات</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>اختر الوجهات التي تريد الظهور فيها</p>
        </Link>

        <Link href="/guide/bookings" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#eab308' }}>الحجوزات</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>عرض الحجوزات المرتبطة بك</p>
        </Link>

        <Link href="/guide/tours" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎫</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#a855f7' }}>الجولات</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>إدارة جولاتك السياحية</p>
        </Link>
      </div>
    </main>
  );
}
