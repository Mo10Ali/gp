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
    id: string;
    title: string;
    city: string;
  };
  tourist: {
    fullName: string;
    phone: string;
    email: string;
  };
  guide?: {
    fullName: string;
    phone: string;
  };
};

export default function CompanyBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchData(userData.id);
  }, []);

  const fetchData = async (companyId: string) => {
    try {
      setLoading(true);
      
      // جلب الوجهات التابعة للشركة
      const destRes = await fetch('/api/destinations');
      if (destRes.ok) {
        const allDestinations = await destRes.json();
        // في الوضع الحالي، كل الوجهات متاحة
        // لاحقاً يمكن فلترتها حسب companyId إذا أضفنا هذا الحقل
        setDestinations(allDestinations);
      }

      // جلب كل الحجوزات
      const bookRes = await fetch('/api/bookings');
      if (bookRes.ok) {
        const allBookings = await bookRes.json();
        setBookings(allBookings);
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

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'PENDING').length,
    confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
    completed: bookings.filter(b => b.status === 'COMPLETED').length,
    revenue: bookings
      .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  if (loading) {
    return (
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>جاري التحميل...</h2>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1400, margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>حجوزات الشركة 📅</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>
          إدارة ومتابعة حجوزات الوجهات
        </p>
      </div>

      {/* Statistics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>إجمالي الحجوزات</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6' }}>{stats.total}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>قيد الانتظار</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#eab308' }}>{stats.pending}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>مؤكدة</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e' }}>{stats.confirmed}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>مكتملة</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6' }}>{stats.completed}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>الإيرادات</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--saudi-green)' }}>
            {stats.revenue.toLocaleString()}
            <span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4 }}>SAR</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filter === 'all' ? 'var(--saudi-green)' : 'rgba(255,255,255,0.08)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            الكل ({stats.total})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filter === 'PENDING' ? '#eab308' : 'rgba(255,255,255,0.08)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            قيد الانتظار ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('CONFIRMED')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filter === 'CONFIRMED' ? '#22c55e' : 'rgba(255,255,255,0.08)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            مؤكدة ({stats.confirmed})
          </button>
          <button
            onClick={() => setFilter('COMPLETED')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filter === 'COMPLETED' ? '#3b82f6' : 'rgba(255,255,255,0.08)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            مكتملة ({stats.completed})
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
          <h3>لا توجد حجوزات</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            {filter === 'all' 
              ? 'لا توجد حجوزات بعد'
              : `لا توجد حجوزات ${getStatusText(filter)}`
            }
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 6 }}>
                    {booking.destination.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)' }}>
                    📍 {booking.destination.city}
                  </p>
                </div>
                <span style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  background: `${getStatusColor(booking.status)}20`,
                  color: getStatusColor(booking.status),
                }}>
                  {getStatusText(booking.status)}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 20 }}>
                {/* Tourist Info */}
                <div className="card" style={{ padding: 16, background: 'rgba(59, 130, 246, 0.08)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#3b82f6' }}>
                    👤 معلومات السائح
                  </div>
                  <div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
                    <div><strong>الاسم:</strong> {booking.tourist.fullName}</div>
                    <div><strong>البريد:</strong> {booking.tourist.email}</div>
                    {booking.tourist.phone && <div><strong>الجوال:</strong> {booking.tourist.phone}</div>}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="card" style={{ padding: 16, background: 'rgba(34, 197, 94, 0.08)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#22c55e' }}>
                    📋 تفاصيل الحجز
                  </div>
                  <div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
                    <div><strong>من:</strong> {new Date(booking.startDate).toLocaleDateString('ar-SA')}</div>
                    <div><strong>إلى:</strong> {new Date(booking.endDate).toLocaleDateString('ar-SA')}</div>
                    <div><strong>المشاركين:</strong> {booking.participants} شخص</div>
                    <div><strong>السعر:</strong> <span style={{ color: 'var(--saudi-green)', fontWeight: 700 }}>{booking.totalPrice} SAR</span></div>
                  </div>
                </div>

                {/* Guide Info (if exists) */}
                {booking.guide && (
                  <div className="card" style={{ padding: 16, background: 'rgba(234, 179, 8, 0.08)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#eab308' }}>
                      🎯 المرشد
                    </div>
                    <div style={{ display: 'grid', gap: 6, fontSize: 14 }}>
                      <div><strong>الاسم:</strong> {booking.guide.fullName}</div>
                      {booking.guide.phone && <div><strong>الجوال:</strong> {booking.guide.phone}</div>}
                    </div>
                  </div>
                )}
              </div>

              {booking.notes && (
                <div style={{
                  padding: 12,
                  borderRight: '3px solid var(--saudi-green)',
                  background: 'rgba(255,255,255,0.03)',
                  fontSize: 14,
                  marginTop: 12,
                }}>
                  <strong>ملاحظات:</strong> {booking.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}