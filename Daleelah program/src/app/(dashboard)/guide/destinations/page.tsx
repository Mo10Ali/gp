"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Destination = {
  id: string;
  title: string;
  city: string;
  region: string;
  category: string;
  images: string;
  rating: number;
};

export default function GuideDestinationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/destinations');
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDestination = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleSave = async () => {
    setSaving(true);
    // هنا يمكن حفظ الوجهات المختارة في جدول منفصل أو في guideProfile
    // لكن حالياً سنحفظها في localStorage كمثال
    localStorage.setItem('guideDestinations', JSON.stringify(Array.from(selectedIds)));
    
    setTimeout(() => {
      alert('✅ تم الحفظ بنجاح!');
      setSaving(false);
    }, 500);
  };

  if (loading) {
    return (
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>جاري التحميل...</h2>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 34, fontWeight: 900 }}>الوجهات المتاحة 🗺️</h1>
        <p style={{ margin: '0 0 16px', color: 'var(--muted)' }}>
          اختر الوجهات التي تريد أن يظهر اسمك فيها
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ padding: '8px 16px', borderRadius: 10, background: 'var(--saudi-green)', color: 'white', fontWeight: 700, fontSize: 14 }}>
            {selectedIds.size} وجهة مختارة
          </span>
          <button className="btnPrimary" onClick={handleSave} disabled={saving}>
            {saving ? 'جاري الحفظ...' : 'حفظ الاختيارات'}
          </button>
        </div>
      </div>

      {destinations.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🏝️</div>
          <h3>لا توجد وجهات متاحة</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {destinations.map((dest) => {
            const images = JSON.parse(dest.images || '[]');
            const imageUrl = images && images.length > 0 ? images[0] : '/images/logo.png';
            const isSelected = selectedIds.has(dest.id);

            return (
              <div
                key={dest.id}
                className="card"
                onClick={() => toggleDestination(dest.id)}
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? '3px solid var(--saudi-green)' : '1px solid var(--border)',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ position: 'relative', height: 180 }}>
                  <img
                    src={imageUrl}
                    alt={dest.title}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.png'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'var(--saudi-green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                    }}>
                      ✓
                    </div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#3b82f620', color: '#3b82f6' }}>
                      {dest.category}
                    </span>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#eab30820', color: '#eab308' }}>
                      ⭐ {dest.rating}
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{dest.title}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>
                    📍 {dest.city} • {dest.region}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}