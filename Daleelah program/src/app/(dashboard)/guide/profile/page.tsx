"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type GuideProfile = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  guideProfile?: {
    bio: string;
    specialties: string;
    languages: string;
    pricePerHour: number;
    experienceYears: number;
    rating: number;
  };
};

export default function GuideProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<GuideProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatar: '',
    bio: '',
    specialties: '',
    languages: '',
    pricePerHour: '100',
    experienceYears: '0',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchProfile(userData.id);
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/guides');
      if (res.ok) {
        const guides = await res.json();
        const myProfile = guides.find((g: GuideProfile) => g.id === userId);
        
        if (myProfile) {
          setProfile(myProfile);
          const gp = myProfile.guideProfile;
          const specialties = gp?.specialties ? JSON.parse(gp.specialties) : [];
          const languages = gp?.languages ? JSON.parse(gp.languages) : [];
          
          setForm({
            fullName: myProfile.fullName,
            email: myProfile.email,
            phone: myProfile.phone || '',
            avatar: myProfile.avatar || '',
            bio: gp?.bio || '',
            specialties: specialties.join(', '),
            languages: languages.join(', '),
            pricePerHour: gp?.pricePerHour?.toString() || '100',
            experienceYears: gp?.experienceYears?.toString() || '0',
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
const handleSubmit = async () => {
  if (!user) return;
  
  setSaving(true);
  try {
    // تحديد طول الـ avatar (أقصى 200 حرف)
    let avatarUrl = form.avatar.trim();
    if (avatarUrl.length > 200) {
      alert('⚠️ رابط الصورة طويل جداً. يرجى استخدام رابط أقصر.');
      setSaving(false);
      return;
    }

    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      avatar: avatarUrl || null,
      bio: form.bio,
      specialties: form.specialties.split(',').map(s => s.trim()).filter(Boolean),
      languages: form.languages.split(',').map(l => l.trim()).filter(Boolean),
      pricePerHour: parseInt(form.pricePerHour) || 100,
      experienceYears: parseInt(form.experienceYears) || 0,
    };

    const res = await fetch(`/api/guides/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      alert('✅ تم التحديث بنجاح!');
      // تحديث localStorage
      const updatedUser = { ...user, ...payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      fetchProfile(user.id);
    } else {
      const err = await res.json();
      alert('خطأ: ' + err.error);
    }
  } catch (error) {
    console.error('Save error:', error);
    alert('حدث خطأ في الحفظ');
  } finally {
    setSaving(false);
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
    <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 34, fontWeight: 900 }}>الملف الشخصي 👤</h1>
      <p style={{ margin: '0 0 32px', color: 'var(--muted)' }}>تعديل بياناتك كمرشد سياحي</p>

      <div className="card" style={{ padding: 32 }}>
        {/* Avatar Preview */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #006C35, #008844)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 900,
            marginBottom: 16,
          }}>
            {form.avatar ? (
              <img src={form.avatar} alt={form.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span>{form.fullName.charAt(0)}</span>
            )}
          </div>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{form.fullName}</h2>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>⭐ {profile?.guideProfile?.rating || 0} • 🏆 {form.experienceYears} سنوات خبرة</p>
        </div>

        <div style={{ display: 'grid', gap: 20 }}>
          <Field label="الاسم الكامل">
            <input className="input" value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </Field>

          <Field label="البريد الإلكتروني">
            <input className="input" type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="رقم الجوال">
              <input className="input" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>

            <Field label="السعر بالساعة (SAR)">
              <input className="input" type="number" min="0" value={form.pricePerHour}
                onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })} />
            </Field>
          </div>

          <Field label="رابط الصورة الشخصية">
            <input className="input" type="url" placeholder="https://example.com/image.jpg"
              value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              style={{ direction: 'ltr' }} />
          </Field>

          <Field label="سنوات الخبرة">
            <input className="input" type="number" min="0" value={form.experienceYears}
              onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} />
          </Field>

          <Field label="التخصصات (فصل بفاصلة)">
            <input className="input" placeholder="مثال: تراث, طبيعة, مغامرة"
              value={form.specialties} onChange={(e) => setForm({ ...form, specialties: e.target.value })} />
          </Field>

          <Field label="اللغات (فصل بفاصلة)">
            <input className="input" placeholder="مثال: العربية, الإنجليزية"
              value={form.languages} onChange={(e) => setForm({ ...form, languages: e.target.value })} />
          </Field>

          <Field label="النبذة التعريفية">
            <textarea className="input" rows={4} placeholder="اكتب نبذة عنك وعن خبراتك..."
              value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
              style={{ resize: 'vertical' }} />
          </Field>
        </div>

        <button className="btnPrimary" onClick={handleSubmit} disabled={saving}
          style={{ marginTop: 24, width: '100%', padding: 16, fontSize: 16 }}>
          {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
        </button>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}