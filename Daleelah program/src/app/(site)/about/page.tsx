export default function AboutPage() {
  return (
    <main style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>About Daleelah</h1>

      <section
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: 16,
          lineHeight: 1.9,
          color: "white",
        }}
      >
        <p style={{ margin: 0, opacity: 0.85 }}>
          Daleelah منصة سياحية ذكية تدعم عدة أدوار: Tourist / Guide / Tourism Company / Ministry.
          حالياً نشتغل Frontend ببيانات مؤقتة، وبعدها نركّب Auth + DB + AI بشكل مرتب.
        </p>

        <div style={{ marginTop: 12, opacity: 0.8 }}>
          <div>✅ Browse Destinations</div>
          <div>✅ Explore Guides</div>
          <div>✅ Planner UI</div>
          <div>⏳ Booking / Offers / Analytics (later)</div>
        </div>
      </section>
    </main>
  );
}
