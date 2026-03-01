"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Guide = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  isSuspended: boolean;
  guideProfile?: {
    bio: string;
    specialties: string;
    languages: string;
    pricePerHour: number;
    experienceYears: number;
    rating: number;
  };
};

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/guides');
      if (res.ok) {
        const data = await res.json();
        // إخفاء المرشدين المعلقين
        const activeGuides = data.filter((g: Guide) => !g.isSuspended);
        setGuides(activeGuides);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter((guide) => {
    const matchesSearch = guide.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedSpecialty === 'all') return matchesSearch;
    
    const specialties = guide.guideProfile?.specialties 
      ? JSON.parse(guide.guideProfile.specialties) 
      : [];
    
    return matchesSearch && specialties.some((s: string) => 
      s.toLowerCase().includes(selectedSpecialty.toLowerCase())
    );
  });

  if (loading) {
    return (
      <main style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>جاري التحميل...</h2>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '60px 20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 50 }}>
        <h1 style={{ margin: 0, fontSize: 42, fontWeight: 900, marginBottom: 12 }}>
          المرشدين السياحيين 🎯
        </h1>
        <p style={{ margin: 0, fontSize: 18, color: 'var(--muted)' }}>
          اكتشف أفضل المرشدين السياحيين في المملكة
        </p>
      </div>

      {/* Search & Filters */}
      <div style={{ marginBottom: 40, display: 'grid', gridTemplateColumns: '1fr auto', gap: 16 }}>
        <input
          type="text"
          className="input"
          placeholder="🔍 ابحث عن مرشد..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: 14, fontSize: 16 }}
        />
        
        <select
          className="input"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          style={{ padding: 14, fontSize: 16, minWidth: 200 }}
        >
          <option value="all">كل التخصصات</option>
          <option value="تراث">تراث</option>
          <option value="طبيعة">طبيعة</option>
          <option value="مغامرة">مغامرة</option>
          <option value="ثقافة">ثقافة</option>
        </select>
      </div>

      {/* Guides Grid */}
      {filteredGuides.length === 0 ? (
        <div className="card" style={{ padding: 80, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎯</div>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>لا توجد نتائج</h2>
          <p style={{ margin: '12px 0 0', color: 'var(--muted)' }}>
            جرب البحث بكلمات مختلفة أو غيّر الفلتر
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredGuides.map((guide) => {
            const profile = guide.guideProfile;
            const specialties = profile?.specialties ? JSON.parse(profile.specialties) : [];
            const languages = profile?.languages ? JSON.parse(profile.languages) : [];

            return (
              <Link
                key={guide.id}
                href={`/guides/${guide.id}`}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Avatar */}
                <div style={{
                  height: 200,
                  background: 'linear-gradient(135deg, #006C35, #008844)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 72,
                  fontWeight: 900,
                  color: 'white',
                  overflow: 'hidden',
                }}>
                  {guide.avatar ? (
                    <img
                      src={guide.avatar}
                      alt={guide.fullName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span>{guide.fullName.charAt(0)}</span>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: 24 }}>
                  <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
                    {guide.fullName}
                  </h3>

                  {profile && (
                    <>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          background: '#eab30820',
                          color: '#eab308',
                        }}>
                          ⭐ {profile.rating}
                        </span>
                        <span style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 700,
                          background: '#3b82f620',
                          color: '#3b82f6',
                        }}>
                          🏆 {profile.experienceYears} سنوات
                        </span>
                      </div>

                      <p style={{
                        margin: '0 0 16px',
                        fontSize: 14,
                        color: 'var(--muted)',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {profile.bio || 'مرشد سياحي محترف'}
                      </p>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                          التخصصات:
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {specialties.slice(0, 3).map((s: string, i: number) => (
                            <span
                              key={i}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 12,
                                background: 'rgba(0,108,53,0.12)',
                                color: 'var(--saudi-green)',
                              }}
                            >
                              {s}
                            </span>
                          ))}
                          {specialties.length > 3 && (
                            <span style={{ fontSize: 12, color: 'var(--muted)' }}>
                              +{specialties.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
                          اللغات:
                        </div>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {languages.slice(0, 3).map((l: string, i: number) => (
                            <span
                              key={i}
                              style={{
                                padding: '4px 10px',
                                borderRadius: 6,
                                fontSize: 12,
                                background: 'rgba(255,255,255,0.08)',
                              }}
                            >
                              🌐 {l}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: 16,
                        borderTop: '1px solid var(--border)',
                      }}>
                        <div>
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>السعر</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--saudi-green)' }}>
                            {profile.pricePerHour} SAR
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--muted)' }}>لكل ساعة</div>
                        </div>
                        <div
                          className="btnPrimary"
                          style={{
                            padding: '10px 20px',
                            fontSize: 14,
                            display: 'inline-block',
                          }}
                        >
                          عرض الملف →
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Stats */}
      {guides.length > 0 && (
        <div style={{
          marginTop: 60,
          padding: 40,
          textAlign: 'center',
          background: 'rgba(0,108,53,0.08)',
          borderRadius: 20,
        }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--saudi-green)', marginBottom: 8 }}>
            {guides.length}
          </div>
          <div style={{ fontSize: 18, color: 'var(--muted)' }}>
            مرشد سياحي محترف في خدمتك
          </div>
        </div>
      )}
    </main>
  );
}
