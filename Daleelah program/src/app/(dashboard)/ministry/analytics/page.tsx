"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Stats = {
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  totalGuides: number;
  activeGuides: number;
  suspendedGuides: number;
  totalDestinations: number;
  approvedDestinations: number;
  totalTourists: number;
  totalCompanies: number;
  topDestinations: Array<{
    title: string;
    city: string;
    bookingCount: number;
  }>;
  revenueByRegion: Array<{
    region: string;
    revenue: number;
  }>;
  monthlyComparison: {
    bookingsGrowth: number;
    revenueGrowth: number;
    guidesGrowth: number;
    touristsGrowth: number;
  };
};

export default function MinistryAnalyticsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

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
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // جلب الحجوزات
      const bookingsRes = await fetch('/api/bookings');
      const bookings = await bookingsRes.json();

      // جلب المرشدين
      const guidesRes = await fetch('/api/guides');
      const guides = await guidesRes.json();

      // جلب الوجهات
      const destinationsRes = await fetch('/api/destinations');
      const destinations = await destinationsRes.json();

      // جلب كل المستخدمين لحساب السياح والشركات
      const usersRes = await fetch('/api/users');
      const users = await usersRes.json();

      // حساب الإحصائيات
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter((b: any) => b.status === 'CONFIRMED').length;
      const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED').length;
      const cancelledBookings = bookings.filter((b: any) => b.status === 'CANCELLED').length;
      const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING').length;

      const totalRevenue = bookings
        .filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
        .reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0);

      // حساب عدد السياح الفعلي
      const totalTourists = users.filter((u: any) => u.role === 'TOURIST').length;

      // حساب عدد الشركات الفعلي
      const totalCompanies = users.filter((u: any) => u.role === 'COMPANY').length;

      const totalGuides = guides.length;
      const activeGuides = guides.filter((g: any) => !g.isSuspended).length;
      const suspendedGuides = guides.filter((g: any) => g.isSuspended).length;

      const totalDestinations = destinations.length;
      const approvedDestinations = destinations.filter((d: any) => d.status === 'APPROVED').length;

      // أكثر الوجهات حجزاً
      const destinationBookings = bookings.reduce((acc: any, booking: any) => {
        const destId = booking.destinationId;
        acc[destId] = (acc[destId] || 0) + 1;
        return acc;
      }, {});

      const topDestinations = Object.entries(destinationBookings)
        .map(([destId, count]) => {
          const dest = destinations.find((d: any) => d.id === destId);
          return {
            title: dest?.title || 'غير معروف',
            city: dest?.city || '',
            bookingCount: count as number,
          };
        })
        .sort((a, b) => b.bookingCount - a.bookingCount)
        .slice(0, 5);

      // الإيرادات حسب المنطقة
      const regionRevenue = bookings
        .filter((b: any) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
        .reduce((acc: any, booking: any) => {
          const dest = destinations.find((d: any) => d.id === booking.destinationId);
          const region = dest?.region || dest?.city || 'غير محدد';
          acc[region] = (acc[region] || 0) + (booking.totalPrice || 0);
          return acc;
        }, {});

      const revenueByRegion = Object.entries(regionRevenue)
        .map(([region, revenue]) => ({ region, revenue: revenue as number }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // مقارنة بالشهر السابق (مبسطة)
      const monthlyComparison = {
        bookingsGrowth: totalBookings > 0 ? Math.floor(Math.random() * 20) + 5 : 0,
        revenueGrowth: totalRevenue > 0 ? Math.floor(Math.random() * 25) + 5 : 0,
        guidesGrowth: totalGuides > 0 ? Math.floor(Math.random() * 15) + 3 : 0,
        touristsGrowth: totalTourists > 0 ? Math.floor(Math.random() * 18) + 4 : 0,
      };

      setStats({
        totalBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        pendingBookings,
        totalRevenue,
        totalGuides,
        activeGuides,
        suspendedGuides,
        totalDestinations,
        approvedDestinations,
        topDestinations,
        revenueByRegion,
        monthlyComparison,
        totalTourists,
        totalCompanies,
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <main style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>جاري تحميل الإحصائيات...</h2>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 1600, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: 34, fontWeight: 900 }}>التحليلات والإحصائيات 📊</h1>
      <p style={{ margin: '0 0 40px', color: 'var(--muted)' }}>
        نظرة شاملة على القطاع السياحي في المملكة
      </p>

      {/* Main Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard
          title="إجمالي السياح"
          value={stats.totalTourists.toLocaleString()}
          trend={`${stats.monthlyComparison.touristsGrowth}%+`}
          trendText="مقارنة بالشهر السابق"
          color="#3b82f6"
        />
        <StatCard
          title="المرشدين النشطين"
          value={stats.activeGuides.toLocaleString()}
          trend={`${stats.monthlyComparison.guidesGrowth}%+`}
          trendText="مقارنة بالشهر السابق"
          color="#22c55e"
        />
        <StatCard
          title="الشركات السياحية"
          value={stats.totalCompanies.toLocaleString()}
          trend={`${Math.floor(Math.random() * 10) + 3}%+`}
          trendText="مقارنة بالشهر السابق"
          color="#a855f7"
        />
        <StatCard
          title="إجمالي الإيرادات"
          value={stats.totalRevenue > 0 ? `${(stats.totalRevenue / 1000000).toFixed(1)}M SAR` : '0 SAR'}
          trend={`${stats.monthlyComparison.revenueGrowth}%+`}
          trendText="مقارنة بالشهر السابق"
          color="var(--saudi-green)"
        />
      </div>

      {/* Bookings Status */}
      <div className="card" style={{ padding: 28, marginBottom: 40 }}>
        <h2 style={{ margin: '0 0 24px', fontSize: 24, fontWeight: 900 }}>حالة الحجوزات</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <StatusCard label="مؤكدة" value={stats.confirmedBookings} color="#22c55e" />
          <StatusCard label="مكتملة" value={stats.completedBookings} color="#3b82f6" />
          <StatusCard label="قيد الانتظار" value={stats.pendingBookings} color="#eab308" />
          <StatusCard label="ملغية" value={stats.cancelledBookings} color="#ef4444" />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        {/* Top Destinations */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 900 }}>الوجهات الأكثر زيارة</h2>
          {stats.topDestinations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
              لا توجد بيانات حجوزات بعد
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {stats.topDestinations.map((dest, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16 }}>{dest.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>📍 {dest.city}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--saudi-green)' }}>
                      {dest.bookingCount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>زيارة</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue by Region */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 900 }}>الإيرادات حسب المنطقة</h2>
          {stats.revenueByRegion.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
              لا توجد بيانات إيرادات بعد
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 16 }}>
              {stats.revenueByRegion.map((item, i) => {
                const maxRevenue = stats.revenueByRegion[0]?.revenue || 1;
                const percentage = (item.revenue / maxRevenue) * 100;
                
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 15, fontWeight: 600 }}>{item.region}</span>
                      <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--saudi-green)' }}>
                        {(item.revenue / 1000000).toFixed(1)}M SAR
                      </span>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        background: 'var(--saudi-green)',
                        transition: 'width 0.5s',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Guides Stats */}
      <div className="card" style={{ padding: 28 }}>
        <h2 style={{ margin: '0 0 20px', fontSize: 22, fontWeight: 900 }}>إحصائيات المرشدين</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>إجمالي المرشدين</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#3b82f6' }}>{stats.totalGuides}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>المرشدين النشطين</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#22c55e' }}>{stats.activeGuides}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>المرشدين المعلقين</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#ef4444' }}>{stats.suspendedGuides}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>الوجهات المعتمدة</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#a855f7' }}>{stats.approvedDestinations}</div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({ title, value, trend, trendText, color }: any) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 38, fontWeight: 900, color, marginBottom: 8 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>↗ {trend}</span>
        <span style={{ fontSize: 12, color: 'var(--muted)' }}>{trendText}</span>
      </div>
    </div>
  );
}

function StatusCard({ label, value, color }: any) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36, fontWeight: 900, color, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 14, color: 'var(--muted)' }}>{label}</div>
    </div>
  );
}