import Link from "next/link";

export default function DashboardPage() {
  return (
    <main style={{ display: "grid", gap: 16 }}>
      <header>
        <h1 style={{ margin: 0, fontSize: 34 }}>Dashboard</h1>
        <p style={{ marginTop: 8, opacity: 0.75, lineHeight: 1.8 }}>
          Welcome to Daleelah! Choose your role to access the appropriate dashboard.
        </p>
      </header>

      <section
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: 16,
          color: "white",
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ opacity: 0.85, lineHeight: 1.9 }}>
          هذا Dashboard واجهة فقط. لاحقاً نربطه بالـAuth والـRole-based access.
        </div>
        <div style={{ opacity: 0.75, fontSize: 14, lineHeight: 1.7 }}>
          Each role has specific features according to the Use Case diagram:
        </div>
      </section>

      {/* Role Dashboards */}
      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Select Your Role</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
          <RoleCard
            href="/tourist"
            icon="🧳"
            title="Tourist"
            description="Browse destinations, manage bookings, submit reviews, get AI recommendations"
            color="#3b82f6"
          />
          <RoleCard
            href="/guide"
            icon="🎯"
            title="Tour Guide"
            description="Handle tours, collect ratings, get AI-powered schedule suggestions"
            color="#22c55e"
          />
          <RoleCard
            href="/company"
            icon="🏢"
            title="Tourism Company"
            description="Process bookings, create offers, manage listings"
            color="#a855f7"
          />
          <RoleCard
            href="/ministry"
            icon="🏛️"
            title="Ministry of Tourism"
            description="View analytics, issue announcements, manage content"
            color="#f59e0b"
          />
        </div>
      </section>

      {/* Admin Access */}
      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Administrative Access</h2>
        <Link
          href="/admin"
          style={{
            textDecoration: "none",
            color: "white",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(239, 68, 68, 0.1)",
            borderRadius: 16,
            padding: 16,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 36 }}>⚙️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>Admin Dashboard</div>
            <div style={{ opacity: 0.85, fontSize: 14 }}>
              Full system access • User management • Content moderation
            </div>
          </div>
          <div style={{ opacity: 0.5, fontSize: 20 }}>→</div>
        </Link>
      </section>

      {/* Quick Links */}
      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Quick Links (Public)</h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/destinations" style={btn()}>Destinations</Link>
          <Link href="/guides" style={btn()}>Guides</Link>
          <Link href="/planner" style={btn()}>Trip Planner</Link>
        </div>
      </section>
    </main>
  );
}

function RoleCard({ href, icon, title, description, color }: {
  href: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      style={{
        textDecoration: "none",
        color: "white",
        border: "1px solid rgba(255,255,255,0.10)",
        background: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        padding: 16,
        display: "grid",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 32 }}>{icon}</div>
        <div style={{ fontWeight: 800, fontSize: 18, color }}>{title}</div>
      </div>
      <div style={{ opacity: 0.85, lineHeight: 1.7, fontSize: 14 }}>
        {description}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", opacity: 0.6 }}>→</div>
    </Link>
  );
}

function btn(): React.CSSProperties {
  return {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    textDecoration: "none",
  };
}
