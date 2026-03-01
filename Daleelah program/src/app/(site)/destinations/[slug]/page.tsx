"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Destination = {
  id: string;
  slug: string;
  title: string;
  city: string;
  region: string;
  category: string;
  summary: string;
  description: string;
  images: string;
  tags: string;
  rating: number;
  status: string;
};

export default function DestinationDetailPage() {
  const params = useParams();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
    fetchDestination();
  }, [params.slug]);

  const fetchDestination = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/destinations');
      if (res.ok) {
        const data = await res.json();
        const dest = data.find((d: Destination) =>
          d.slug === params.slug ||
          d.slug === decodeURIComponent(String(params.slug))
        );
        if (dest) {
          setDestination(dest);
        } else {
          setNotFound(true);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <h2>جاري التحميل...</h2>
      </main>
    );
  }

  if (notFound || !destination) {
    return (
      <main style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🏝️</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>الوجهة غير موجودة</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
          الوجهة التي تبحث عنها غير موجودة أو تم حذفها
        </p>
        <Link href="/destinations" className="btnPrimary">
          العودة للوجهات
        </Link>
      </main>
    );
  }

  const images = JSON.parse(destination.images || '[]');
  const tags = JSON.parse(destination.tags || '[]');

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/destinations" className="btn"
        style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        ← العودة للوجهات
      </Link>

      {/* Hero */}
      <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 32, height: 460 }}>
        <img
          src={images[0] || '/images/logo.png'}
          alt={destination.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.png'; }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        {/* Left */}
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#3b82f620', color: '#3b82f6' }}>
              {destination.category}
            </span>
            <span style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: 'rgba(0,108,53,0.12)', color: 'var(--saudi-green)' }}>
              📍 {destination.city}
            </span>
            <span style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#eab30820', color: '#eab308' }}>
              ⭐ {destination.rating}
            </span>
          </div>

          <h1 style={{ margin: '0 0 8px', fontSize: 38, fontWeight: 900 }}>{destination.title}</h1>
          <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: 15 }}>📍 {destination.region}</p>
          <p style={{ margin: '20px 0', fontSize: 17, lineHeight: 1.8, color: 'rgba(255,255,255,0.85)' }}>
            {destination.summary}
          </p>

          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 900 }}>عن الوجهة</h2>
            <p style={{ margin: 0, lineHeight: 1.9, color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
              {destination.description}
            </p>
          </div>

          {tags.length > 0 && (
            <div className="card" style={{ padding: 20, marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 800 }}>الوسوم</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {tags.map((tag: string, i: number) => (
                  <span key={i} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {images.length > 1 && (
            <div>
              <h3 style={{ margin: '0 0 12px', fontSize: 17, fontWeight: 800 }}>صور أخرى</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                {images.slice(1).map((img: string, i: number) => (
                  <div key={i} style={{ borderRadius: 12, overflow: 'hidden', height: 120 }}>
                    <img src={img} alt={destination.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.png'; }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right - Booking Card */}
        <div style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>السعر يبدأ من</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--saudi-green)', marginBottom: 4 }}>
              300 SAR
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>لكل شخص / يوم</div>

            <div style={{ display: 'grid', gap: 0, marginBottom: 24, fontSize: 14 }}>
              {[
                { label: 'المنطقة', value: destination.region },
                { label: 'التصنيف', value: destination.category },
                { label: 'التقييم', value: `⭐ ${destination.rating} / 5` },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                  <span style={{ fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>

            {user && user.role === 'TOURIST' ? (
              <Link
                href={`/destinations/${destination.slug}/booking`}
                className="btnPrimary"
                style={{ display: 'block', textAlign: 'center', padding: '16px', fontSize: 16, borderRadius: 14 }}
              >
                احجز الآن 🛒
              </Link>
            ) : !user ? (
              <>
                <Link
                  href="/auth/select-role"
                  className="btnPrimary"
                  style={{ display: 'block', textAlign: 'center', padding: '16px', fontSize: 16, borderRadius: 14, marginBottom: 10 }}
                >
                  سجل دخول للحجز
                </Link>
                <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
                  يجب تسجيل الدخول كسائح للحجز
                </p>
              </>
            ) : (
              <div style={{ padding: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 10, textAlign: 'center', fontSize: 14, color: 'var(--muted)' }}>
                الحجز متاح للسياح فقط
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}