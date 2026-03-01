"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleCheckout = async () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    alert('الرجاء تسجيل الدخول أولاً');
    router.push('/auth/login');
    return;
  }

  const user = JSON.parse(userStr);

  if (cart.length === 0) {
    alert('السلة فارغة!');
    return;
  }

  setLoading(true);

  try {
    let successCount = 0;
    let failedCount = 0;

    for (const item of cart) {
      try {
        console.log('Creating booking for:', item);

        const bookingData = {
          touristId: user.id,
          guideId: item.guideId || null,
          destinationId: item.destinationId,
          startDate: item.startDate,
          endDate: item.endDate,
          totalPrice: item.totalPrice,
          participants: item.participants,
          notes: '',
        };

        console.log('Sending booking data:', bookingData);

        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();
        console.log('Booking response:', result);

        if (!response.ok) {
          console.error('Booking failed:', result);
          failedCount++;
          alert(`فشل حجز ${item.destinationTitle}: ${result.error}`);
        } else {
          successCount++;
          console.log('Booking success:', result);
        }
      } catch (error) {
        console.error('Error booking:', error);
        failedCount++;
        alert(`خطأ في حجز ${item.destinationTitle}`);
      }
    }

    if (successCount > 0) {
      alert(`تم إتمام ${successCount} حجز بنجاح! 🎉`);
      clearCart();
      router.push('/tourist/bookings');
    } else {
      alert('فشلت جميع الحجوزات. الرجاء المحاولة مرة أخرى.');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('حدث خطأ أثناء إتمام الحجز: ' + (error as Error).message);
  } finally {
    setLoading(false);
  }
};

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (cart.length === 0) {
    return (
      <main style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto', minHeight: '70vh' }}>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, marginBottom: 20 }}>سلة الحجز 🛒</h1>
        
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🛒</div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>السلة فارغة</h2>
          <p style={{ margin: '0 0 30px', color: 'var(--muted)' }}>
            لم تقم بإضافة أي حجوزات بعد
          </p>
          <Link href="/destinations" className="btnPrimary" style={{ padding: '14px 28px' }}>
            تصفح الوجهات
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, marginBottom: 8 }}>سلة الحجز 🛒</h1>
      <p style={{ margin: '0 0 30px', color: 'var(--muted)' }}>
        لديك {cart.length} {cart.length === 1 ? 'حجز' : 'حجوزات'} في السلة
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 30 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          {cart.map((item) => {
            const days = calculateDays(item.startDate, item.endDate);

            return (
              <div key={item.destinationId} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 0 }}>
                  <div style={{ width: 200, flexShrink: 0 }}>
                    <img
                      src={item.destinationImage}
                      alt={item.destinationTitle}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 200 }}
                    />
                  </div>

                  <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
                        {item.destinationTitle}
                      </h3>

                      <div style={{ display: 'grid', gap: 8, fontSize: 14, color: 'var(--muted)' }}>
                        <div>📅 من {item.startDate} إلى {item.endDate}</div>
                        <div>⏱️ {days} {days === 1 ? 'يوم' : 'أيام'}</div>
                        <div>👥 {item.participants} {item.participants === 1 ? 'مشارك' : 'مشاركين'}</div>
                        {item.guideName && <div>🎯 المرشد: {item.guideName}</div>}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--saudi-green)' }}>
                        {item.totalPrice} SAR
                      </div>
                      <button
                        onClick={() => removeFromCart(item.destinationId)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: 8,
                          border: '1px solid #ef4444',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, marginBottom: 20 }}>ملخص الطلب</h3>

            <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>عدد الحجوزات</span>
                <span style={{ fontWeight: 700 }}>{cart.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>المجموع الفرعي</span>
                <span style={{ fontWeight: 700 }}>{totalAmount} SAR</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>رسوم الخدمة</span>
                <span style={{ fontWeight: 700 }}>0 SAR</span>
              </div>
            </div>

            <div
              style={{
                borderTop: '2px solid var(--border)',
                paddingTop: 20,
                marginBottom: 24,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 20, fontWeight: 900 }}>الإجمالي</span>
              <span style={{ fontSize: 26, fontWeight: 900, color: 'var(--saudi-green)' }}>
                {totalAmount} SAR
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btnPrimary"
              style={{ width: '100%', padding: '16px', fontSize: 18, marginBottom: 12 }}
            >
              {loading ? 'جاري الحجز...' : 'إتمام الحجز ✓'}
            </button>

            <Link href="/destinations" className="btn" style={{ width: '100%', padding: '12px', fontSize: 14, textAlign: 'center' }}>
              إضافة المزيد
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}