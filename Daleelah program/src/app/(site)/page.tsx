import Link from "next/link";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";

export default function HomePage() {
  // أول 3 وجهات
  const topDestinations = destinations.slice(0, 3);
  // أول 3 مرشدين
  const topGuides = guides.slice(0, 3);

  return (
    <main style={{ display: "grid", gap: 0 }}>
      {/* Hero Section */}
      <section
        style={{
          minHeight: "75vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, rgba(0,108,53,0.1) 0%, rgba(10,10,10,1) 100%)",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900 }}>
          {/* Logo */}
          <img
            src="/images/logo.png"
            alt="Daleelah"
            style={{
              width: 100,
              height: 100,
              margin: "0 auto 20px",
              opacity: 0.9,
            }}
          />

          {/* Main Heading */}
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(40px, 7vw, 64px)",
              fontWeight: 900,
              lineHeight: 1.2,
              marginBottom: 20,
            }}
          >
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              دليلك
            </span>{" "}
            لاستكشاف{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #006C35 0%, #008844 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              السعودية
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 3vw, 22px)",
              color: "var(--muted)",
              lineHeight: 1.8,
              marginBottom: 30,
            }}
          >
            منصة ذكية تربط السياح بالمرشدين والوجهات السياحية في المملكة
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/destinations" className="btnPrimary" style={{ padding: "14px 28px", fontSize: 18 }}>
              استكشف الوجهات
            </Link>
            <Link href="/guides" className="btn" style={{ padding: "14px 28px", fontSize: 18 }}>
              تصفح المرشدين
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: 20,
              marginTop: 50,
              maxWidth: 600,
              margin: "50px auto 0",
            }}
          >
            <Stat number="8+" label="وجهات" />
            <Stat number="3+" label="مرشدين" />
            <Stat number="89+" label="شركة" />
            <Stat number="12K+" label="سائح" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: "80px 20px", background: "rgba(0,108,53,0.03)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ margin: 0, fontSize: 36, fontWeight: 900, marginBottom: 20 }}>
            عن{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              دليله
            </span>
          </h2>
          <p style={{ fontSize: 18, color: "var(--muted)", lineHeight: 2, marginBottom: 40 }}>
            دليله منصة سياحية سعودية ذكية تهدف لتسهيل تجربة السياحة في المملكة. نربط السياح بأفضل المرشدين
            المحليين والوجهات المميزة، ونوفر أدوات تخطيط رحلات مدعومة بالذكاء الاصطناعي. رؤيتنا أن نكون المنصة
            الأولى لكل من يريد استكشاف جمال السعودية وتراثها العريق.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 24 }}>
            <FeatureBox icon="🧳" title="للسياح" desc="اكتشف، احجز، واستمتع برحلتك" />
            <FeatureBox icon="🎯" title="للمرشدين" desc="أدر جولاتك واحصل على حجوزات" />
            <FeatureBox icon="🏢" title="للشركات" desc="قدم عروضك وأدر قوائمك" />
            <FeatureBox icon="🤖" title="ذكاء اصطناعي" desc="خطط رحلتك بذكاء وسهولة" />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40, textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 36, fontWeight: 900, marginBottom: 10 }}>الوجهات الشهيرة</h2>
            <p style={{ color: "var(--muted)", fontSize: 16 }}>اكتشف أجمل الأماكن في المملكة</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {topDestinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="card"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  overflow: "hidden",
                  padding: 0,
                }}
              >
                <div style={{ aspectRatio: "16/10", background: "#1a1a1a" }}>
                  <img
                    src={dest.images[0]}
                    alt={dest.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: 18 }}>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{dest.title}</h3>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, marginBottom: 10 }}>
                    {dest.summary}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#D4AF37", fontWeight: 800 }}>⭐ {dest.rating}</span>
                    <span style={{ color: "var(--muted)", fontSize: 14 }}>• {dest.category}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link href="/destinations" className="btn" style={{ padding: "12px 24px" }}>
              عرض جميع الوجهات →
            </Link>
          </div>
        </div>
      </section>

      {/* Top Guides */}
      <section style={{ padding: "80px 20px", background: "rgba(0,108,53,0.03)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 40, textAlign: "center" }}>
            <h2 style={{ margin: 0, fontSize: 36, fontWeight: 900, marginBottom: 10 }}>المرشدين المميزين</h2>
            <p style={{ color: "var(--muted)", fontSize: 16 }}>مرشدون محليون خبراء في وجهاتهم</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {topGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/guides/${guide.slug}`}
                className="card"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  padding: 20,
                }}
              >
                <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "3px solid var(--saudi-green)",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={guide.avatar}
                      alt={guide.fullName}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{guide.fullName}</h3>
                    <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>
                      {guide.city} • {guide.region}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                      <span style={{ color: "#D4AF37", fontWeight: 800 }}>⭐ {guide.rating}</span>
                      <span style={{ color: "var(--muted)", fontSize: 14 }}>• {guide.pricePerHour} SAR/ساعة</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{guide.bio}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: 30 }}>
            <Link href="/guides" className="btn" style={{ padding: "12px 24px" }}>
              عرض جميع المرشدين →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: "100px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: 38, fontWeight: 900, marginBottom: 16 }}>جاهز لبدء مغامرتك؟</h2>
          <p style={{ color: "var(--muted)", fontSize: 18, lineHeight: 1.8, marginBottom: 30 }}>
            خطط لرحلتك الآن واستمتع بتجربة سياحية لا تُنسى في السعودية
          </p>
          <Link href="/planner" className="btnPrimary" style={{ padding: "16px 36px", fontSize: 20 }}>
            ابدأ التخطيط الآن
          </Link>
        </div>
      </section>
    </main>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div
        style={{
          fontSize: 28,
          fontWeight: 900,
          background: "linear-gradient(135deg, #006C35 0%, #008844 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {number}
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
    </div>
  );
}

function FeatureBox({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="card" style={{ padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{title}</h3>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}