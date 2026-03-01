"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Guide = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  isSuspended: boolean;
  guideProfile?: {
    bio: string;
    specialties: string;
    languages: string;
    pricePerHour: number;
    experienceYears: number;
    rating: number;
  };
};

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  avatar: '',
  bio: '',
  specialties: '',
  languages: 'العربية',
  pricePerHour: '100',
  experienceYears: '0',
  rating: '0',
};

export default function MinistryGuidesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(userStr);
    if (userData.role !== 'MINISTRY') {
      router.push('/auth/login');
      return;
    }
    setUser(userData);
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/guides');
      const data = await res.json();
      setGuides(data);
    } catch (error) {
      alert('فشل في جلب المرشدين');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.email) {
      alert('الرجاء تعبئة الاسم والبريد الإلكتروني');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        specialties: form.specialties.split(',').map((s) => s.trim()).filter(Boolean),
        languages: form.languages.split(',').map((l) => l.trim()).filter(Boolean),
        pricePerHour: parseInt(form.pricePerHour),
        experienceYears: parseInt(form.experienceYears),
        rating: parseFloat(form.rating),
      };

      const res = await fetch(`/api/guides/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('✅ تم التعديل بنجاح!');
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        fetchGuides();
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

  const handleEdit = (guide: Guide) => {
    const profile = guide.guideProfile;
    const specialties = profile?.specialties ? JSON.parse(profile.specialties) : [];
    const languages = profile?.languages ? JSON.parse(profile.languages) : ['العربية'];

    setForm({
      fullName: guide.fullName,
      email: guide.email,
      phone: guide.phone || '',
      avatar: guide.avatar || '',
      bio: profile?.bio || '',
      specialties: specialties.join(', '),
      languages: languages.join(', '),
      pricePerHour: profile?.pricePerHour?.toString() || '100',
      experienceYears: profile?.experienceYears?.toString() || '0',
      rating: profile?.rating?.toString() || '0',
    });
    setEditingId(guide.id);
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleToggleSuspend = async (id: string, currentStatus: boolean, name: string) => {
    const action = currentStatus ? 'إلغاء تعليق' : 'تعليق';
    if (!confirm(`هل أنت متأكد من ${action} المرشد "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/guides/${id}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuspended: !currentStatus }),
      });

      if (res.ok) {
        alert(`✅ تم ${action} المرشد بنجاح!`);
        fetchGuides();
      } else {
        alert('فشل في العملية');
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المرشد "${name}"؟`)) return;

    try {
      const res = await fetch(`/api/guides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert('✅ تم الحذف بنجاح!');
        fetchGuides();
      } else {
        alert('فشل في الحذف');
      }
    } catch (error) {
      alert('حدث خطأ');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const activeGuides = guides.filter(g => !g.isSuspended).length;
  const suspendedGuides = guides.filter(g => g.isSuspended).length;

  if (loading) {
    return (
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>جاري التحميل...</h2>
      </main>
    );
  }

  return (
    <main style={{ display: 'grid', gap: 20 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900 }}>إدارة المرشدين</h1>
        <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>
          {guides.length} مرشد مسجل • {activeGuides} نشط • {suspendedGuides} معلق
        </p>
      </div>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>إجمالي المرشدين</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6' }}>{guides.length}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>المرشدين النشطين</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#22c55e' }}>{activeGuides}</div>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>المرشدين المعلقين</div>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#ef4444' }}>{suspendedGuides}</div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 900 }}>
            ✏️ تعديل بيانات المرشد
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="الاسم الكامل *">
              <input className="input" placeholder="مثال: محمد المرشد"
                value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </Field>

            <Field label="البريد الإلكتروني *">
              <input className="input" type="email" placeholder="guide@example.com"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>

            <Field label="رقم الجوال">
              <input className="input" placeholder="+966 50 000 0000"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>

            <Field label="رابط الصورة الشخصية">
              <input className="input" type="url" placeholder="https://example.com/image.jpg"
                value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                style={{ direction: 'ltr' }} />
            </Field>

            <Field label="التقييم (0-5)">
              <input className="input" type="number" min="0" max="5" step="0.1"
                value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
            </Field>

            <Field label="السعر بالساعة (SAR)">
              <input className="input" type="number" min="0"
                value={form.pricePerHour} onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} />
            </Field>

            <Field label="سنوات الخبرة">
              <input className="input" type="number" min="0"
                value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
            </Field>

            <Field label="التخصصات (فصل بفاصلة)">
              <input className="input" placeholder="مثال: تراث, طبيعة, مغامرة"
                value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
            </Field>

            <Field label="اللغات (فصل بفاصلة)">
              <input className="input" placeholder="مثال: العربية, الإنجليزية"
                value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
            </Field>
          </div>

          <div style={{ marginTop: 16 }}>
            <Field label="النبذة التعريفية">
              <textarea className="input" rows={3} placeholder="وصف عن المرشد وخبراته..."
                value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                style={{ resize: 'vertical' }} />
            </Field>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button className="btnPrimary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
            <button className="btn" onClick={handleCancel}>إلغاء</button>
          </div>
        </div>
      )}

      {guides.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
          <h3>لا يوجد مرشدين بعد</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {guides.map((guide) => {
            const profile = guide.guideProfile;
            const specialties = profile?.specialties ? JSON.parse(profile.specialties) : [];
            const languages = profile?.languages ? JSON.parse(profile.languages) : [];

            return (
              <div key={guide.id} className="card" style={{ 
                padding: 16, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                gap: 16, 
                flexWrap: 'wrap',
                opacity: guide.isSuspended ? 0.5 : 1,
                border: guide.isSuspended ? '2px solid #ef4444' : '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', flex: 1 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%', overflow: 'hidden',
                    background: 'linear-gradient(135deg, #006C35, #008844)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, fontWeight: 900, flexShrink: 0,
                  }}>
                    {guide.avatar ? (
                      <img src={guide.avatar} alt={guide.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{guide.fullName.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>{guide.fullName}</h3>
                      {guide.isSuspended && (
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: '#ef444420', color: '#ef4444' }}>
                          معلق
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
                      📧 {guide.email} {guide.phone && `• 📱 ${guide.phone}`}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 6 }}>
                      💰 {profile?.pricePerHour || 0} SAR/ساعة •
                      ⭐ {profile?.rating || 0} •
                      🏆 {profile?.experienceYears || 0} سنوات خبرة
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {specialties.slice(0, 3).map((s: string, i: number) => (
                        <span key={i} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(0,108,53,0.12)', color: 'var(--saudi-green)' }}>
                          {s}
                        </span>
                      ))}
                      {languages.slice(0, 2).map((l: string, i: number) => (
                        <span key={i} style={{ padding: '2px 8px', borderRadius: 6, fontSize: 11, background: 'rgba(255,255,255,0.08)', color: 'var(--muted)' }}>
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggleSuspend(guide.id, guide.isSuspended, guide.fullName)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 10,
                      border: guide.isSuspended ? '1px solid #22c55e' : '1px solid #eab308',
                      background: guide.isSuspended ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                      color: guide.isSuspended ? '#22c55e' : '#eab308',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {guide.isSuspended ? '✅ إلغاء التعليق' : '⏸️ تعليق'}
                  </button>
                  <button className="btn" onClick={() => handleEdit(guide)} style={{ fontSize: 13 }}>
                    ✏️ تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(guide.id, guide.fullName)}
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
            );
          })}
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