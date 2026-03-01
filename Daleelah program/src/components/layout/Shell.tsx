import Header from "./Header";
import Footer from "./Footer";

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#0b0b0b" }}>
      <Header />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 16px", color: "white" }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
