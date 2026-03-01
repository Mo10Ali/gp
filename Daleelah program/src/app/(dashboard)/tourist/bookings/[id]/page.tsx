"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
  guide?: {
    fullName: string;
    phone: string;
    guideProfile?: {
      pricePerHour: number;
    };
  };
};

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const data = await res.json();
        const found = data.find((b: any) => b.id === params.id);
        if (found) setBooking(found);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking) return;

    if (!confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) return;

    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (res.ok) {
        alert('✅ تم إلغاء الحجز بنجاح!');
        router.push('/tourist/bookings');
      } else {
        alert('فشل في إلغاء الحجز');
      }
    } catch (error) {
      alert('حدث خطأ');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>جاري التحميل...</h2>
      </main>
    );
  }

  if (!booking) {
    return (
      <main style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2>الحجز غير موجود</h2>
        <Link href="/tourist/bookings" className="btnPrimary" style={{ marginTop: 20 }}>
          العودة للحجوزات
        </Link>
      </main>
    );
  }

  const images = booking.destination.images ? JSON.parse(booking.destination.images) : [];
  const days = Math.ceil(
    (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const canCancel = booking.status === 'CONFIRMED' || booking.status === 'PENDING';

  return (
    <main style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/tourist/bookings" className="btn" style={{ marginBottom: 24, display: 'inline-flex', gap: 8 }}>
        ← العودة للحجوزات
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>تفاصيل الحجز</h1>
        
        {canCancel && (
          <button
            onClick={handleCancelBooking}
            disabled={cancelling}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              border: '1px solid #ef4444',
              background: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              cursor: cancelling ? 'not-allowed' : 'pointer',
              fontWeight: 700,
              fontSize: 15,
              opacity: cancelling ? 0.6 : 1,
            }}
          >
            {cancelling ? 'جاري الإلغاء...' : '🗑️ إلغاء الحجز'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gap: 20 }}>
        {/* Destination Card */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            {images[0] && (
              <div style={{ width: 120, height: 120, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                <img 
                  src={images[0]} 
                  alt={booking.destination.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.png'; }}
                />
              </div>
            )}
            <div>
              <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{booking.destination.title}</h2>
              <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>📍 {booking.destination.city}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>تاريخ البداية</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{new Date(booking.startDate).toLocaleDateString('ar-SA')}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>تاريخ النهاية</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{new Date(booking.endDate).toLocaleDateString('ar-SA')}</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>عدد الأيام</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{days} يوم</div>
            </div>
            <div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>عدد الأشخاص</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{booking.participants} شخص</div>
            </div>
          </div>
        </div>

        {/* Guide Card */}
        {booking.guide && (
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 900 }}>المرشد السياحي 🎯</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <div><strong>الاسم:</strong> {booking.guide.fullName}</div>
              {booking.guide.phone && <div><strong>الجوال:</strong> {booking.guide.phone}</div>}
              {booking.guide.guideProfile?.pricePerHour && (
                <div><strong>السعر:</strong> {booking.guide.guideProfile.pricePerHour} SAR/ساعة</div>
              )}
            </div>
          </div>
        )}

        {/* Financial Summary */}
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 20, fontWeight: 900 }}>الملخص المالي 💰</h3>
          <div style={{ display: 'grid', gap: 12, fontSize: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              <span>الإجمالي:</span>
              <span style={{ fontWeight: 700, color: 'var(--saudi-green)', fontSize: 24 }}>{booking.totalPrice} SAR</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>الحالة:</span>
              <span style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                background: booking.status === 'CONFIRMED' ? '#22c55e20' : 
                           booking.status === 'CANCELLED' ? '#ef444420' : '#eab30820',
                color: booking.status === 'CONFIRMED' ? '#22c55e' : 
                       booking.status === 'CANCELLED' ? '#ef4444' : '#eab308',
              }}>
                {booking.status === 'CONFIRMED' ? 'مؤكد' : 
                 booking.status === 'CANCELLED' ? 'ملغي' : 
                 booking.status === 'COMPLETED' ? 'مكتمل' : 'قيد الانتظار'}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 900 }}>ملاحظاتك 📝</h3>
            <p style={{ margin: 0, lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>{booking.notes}</p>
          </div>
        )}
      </div>
    </main>
  );
}
