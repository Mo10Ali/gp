export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.10)", marginTop: 40 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "18px 16px", color: "white", opacity: 0.7, fontSize: 14 }}>
        © {new Date().getFullYear()} Daleelah — Frontend first.
      </div>
    </footer>
  );
}
