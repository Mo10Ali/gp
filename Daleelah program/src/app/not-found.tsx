import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 24, color: "white" }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>الصفحة غير موجودة</h1>
      <p style={{ opacity: 0.8, lineHeight: 1.8 }}>
        ممكن الرابط غلط أو الصفحة انحذفت.
      </p>
      <Link href="/" style={{ color: "white", textDecoration: "underline" }}>
        رجوع للرئيسية
      </Link>
    </main>
  );
}
