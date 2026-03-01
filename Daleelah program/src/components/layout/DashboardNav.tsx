"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
  if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    localStorage.removeItem('user');
    // حذف cookie
    document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/auth/login');
  }
};

  if (!user) return null;

  const getDashboardHome = () => {
    switch (user.role) {
      case 'TOURIST': return '/tourist';
      case 'GUIDE': return '/guide';
      case 'COMPANY': return '/company';
      case 'MINISTRY': return '/ministry';
      case 'ADMIN': return '/admin';
      default: return '/';
    }
  };

  const getRoleLabel = () => {
    switch (user.role) {
      case 'TOURIST': return 'سائح';
      case 'GUIDE': return 'مرشد';
      case 'COMPANY': return 'شركة';
      case 'MINISTRY': return 'وزارة';
      case 'ADMIN': return 'مدير';
      default: return '';
    }
  };

  return (
    <nav style={{
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
      }}>
        {/* Right */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link href="/home" style={{
            textDecoration: 'none',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.1)',
          }}>
            🏠 الرئيسية
          </Link>

          <Link href={getDashboardHome()} style={{
            textDecoration: 'none',
            color: pathname === getDashboardHome() ? 'var(--saudi-green)' : 'white',
            fontSize: 14,
            fontWeight: 600,
          }}>
            📊 لوحة التحكم
          </Link>
        </div>

        {/* Left */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{user.fullName}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{getRoleLabel()}</div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid #ef4444',
              background: 'rgba(239,68,68,0.1)',
              color: '#ef4444',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            تسجيل خروج
          </button>
        </div>
      </div>
    </nav>
  );
}