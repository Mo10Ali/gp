"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCart } from '@/context/CartContext';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  const isDashboard = pathname?.startsWith('/tourist') || 
                      pathname?.startsWith('/guide') || 
                      pathname?.startsWith('/company') || 
                      pathname?.startsWith('/ministry') || 
                      pathname?.startsWith('/admin');

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        backdropFilter: "blur(12px)",
        background: "rgba(10, 10, 10, 0.8)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: "16px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Link
          href="/home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          <img
            src="/images/logo.png"
            alt="Daleelah"
            width={40}
            height={40}
            style={{ borderRadius: 8 }}
          />
          <span
            style={{
              fontSize: 24,
              fontWeight: 900,
              background: "linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            دليله
          </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {!isDashboard && (
            <>
              <Link href="/home" className="btn">
                الرئيسية
              </Link>
              <Link href="/destinations" className="btn">
                الوجهات
              </Link>
              <Link href="/guides" className="btn">
                المرشدين
              </Link>
              <Link href="/planner" className="btn">
                المخطط
              </Link>
            </>
          )}

          {user && (
            <div style={{ 
              fontSize: 14, 
              opacity: 0.8,
              padding: "8px 12px",
              background: "rgba(0, 108, 53, 0.1)",
              borderRadius: 8,
              border: "1px solid rgba(0, 108, 53, 0.2)",
            }}>
              مرحباً، <strong>{user.fullName}</strong>
            </div>
          )}

          {user && user.role === 'TOURIST' && (
            <Link 
              href="/cart" 
              className="btn"
              style={{ 
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              🛒 السلة
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 900,
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <>
              {!isDashboard && (
                <Link 
                  href={`/${user.role.toLowerCase()}`}
                  className="btnPrimary"
                >
                  لوحة التحكم
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn"
                style={{ 
                  cursor: "pointer",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#ef4444",
                }}
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link href="/auth/select-role" className="btnPrimary">
              تسجيل الدخول
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}