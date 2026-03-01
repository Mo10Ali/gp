"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!fullName || !email || !password) {
      setError('الرجاء تعبئة جميع الحقول المطلوبة');
      setLoading(false);
      return;
    }

    if (!role) {
      setError('الرجاء اختيار دور المستخدم');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
          role: role.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.user) {
        // حفظ في localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // حفظ في cookie
        document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

        alert('✅ تم التسجيل بنجاح!');

        // التوجيه حسب الدور
        switch (data.user.role) {
          case 'TOURIST':
            router.push('/tourist');
            break;
          case 'GUIDE':
            router.push('/guide');
            break;
          case 'COMPANY':
            router.push('/company');
            break;
          case 'MINISTRY':
            router.push('/ministry');
            break;
          case 'ADMIN':
            router.push('/admin');
            break;
          default:
            router.push('/home');
        }
      } else {
        setError(data.error || 'فشل التسجيل');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'tourist': return 'سائح';
      case 'guide': return 'مرشد سياحي';
      case 'company': return 'شركة سياحية';
      case 'ministry': return 'وزارة السياحة';
      default: return 'مستخدم';
    }
  };

  if (!role) {
    return (
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        <div className="card" style={{ maxWidth: 400, width: '100%', padding: 40, textAlign: 'center' }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, marginBottom: 16 }}>
            خطأ
          </h2>
          <p style={{ margin: '0 0 24px', color: 'var(--muted)' }}>
            الرجاء اختيار دور المستخدم أولاً
          </p>
          <Link href="/auth/select-role" className="btnPrimary" style={{ width: '100%', display: 'block', textAlign: 'center' }}>
            اختر الدور
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, rgba(0,108,53,0.05) 0%, rgba(0,0,0,0.8) 100%)',
    }}>
      <div className="card" style={{ maxWidth: 450, width: '100%', padding: 40 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 900, marginBottom: 8 }}>
            إنشاء حساب جديد
          </h1>
          <p style={{ margin: 0, color: 'var(--muted)', fontSize: 15 }}>
            التسجيل كـ <strong style={{ color: 'var(--saudi-green)' }}>{getRoleLabel()}</strong>
          </p>
        </div>

        {error && (
          <div style={{
            padding: 14,
            borderRadius: 10,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid #ef4444',
            color: '#ef4444',
            marginBottom: 20,
            fontSize: 14,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              الاسم الكامل <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              className="input"
              placeholder="مثال: أحمد محمد"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              البريد الإلكتروني <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="email"
              className="input"
              placeholder="example@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ direction: 'ltr' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              كلمة المرور <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              style={{ direction: 'ltr' }}
            />
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--muted)' }}>
              يجب أن تكون 6 أحرف على الأقل
            </p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              رقم الجوال
            </label>
            <input
              type="tel"
              className="input"
              placeholder="+966 50 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ direction: 'ltr' }}
            />
          </div>

          <button
            type="submit"
            className="btnPrimary"
            disabled={loading}
            style={{ width: '100%', padding: 16, fontSize: 16, marginTop: 8 }}
          >
            {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
          <span style={{ color: 'var(--muted)' }}>لديك حساب بالفعل؟</span>
          {' '}
          <Link href={`/auth/login?role=${role}`} style={{ color: 'var(--saudi-green)', fontWeight: 600, textDecoration: 'none' }}>
            تسجيل الدخول
          </Link>
        </div>

        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href="/auth/select-role" style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
            ← تغيير الدور
          </Link>
        </div>
      </div>
    </main>
  );
}