"use client";

import { useState, useEffect } from "react";

type Destination = {
  id: string;
  slug: string;
  title: string;
  city: string;
  region: string;
  category: string;
  summary: string;
  description: string;
  images: string;
  tags: string;
  rating: number;
  status: string;
};

const emptyForm = {
  slug: '',
  title: '',
  city: '',
  region: '',
  category: 'Heritage',
  summary: '',
  description: '',
  images: '',
  tags: '',
  rating: '4.5',
  status: 'APPROVED',
};

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchDestinations(); }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/destinations');
      const data = await res.json();
      setDestinations(data);
    } catch (error) {
      alert('فشل في جلب الوجهات');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.slug || !form.city) {
      alert('الرجاء تعبئة الحقول المطلوبة (العنوان، الـ Slug، المدينة)');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        images: form.images.split('\n').filter(Boolean),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        rating: parseFloat(form.rating),
      };

      const url = editingId ? `/api/destinations/${editingId}` : '/api/destinations';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingId ? '✅ تم التعديل بنجاح!' : '✅ تمت الإضافة بنجاح!');
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchDestinations();
      } else {
        const err = await res.json();
        alert('خطأ: ' + err.error);
      }
    } catch (error) {
      alert('حدث خطأ');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (dest: Destination) => {
    const images = JSON.parse(dest.images || '[]');
    const tags = JSON.parse(dest.tags || '[]');
    setForm({
      slug: dest.slug,
      title: dest.title,
      city: dest.city,
      region: dest.region,
      category: dest.category,
      summary: dest.summary,
      description: dest.description,
      images: images.join('\n'),
      tags: tags.join(', '),
      rating: dest.rating.toString(),
      status: dest.status,
    });
    setEditingId(dest.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`هل أنت متأكد من حذف "${title}"؟`)) return;

    try {
      console.log('Deleting destination ID:', id);
      
      const res = await fetch(`/api/destinations/${id}`, { 
        method: 'DELETE' 
      });
      
      console.log('Delete response status:', res.status);
      const data = await res.json();
      console.log('Delete response data:', data);

      if (res.ok) {
        alert('✅ تم الحذف بنجاح!');
        fetchDestinations();
      } else {
        alert('فشل في الحذف: ' + (data.error || 'خطأ غير معروف'));
        console.error('Delete failed:', data);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('حدث خطأ: ' + (error as Error).message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>إدارة الوجهات</h1>
          <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>
            {destinations.length} وجهة مسجلة
          </p>
        </div>
        {!showForm && (
          <button className="btnPrimary" onClick={() => setShowForm(true)}>
            + إضافة وجهة جديدة
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 900 }}>
            {editingId ? '✏️ تعديل وجهة' : '➕ إضافة وجهة جديدة'}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="العنوان *" required>
              <input className="input" placeholder="مثال: العلا - مدائن صالح"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>

            <Field label="Slug (رابط فريد) *" required>
              <input className="input" placeholder="مثال: alula-hegra"
                value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </Field>

            <Field label="المدينة *" required>
              <input className="input" placeholder="مثال: AlUla"
                value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Field>

            <Field label="المنطقة">
              <input className="input" placeholder="مثال: Madinah Region"
                value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            </Field>

            <Field label="التصنيف">
              <select className="input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="Heritage">تراث</option>
                <option value="Nature">طبيعة</option>
                <option value="City">مدينة</option>
                <option value="Adventure">مغامرة</option>
                <option value="Beach">شاطئ</option>
              </select>
            </Field>

            <Field label="التقييم (0-5)">
              <input className="input" type="number" min="0" max="5" step="0.1"
                value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </Field>

            <Field label="الحالة">
              <select className="input" value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="APPROVED">موافق عليه</option>
                <option value="PENDING">قيد المراجعة</option>
                <option value="REJECTED">مرفوض</option>
              </select>
            </Field>

            <Field label="الوسوم (فصل بفاصلة)">
              <input className="input" placeholder="مثال: UNESCO, تاريخ, صحراء"
                value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </Field>
          </div>

          <div style={{ marginTop: 16 }}>
            <Field label="الوصف المختصر">
              <textarea className="input" rows={2} placeholder="وصف مختصر للوجهة"
                value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                style={{ resize: 'vertical' }} />
            </Field>
          </div>

          <div style={{ marginTop: 16 }}>
            <Field label="الوصف الكامل">
              <textarea className="input" rows={4} placeholder="وصف تفصيلي للوجهة"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ resize: 'vertical' }} />
            </Field>
          </div>

          <div style={{ marginTop: 16 }}>
            <Field label="روابط الصور (رابط في كل سطر)">
              <textarea className="input" rows={3}
                placeholder={"/images/alula_2.jpeg\n/images/diriyah_1.webp"}
                value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}
                style={{ resize: 'vertical', direction: 'ltr' }} />
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btnPrimary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'جاري الحفظ...' : editingId ? 'حفظ التعديلات' : 'إضافة الوجهة'}
            </button>
            <button className="btn" onClick={handleCancel}>
              إلغاء
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <p>جاري التحميل...</p>
        </div>
      ) : destinations.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏝️</div>
          <h3 style={{ margin: 0 }}>لا توجد وجهات بعد</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {destinations.map((dest) => {
            const images = JSON.parse(dest.images || '[]');
            const tags = JSON.parse(dest.tags || '[]');
            const imageUrl = images && images.length > 0 && images[0] ? images[0] : '/images/logo.png';

            return (
              <div key={dest.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: 0 }}>
                  <div style={{ width: 120, flexShrink: 0, background: '#1a1a1a' }}>
                    <img
                      src={imageUrl}
                      alt={dest.title}
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/logo.png'; }}
                      style={{ width: '100%', height: 120, objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#3b82f620', color: '#3b82f6' }}>
                          {dest.category}
                        </span>
                        <span style={{
                          padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                          background: dest.status === 'APPROVED' ? '#22c55e20' : '#eab30820',
                          color: dest.status === 'APPROVED' ? '#22c55e' : '#eab308',
                        }}>
                          {dest.status === 'APPROVED' ? 'موافق عليه' : dest.status === 'PENDING' ? 'قيد المراجعة' : 'مرفوض'}
                        </span>
                      </div>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{dest.title}</h3>
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
                        📍 {dest.city} • {dest.region} • ⭐ {dest.rating}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {tags.slice(0, 3).map((tag: string, i: number) => (
                          <span key={i} style={{ padding: '2px 6px', borderRadius: 4, fontSize: 11, background: 'rgba(255,255,255,0.08)', color: 'var(--muted)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button className="btn" onClick={() => handleEdit(dest)} style={{ fontSize: 13 }}>
                        ✏️ تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(dest.id, dest.title)}
                        style={{
                          padding: '8px 14px', borderRadius: 10, border: '1px solid #ef4444',
                          background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                          cursor: 'pointer', fontWeight: 600, fontSize: 13,
                        }}
                      >
                        🗑️ حذف
                      </button>
                    </div>
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

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {children}
    </div>
  );
}