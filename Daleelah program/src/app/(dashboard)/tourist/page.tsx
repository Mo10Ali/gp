"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  participants: number;
  totalPrice: number;
  status: string;
  destination: {
    title: string;
    city: string;
    images: string;
  };
  guide?: {
    fullName: string;
  };
};

export default function TouristDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchBookings(userData.id);
  }, []);

  const fetchBookings = async (touristId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        const myBookings = data.filter((b: any) => b.touristId === touristId);
        setBookings(myBookings.slice(0, 3)); // أول 3 حجوزات فقط
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return '#22c55e';
      case 'PENDING': return '#eab308';
      case 'CANCELLED': return '#ef4444';
      case 'COMPLETED': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'مؤكد';
      case 'PENDING': return 'قيد الانتظار';
      case 'CANCELLED': return 'ملغي';
      case 'COMPLETED': return 'مكتمل';
      default: return status;
    }
  };

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>لوحة تحكم السائح 🧳</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--muted)' }}>
          إدارة حجوزاتك، تصفح الوجهات، واحصل على توصيات مخصصة
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
        <Link href="/planner" className="btn" style={{ padding: '12px 24px', fontSize: 15, textDecoration: 'none' }}>
          🤖 خطط رحلتك مع AI
        </Link>
        <Link href="/guides" className="btn" style={{ padding: '12px 24px', fontSize: 15, textDecoration: 'none' }}>
          🎯 ابحث عن مرشدين
        </Link>
        <Link href="/destinations" className="btnPrimary" style={{ padding: '12px 24px', fontSize: 15, textDecoration: 'none' }}>
          🗺️ تصفح الوجهات
        </Link>
      </div>

      {/* My Bookings Section */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900 }}>حجوزاتي 📅</h2>
          {bookings.length > 0 && (
            <Link href="/tourist/bookings" className="btn" style={{ fontSize: 14 }}>
              عرض الكل →
            </Link>
          )}
        </div>

        {loading ? (
          <div className="card" style={{ padding: 40, textAlign: 'center' }}>
            <p>جاري التحميل...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
            <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>لا توجد حجوزات</h3>
            <p style={{ margin: '12px 0 24px', color: 'var(--muted)' }}>
              ابدأ رحلتك واحجز أول وجهة
            </p>
            <Link href="/destinations" className="btnPrimary">
              استكشف الوجهات
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {bookings.map((booking) => {
              const images = booking.destination.images ? JSON.parse(booking.destination.images) : [];

              return (
                <div key={booking.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: 0 }}>
                    {images[0] && (
                      <div style={{ width: 140, height: 140, flexShrink: 0 }}>
                        <img
                          src={images[0]}
                          alt={booking.destination.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.png'; }}
                        />
                      </div>
                    )}
                    <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                            {booking.destination.title}
                          </h3>
                          <span style={{
                            padding: '6px 12px',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            background: `${getStatusColor(booking.status)}20`,
                            color: getStatusColor(booking.status),
                          }}>
                            {getStatusText(booking.status)}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 8px', fontSize: 14, color: 'var(--muted)' }}>
                          📍 {booking.destination.city}
                        </p>
                        {booking.guide && (
                          <p style={{ margin: '4px 0', fontSize: 14, color: 'var(--muted)' }}>
                            🎯 المرشد: {booking.guide.fullName}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                        <div style={{ fontSize: 14 }}>
                          <span style={{ color: 'var(--muted)' }}>
                            {new Date(booking.startDate).toLocaleDateString('ar-SA')} - {new Date(booking.endDate).toLocaleDateString('ar-SA')}
                          </span>
                          <span style={{ margin: '0 8px', color: 'var(--muted)' }}>•</span>
                          <span style={{ fontWeight: 700, color: 'var(--saudi-green)' }}>
                            {booking.totalPrice} SAR
                          </span>
                        </div>
                        <Link href={`/tourist/bookings/${booking.id}`} className="btn" style={{ fontSize: 13 }}>
                          عرض التفاصيل
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}