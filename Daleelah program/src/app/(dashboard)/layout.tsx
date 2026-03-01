import DashboardNav from "@/components/layout/DashboardNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNav />
      <div style={{ padding: '20px' }}>
        {children}
      </div>
    </>
  );
}