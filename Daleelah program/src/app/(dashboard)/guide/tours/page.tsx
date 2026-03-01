"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Tour = {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  maxParticipants: number;
  status: string;
};

export default function GuideToursPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '09:00',
    duration: '3 ساعات',
    price: '500',
    maxParticipants: '10',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchTours(userData.id);
  }, []);

  const fetchTours = async (guideId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/tours');
      if (res.ok) {
        const data = await res.json();
        const myTours = data.filter((t: any) => t.guideId === guideId);
        setTours(myTours);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !form.title || !form.location || !form.date) {
      alert('الرجاء تعبئة جميع الحقول المطلوبة');
      return;
    }

    try {
      const payload = {
        guideId: user.id,
        title: form.title,
        description: form.description,
        location: form.location,
        date: new Date(form.date).toISOString(),
        time: form.time,
        duration: form.duration,
        price: parseInt(form.price),
        maxParticipants: parseInt(form.maxParticipants),
        status: 'UPCOMING',
      };

      const url = editingId ? `/api/tours/${editingId}` : '/api/tours';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingId ? '✅ تم التعديل!' : '✅ تمت الإضافة!');
        setShowForm(false);
        setEditingId(null);
        setForm({
          title: '', description: '', location: '', date: '',
          time: '09:00', duration: '3 ساعات', price: '500', maxParticipants: '10',
        });
        fetchTours(user.id);
      } else {
        alert('فشل في الحفظ');
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;

    try {
      const res = await fetch(`/api/tours/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('✅ تم الحذف!');
        fetchTours(user.id);
      }
    } catch (error) {
      alert('حدث خطأ');
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 34, fontWeight: 900 }}>جولاتي 🎫</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>{tours.length} جولة</p>
        </div>
        {!showForm && (
          <button className="btnPrimary" onClick={() => setShowForm(true)}>
            + إضافة جولة
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 900 }}>
            {editingId ? 'تعديل جولة' : 'إضافة جولة جديدة'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="عنوان الجولة *">
              <input className="input" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>

            <Field label="الموقع *">
              <input className="input" value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>

            <Field label="التاريخ *">
              <input className="input" type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>

            <Field label="الوقت">
              <input className="input" type="time" value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>

            <Field label="المدة">
              <input className="input" value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </Field>

            <Field label="السعر (SAR)">
              <input className="input" type="number" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </Field>

            <Field label="أقصى عدد مشاركين">
              <input className="input" type="number" value={form.maxParticipants}
                onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} />
            </Field>
          </div>

          <Field label="الوصف">
            <textarea className="input" rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ resize: 'vertical', marginTop: 16 }} />
          </Field>

          <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
            <button className="btnPrimary" onClick={handleSubmit}>حفظ</button>
            <button className="btn" onClick={() => { setShowForm(false); setEditingId(null); }}>
              إلغاء
            </button>
          </div>
        </div>
      )}

      {tours.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎫</div>
          <h3>لا توجد جولات</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {tours.map((tour) => (
            <div key={tour.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{tour.title}</h3>
                <span style={{ padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#22c55e20', color: '#22c55e' }}>
                  {tour.status}
                </span>
              </div>
              <p style={{ margin: '8px 0', color: 'var(--muted)', fontSize: 14 }}>{tour.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginTop: 12 }}>
                <div><strong>📍</strong> {tour.location}</div>
                <div><strong>📅</strong> {new Date(tour.date).toLocaleDateString('ar-SA')}</div>
                <div><strong>⏰</strong> {tour.time}</div>
                <div><strong>⏱️</strong> {tour.duration}</div>
                <div><strong>💰</strong> {tour.price} SAR</div>
                <div><strong>👥</strong> {tour.maxParticipants} مشارك</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button className="btn" onClick={() => handleDelete(tour.id)} style={{ fontSize: 13 }}>
                  🗑️ حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}