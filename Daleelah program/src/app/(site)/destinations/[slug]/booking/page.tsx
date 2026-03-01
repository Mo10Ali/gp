"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type Destination = {
  id: string;
  slug: string;
  title: string;
  city: string;
  images: string;
  summary: string;
};

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const { addToCart } = useCart();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [guides, setGuides] = useState<any[]>([]);

  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    participants: 1,
    guideId: '',
    notes: '',
  });

  useEffect(() => {
    fetchDestination();
    fetchGuides();
  }, []);

  const fetchDestination = async () => {
    try {
      const response = await fetch('/api/destinations');
      if (response.ok) {
        const data = await response.json();
        const dest = data.find((d: any) => d.slug === params.slug);
        setDestination(dest);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuides = async () => {
    try {
      const response = await fetch('/api/guides');
      if (response.ok) {
        const data = await response.json();
        setGuides(data || []);
      }
    } catch (error) {
      console.error('Error fetching guides:', error);
    }
  };

  const calculateDays = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0;
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const calculatePrice = () => {
    const days = calculateDays();
    const pricePerDay = 300;
    const selectedGuide = guides.find((g) => g.id === bookingData.guideId);
    const guidePrice = selectedGuide ? selectedGuide.pricePerHour * 8 : 0;
    return (pricePerDay * days * bookingData.participants) + (guidePrice * days);
  };

  const handleAddToCart = () => {
    if (!destination) return;

    if (!bookingData.startDate || !bookingData.endDate) {
      alert('الرجاء اختيار تاريخ البداية والنهاية');
      return;
    }

    const days = calculateDays();
    if (days <= 0) {
      alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
      return;
    }

    const selectedGuide = guides.find((g) => g.id === bookingData.guideId);
    const images = JSON.parse(destination.images);

    addToCart({
      destinationId: destination.id,
      destinationTitle: destination.title,
      destinationImage: images[0],
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      participants: bookingData.participants,
      guideId: bookingData.guideId || undefined,
      guideName: selectedGuide?.fullName || undefined,
      pricePerDay: 300,
      totalPrice: calculatePrice(),
    });

    alert('تمت الإضافة للسلة بنجاح!');
    router.push('/cart');
  };

  if (loading) {
    return (
      <main style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <h3>جاري التحميل...</h3>
        </div>
      </main>
    );
  }

  if (!destination) {
    return (
      <main style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <h3>الوجهة غير موجودة</h3>
          <Link href="/destinations" className="btn" style={{ marginTop: 20 }}>
            العودة للوجهات
          </Link>
        </div>
      </main>
    );
  }

  const images = JSON.parse(destination.images);
  const totalPrice = calculatePrice();
  const days = calculateDays();

  return (
    <main style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <Link href={`/destinations/${destination.slug}`} className="btn" style={{ marginBottom: 20 }}>
        ← العودة للوجهة
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 30 }}>
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            <img
              src={images[0]}
              alt={destination.title}
              style={{ width: '100%', height: 300, objectFit: 'cover' }}
            />
            <div style={{ padding: 20 }}>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900 }}>{destination.title}</h1>
              <p style={{ marginTop: 8, color: 'var(--muted)' }}>{destination.summary}</p>
            </div>
          </div>

          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900, marginBottom: 16 }}>تفاصيل الحجز</h3>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                  تاريخ البداية
                </label>
                <input
                  className="input"
                  type="date"
                  value={bookingData.startDate}
                  onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                  تاريخ النهاية
                </label>
                <input
                  className="input"
                  type="date"
                  value={bookingData.endDate}
                  onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                  min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                  عدد المشاركين
                </label>
                <input
                  className="input"
                  type="number"
                  value={bookingData.participants}
                  onChange={(e) => setBookingData({ ...bookingData, participants: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                  اختيار مرشد (اختياري)
                </label>
                <select
                  className="input"
                  value={bookingData.guideId}
                  onChange={(e) => setBookingData({ ...bookingData, guideId: e.target.value })}
                >
                  <option value="">بدون مرشد</option>
                  {guides.map((guide) => (
                    <option key={guide.id} value={guide.id}>
                      {guide.fullName} - {guide.pricePerHour * 8} SAR/يوم
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>
                  ملاحظات
                </label>
                <textarea
                  className="input"
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  rows={3}
                  placeholder="أي ملاحظات خاصة..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, marginBottom: 16 }}>ملخص الحجز</h3>

            <div style={{ display: 'grid', gap: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>عدد الأيام</span>
                <span style={{ fontWeight: 700 }}>{days} {days === 1 ? 'يوم' : 'أيام'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>عدد المشاركين</span>
                <span style={{ fontWeight: 700 }}>{bookingData.participants}</span>
              </div>
              {bookingData.guideId && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--muted)' }}>المرشد</span>
                  <span style={{ fontWeight: 700 }}>
                    {guides.find((g) => g.id === bookingData.guideId)?.fullName}
                  </span>
                </div>
              )}
            </div>

            <div
              style={{
                borderTop: '1px solid var(--border)',
                paddingTop: 16,
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 900 }}>الإجمالي</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--saudi-green)' }}>
                  {totalPrice} SAR
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                * السعر شامل جميع الرسوم
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="btnPrimary"
              style={{ width: '100%', padding: '14px', fontSize: 16 }}
              disabled={!bookingData.startDate || !bookingData.endDate || days <= 0}
            >
              إضافة للسلة 🛒
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}