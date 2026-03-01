import Link from "next/link";

export default function MinistryDashboard() {
  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>لوحة تحكم الوزارة 🏛️</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>مراقبة وتنظيم القطاع السياحي</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <Link href="/ministry/destinations" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🏝️</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#3b82f6' }}>إدارة الوجهات</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>مراقبة وتنظيم الوجهات السياحية</p>
        </Link>

        <Link href="/ministry/guides" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#22c55e' }}>إدارة المرشدين</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>مراقبة وتنظيم المرشدين السياحيين</p>
        </Link>

        <Link href="/ministry/content" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📢</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#f59e0b' }}>المحتوى</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>إدارة الإعلانات والمحتوى الرسمي</p>
        </Link>

        <Link href="/ministry/analytics" className="card" style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color: '#a855f7' }}>التحليلات</h3>
          <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>إحصائيات القطاع السياحي</p>
        </Link>
      </div>
    </main>
  );
}