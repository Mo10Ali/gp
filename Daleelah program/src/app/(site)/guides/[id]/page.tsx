"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Guide = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  guideProfile?: {
    bio: string;
    specialties: string;
    languages: string;
    pricePerHour: number;
    rating: number;
    experienceYears: number;
    totalTours: number;
  };
};

export default function GuideDetailPage() {
  const params = useParams();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchGuide();
  }, [params.id]);

  const fetchGuide = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/guides');
      if (res.ok) {
        const data = await res.json();
        const foundGuide = data.find((g: Guide) => g.id === params.id);
        if (foundGuide) {
          setGuide(foundGuide);
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

  if (notFound || !guide) {
    return (
      <main style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
        <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 12 }}>المرشد غير موجود</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
          المرشد الذي تبحث عنه غير موجود أو تم حذفه
        </p>
        <Link href="/guides" className="btnPrimary">
          العودة للمرشدين
        </Link>
      </main>
    );
  }

  const profile = guide.guideProfile;
  const specialties = profile?.specialties ? JSON.parse(profile.specialties) : [];
  const languages = profile?.languages ? JSON.parse(profile.languages) : [];

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/guides" className="btn"
        style={{ marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        ← العودة للمرشدين
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
        {/* Left Content */}
        <div>
          {/* Hero Section */}
          <div className="card" style={{ padding: 32, marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'start' }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #006C35, #008844)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 48,
                fontWeight: 900,
                flexShrink: 0,
              }}>
                {guide.avatar ? (
                  <img src={guide.avatar} alt={guide.fullName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <span>{guide.fullName.charAt(0)}</span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900, marginBottom: 8 }}>
                  {guide.fullName}
                </h1>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{ padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 700, background: '#eab30820', color: '#eab308' }}>
                    ⭐ {profile?.rating || 0} تقييم
                  </span>
                  <span style={{ padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 700, background: '#3b82f620', color: '#3b82f6' }}>
                    🏆 {profile?.experienceYears || 0} سنوات خبرة
                  </span>
                  <span style={{ padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 700, background: 'rgba(0,108,53,0.12)', color: 'var(--saudi-green)' }}>
                    🎫 {profile?.totalTours || 0} جولة
                  </span>
                </div>
                <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15, lineHeight: 1.7 }}>
                  {profile?.bio || 'مرشد سياحي محترف'}
                </p>
              </div>
            </div>
          </div>

          {/* Specialties */}
          {specialties.length > 0 && (
            <div className="card" style={{ padding: 24, marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 900 }}>التخصصات</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {specialties.map((s: string, i: number) => (
                  <span key={i} style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    background: 'rgba(0,108,53,0.15)',
                    color: 'var(--saudi-green)',
                    border: '1px solid rgba(0,108,53,0.3)',
                  }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 900 }}>اللغات</h2>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {languages.map((l: string, i: number) => (
                  <span key={i} style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}>
                    🌐 {l}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>السعر</div>
            <div style={{ fontSize: 34, fontWeight: 900, color: 'var(--saudi-green)', marginBottom: 4 }}>
              {profile?.pricePerHour || 0} SAR
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 24 }}>لكل ساعة</div>

            <div style={{ display: 'grid', gap: 0, marginBottom: 24, fontSize: 14 }}>
              {[
                { label: 'التقييم', value: `⭐ ${profile?.rating || 0} / 5` },
                { label: 'سنوات الخبرة', value: `🏆 ${profile?.experienceYears || 0}` },
                { label: 'عدد الجولات', value: `🎫 ${profile?.totalTours || 0}` },
              ].map((row, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom: i < 2 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{ color: 'var(--muted)' }}>{row.label}</span>
                  <span style={{ fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 16, background: 'rgba(255,255,255,0.03)', marginBottom: 20 }}>
              <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 800 }}>معلومات التواصل</h3>
              <div style={{ display: 'grid', gap: 8, fontSize: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>📧</span>
                  <span style={{ wordBreak: 'break-all' }}>{guide.email}</span>
                </div>
                {guide.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>📱</span>
                    <span>{guide.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/destinations"
              className="btnPrimary"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '16px',
                fontSize: 16,
                borderRadius: 14,
              }}
            >
              تصفح الوجهات 🗺️
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
