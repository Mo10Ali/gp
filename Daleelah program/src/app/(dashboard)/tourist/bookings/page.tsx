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
  notes: string;
  destination: {
    title: string;
    city: string;
    images: string;
  };
  guide?: {
    fullName: string;
  };
};

export default function TouristBookingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    startDate: '',
    endDate: '',
    participants: '1',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(userStr);
    if (userData.role !== 'TOURIST') {
      router.push('/auth/login');
      return;
    }
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
        setBookings(myBookings);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingId(booking.id);
    setEditForm({
      startDate: booking.startDate.split('T')[0],
      endDate: booking.endDate.split('T')[0],
      participants: booking.participants.toString(),
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId || !user) return;

    const startDate = new Date(editForm.startDate);
    const endDate = new Date(editForm.endDate);

    if (endDate <= startDate) {
      alert('تاريخ النهاية يجب أن يكون بعد تاريخ البداية');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/bookings/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          participants: parseInt(editForm.participants),
        }),
      });

      if (res.ok) {
        alert('✅ تم تعديل الحجز بنجاح!');
        setEditingId(null);
        fetchBookings(user.id);
      } else {
        alert('فشل في تعديل الحجز');
      }
    } catch (error) {
      alert('حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ startDate: '', endDate: '', participants: '1' });
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) return;

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED' }),
      });

      if (res.ok) {
        alert('✅ تم إلغاء الحجز بنجاح!');
        fetchBookings(user.id);
      } else {
        alert('فشل في إلغاء الحجز');
      }
    } catch (error) {
      alert('حدث خطأ');
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
      <p style={{ margin: '0 0 24px', color: 'var(--muted)' }}>
        {bookings.length} حجز • {bookings.filter(b => b.status === 'CONFIRMED').length} مؤكد
      </p>

      {/* Filters */}
      <div className="card" style={{ padding: 20, marginBottom: 24 }}>
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
            الكل ({bookings.length})
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
            مؤكدة ({bookings.filter(b => b.status === 'CONFIRMED').length})
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
            مكتملة ({bookings.filter(b => b.status === 'COMPLETED').length})
          </button>
          <button
            onClick={() => setFilter('CANCELLED')}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: 'none',
              background: filter === 'CANCELLED' ? '#ef4444' : 'rgba(255,255,255,0.08)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            ملغية ({bookings.filter(b => b.status === 'CANCELLED').length})
          </button>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
          <h3>لا توجد حجوزات</h3>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>
            {filter === 'all' 
              ? 'لم تقم بأي حجز بعد'
              : `لا توجد حجوزات ${getStatusText(filter)}`
            }
          </p>
          {filter === 'all' && (
            <Link href="/destinations" className="btnPrimary" style={{ marginTop: 24 }}>
              استكشف الوجهات
            </Link>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredBookings.map((booking) => {
            const images = booking.destination.images ? JSON.parse(booking.destination.images) : [];
            const isEditing = editingId === booking.id;
            const canEdit = booking.status === 'CONFIRMED' || booking.status === 'PENDING';
            const canCancel = booking.status === 'CONFIRMED' || booking.status === 'PENDING';

            return (
              <div key={booking.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 0 }}>
                  {images[0] && (
                    <div style={{ width: 140, height: 180, flexShrink: 0 }}>
                      <img
                        src={images[0]}
                        alt={booking.destination.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.png'; }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1, padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>
                          {booking.destination.title}
                        </h3>
                        <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--muted)' }}>
                          📍 {booking.destination.city}
                        </p>
                      </div>
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

                    {isEditing ? (
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: 'var(--muted)' }}>
                              تاريخ البداية
                            </label>
                            <input
                              type="date"
                              className="input"
                              value={editForm.startDate}
                              onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })}
                              style={{ padding: 8, fontSize: 14 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: 'var(--muted)' }}>
                              تاريخ النهاية
                            </label>
                            <input
                              type="date"
                              className="input"
                              value={editForm.endDate}
                              onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                              style={{ padding: 8, fontSize: 14 }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: 12, marginBottom: 4, color: 'var(--muted)' }}>
                              عدد الأشخاص
                            </label>
                            <input
                              type="number"
                              min="1"
                              className="input"
                              value={editForm.participants}
                              onChange={(e) => setEditForm({ ...editForm, participants: e.target.value })}
                              style={{ padding: 8, fontSize: 14 }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={handleSaveEdit}
                            disabled={saving}
                            className="btnPrimary"
                            style={{ padding: '8px 16px', fontSize: 13 }}
                          >
                            {saving ? 'جاري الحفظ...' : '✓ حفظ'}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="btn"
                            style={{ padding: '8px 16px', fontSize: 13 }}
                          >
                            ✕ إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 12, fontSize: 14 }}>
                        <div>
                          <span style={{ color: 'var(--muted)' }}>من:</span>{' '}
                          <strong>{new Date(booking.startDate).toLocaleDateString('ar-SA')}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted)' }}>إلى:</span>{' '}
                          <strong>{new Date(booking.endDate).toLocaleDateString('ar-SA')}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted)' }}>الأشخاص:</span>{' '}
                          <strong>{booking.participants}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--muted)' }}>السعر:</span>{' '}
                          <strong style={{ color: 'var(--saudi-green)' }}>{booking.totalPrice} SAR</strong>
                        </div>
                      </div>
                    )}

                    {booking.guide && (
                      <p style={{ margin: '8px 0', fontSize: 13, color: 'var(--muted)' }}>
                        🎯 المرشد: {booking.guide.fullName}
                      </p>
                    )}

                    {!isEditing && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <Link href={`/tourist/bookings/${booking.id}`} className="btn" style={{ fontSize: 13 }}>
                          عرض التفاصيل
                        </Link>
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(booking)}
                            className="btn"
                            style={{ fontSize: 13 }}
                          >
                            ✏️ تعديل
                          </button>
                        )}
                        {canCancel && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: 8,
                              border: '1px solid #ef4444',
                              background: 'rgba(239,68,68,0.1)',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: 13,
                            }}
                          >
                            🗑️ إلغاء الحجز
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}