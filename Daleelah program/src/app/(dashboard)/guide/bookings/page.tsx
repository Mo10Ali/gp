"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Booking = {
  id: string;
  startDate: string;
  endDate: string;
  participants: number;
  totalPrice: number;
  status: string;
  notes: string;
  destination: {
    title: string;
    city: string;
    images: string;
  };
  tourist: {
    fullName: string;
    phone: string;
    email: string;
  };
};

export default function GuideBookingsPage() {
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

  const fetchBookings = async (guideId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        console.log('All bookings:', data);
        
        const myBookings = data.filter((b: any) => {
          console.log('Booking guideId:', b.guideId, 'My ID:', guideId);
          return b.guideId === guideId;
        });
        
        console.log('My bookings:', myBookings);
        setBookings(myBookings);
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

  if (loading) {
    return (
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>جاري التحميل...</h2>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 34, fontWeight: 900 }}>حجوزاتي 📅</h1>
      <p style={{ margin: '0 0 32px', color: 'var(--muted)' }}>
        {bookings.length} حجز مرتبط بك
      </p>

      {bookings.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
          <h3>لا توجد حجوزات بعد</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            عندما يحجز السياح رحلات معك، ستظهر هنا
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {bookings.map((booking) => {
            const images = booking.destination.images ? JSON.parse(booking.destination.images) : [];
            const days = Math.ceil(
              (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={booking.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16, marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 16, flex: 1 }}>
                    {images[0] && (
                      <div style={{ width: 80, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                        <img
                          src={images[0]}
                          alt={booking.destination.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.png'; }}
                        />
                      </div>
                    )}
                    <div>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                        {booking.destination.title}
                      </h3>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
                        📍 {booking.destination.city}
                      </p>
                    </div>
                  </div>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                    background: `${getStatusColor(booking.status)}20`,
                    color: getStatusColor(booking.status),
                    flexShrink: 0,
                  }}>
                    {getStatusText(booking.status)}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>تاريخ البداية</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {new Date(booking.startDate).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>تاريخ النهاية</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {new Date(booking.endDate).toLocaleDateString('ar-SA')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>المدة</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{days} يوم</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>عدد الأشخاص</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>👥 {booking.participants}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>السعر الإجمالي</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--saudi-green)' }}>
                      {booking.totalPrice} SAR
                    </div>
                  </div>
                </div>

                <div className="card" style={{ padding: 16, background: 'rgba(59, 130, 246, 0.08)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: '#3b82f6' }}>
                    👤 معلومات السائح:
                  </div>
                  {booking.tourist ? (
                    <div style={{ display: 'grid', gap: 4, fontSize: 14 }}>
                      <div><strong>الاسم:</strong> {booking.tourist.fullName || 'غير متوفر'}</div>
                     
                      {booking.tourist.phone && <div><strong>الجوال:</strong> {booking.tourist.phone}</div>}
                    </div>
                  ) : (
                    <div style={{ fontSize: 14, color: 'var(--muted)' }}>
                      معلومات السائح غير متوفرة
                    </div>
                  )}
                </div>

                {booking.notes && (
                  <div style={{
                    marginTop: 12,
                    padding: 12,
                    borderRight: '3px solid var(--saudi-green)',
                    background: 'rgba(255,255,255,0.03)',
                    fontSize: 14,
                  }}>
                    <strong>ملاحظات السائح:</strong> {booking.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}