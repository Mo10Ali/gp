import Link from "next/link";

export default function AdminDashboard() {
  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>لوحة تحكم الأدمن ⚙️</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>إدارة شاملة لمحتوى الموقع</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <AdminCard
          icon="🏝️"
          title="إدارة الوجهات"
          description="إضافة وتعديل وحذف الوجهات السياحية"
          href="/admin/destinations"
          color="#3b82f6"
        />
        <AdminCard
          icon="🎯"
          title="إدارة المرشدين"
          description="إضافة وتعديل وحذف المرشدين السياحيين"
          href="/admin/guides"
          color="#22c55e"
        />
      </div>
    </main>
  );
}

function AdminCard({
  icon, title, description, href, color,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="card"
      style={{ padding: 28, textDecoration: 'none', color: 'inherit', display: 'block', transition: 'all 0.2s ease' }}
    >
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8, color }}>{title}</h2>
      <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>{description}</p>
      <div style={{ marginTop: 20, color, fontWeight: 700, fontSize: 14 }}>
        الدخول ←
      </div>
    </Link>
  );
}
