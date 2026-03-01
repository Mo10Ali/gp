"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRole = searchParams.get('role');

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleLabels: Record<string, string> = {
    TOURIST: 'سائح',
    GUIDE: 'مرشد سياحي',
    COMPANY: 'شركة سياحية',
    MINISTRY: 'وزارة السياحة',
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.user) {
      // حفظ في localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // حفظ في cookie
      document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days

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
      setError(data.error || 'فشل تسجيل الدخول');
    }
  } catch (err) {
    setError('حدث خطأ في الاتصال');
  } finally {
    setLoading(false);
  }
};

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="card" style={{ maxWidth: 440, width: '100%', padding: 40 }}>
        <Link href="/auth/select-role" style={{ display: 'inline-block', marginBottom: 20, color: 'var(--muted)', fontSize: 14 }}>
          ← تغيير نوع الحساب
        </Link>

        {selectedRole && (
          <div style={{ 
            padding: 12, 
            background: 'rgba(0, 108, 53, 0.1)', 
            borderRadius: 8, 
            marginBottom: 20,
            textAlign: 'center',
            border: '1px solid rgba(0, 108, 53, 0.2)',
          }}>
            تسجيل دخول كـ <strong>{roleLabels[selectedRole]}</strong>
          </div>
        )}

        <h1 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 900, textAlign: 'center' }}>تسجيل الدخول</h1>
        <p style={{ margin: '0 0 30px', color: 'var(--muted)', textAlign: 'center' }}>ادخل إلى حسابك</p>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 16 }}>
          {error && (
            <div style={{ padding: 12, background: '#ef444420', borderRadius: 8, color: '#ef4444', fontSize: 14 }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>البريد الإلكتروني</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@daleelah.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: 14, fontWeight: 600 }}>كلمة المرور</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btnPrimary"
            disabled={loading}
            style={{ marginTop: 10, padding: '14px 20px' }}
          >
            {loading ? 'جاري الدخول...' : 'دخول'}
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14 }}>
          ليس لديك حساب؟{' '}
          <Link href={`/auth/register${selectedRole ? `?role=${selectedRole}` : ''}`} style={{ color: 'var(--saudi-green)', fontWeight: 700 }}>
            سجل الآن
          </Link>
        </div>

        <div style={{ marginTop: 30, padding: 16, background: 'rgba(0,108,53,0.05)', borderRadius: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>حسابات تجريبية:</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.8 }}>
            السائح: tourist@daleelah.com<br/>
            المرشد: guide@daleelah.com<br/>
            الشركة: company@daleelah.com<br/>
            الوزارة: ministry@daleelah.com<br/>
            <br/>
            الباسورد للجميع: <strong>123456</strong>
          </div>
        </div>
      </div>
    </main>
  );
}