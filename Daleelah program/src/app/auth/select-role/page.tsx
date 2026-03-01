"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const router = useRouter();

  const roles = [
    {
      value: 'TOURIST',
      label: 'سائح',
      icon: '🧳',
      description: 'استكشف الوجهات واحجز جولاتك',
      color: '#3b82f6',
    },
    {
      value: 'GUIDE',
      label: 'مرشد سياحي',
      icon: '🎯',
      description: 'قدم جولات سياحية واكسب',
      color: '#22c55e',
    },
    {
      value: 'COMPANY',
      label: 'شركة سياحية',
      icon: '🏢',
      description: 'أدر عروضك وقوائمك السياحية',
      color: '#a855f7',
    },
    {
      value: 'MINISTRY',
      label: 'وزارة السياحة',
      icon: '🏛️',
      description: 'إدارة وتنظيم القطاع السياحي',
      color: '#f59e0b',
    },
  ];

  const handleRoleSelect = (role: string) => {
    router.push(`/auth/login?role=${role}`);
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ maxWidth: 900, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src="/images/logo.png" alt="Daleelah" width={80} height={80} style={{ margin: '0 auto 20px' }} />
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 900 }}>مرحباً بك في دليله</h1>
          <p style={{ marginTop: 12, color: 'var(--muted)', fontSize: 18 }}>اختر نوع حسابك للمتابعة</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => handleRoleSelect(role.value)}
              className="card"
              style={{
                padding: 24,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = role.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>{role.icon}</div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, marginBottom: 8 }}>{role.label}</h3>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{role.description}</p>
            </button>
          ))}
        </div>

        <div style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
          <Link href="/home" style={{ color: 'var(--saudi-green)' }}>العودة للرئيسية</Link>
        </div>
      </div>
    </main>
  );
}