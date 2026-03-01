"use client";

import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main style={{ display: "grid", gap: 14 }}>
      <h1 style={{ margin: 0, fontSize: 34 }}>Contact</h1>

      <section
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: 16,
          color: "white",
          display: "grid",
          gap: 10,
        }}
      >
        {sent ? (
          <div style={{ opacity: 0.9 }}>
            ✅ تم إرسال الرسالة (Mock). لاحقاً نربطها بقاعدة البيانات/الإيميل.
          </div>
        ) : (
          <>
            <input placeholder="Name" style={input()} />
            <input placeholder="Email" style={input()} />
            <textarea placeholder="Message" rows={5} style={input()} />

            <button
              onClick={() => setSent(true)}
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.12)",
                color: "white",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Send
            </button>
          </>
        )}
      </section>
    </main>
  );
}

function input(): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
  };
}
