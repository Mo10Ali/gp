"use client";

import { useMemo, useState } from "react";
import type { Guide } from "@/types/guide";
import GuideCard from "./GuideCard";

type Props = { guides: Guide[] };

export default function GuidesFilter({ guides }: Props) {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("All");
  const [lang, setLang] = useState("All");
  const [sort, setSort] = useState<"top" | "az" | "price">("top");

  const cities = useMemo(() => ["All", ...unique(guides.map((g) => g.city))], [guides]);
  const langs = useMemo(() => ["All", ...unique(guides.flatMap((g) => g.languages))], [guides]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();

    let list = guides.filter((g) => {
      const matchQ =
        !needle ||
        g.fullName.toLowerCase().includes(needle) ||
        g.city.toLowerCase().includes(needle) ||
        g.region.toLowerCase().includes(needle) ||
        g.bio.toLowerCase().includes(needle) ||
        (g.specialties ?? []).some((s) => s.toLowerCase().includes(needle)) ||
        (g.languages ?? []).some((l) => l.toLowerCase().includes(needle));

      const matchCity = city === "All" || g.city === city;
      const matchLang = lang === "All" || (g.languages ?? []).includes(lang);

      return matchQ && matchCity && matchLang;
    });

    list = [...list].sort((a, b) => {
      if (sort === "top") return b.rating - a.rating;
      if (sort === "price") return (a.pricePerHour ?? 999999) - (b.pricePerHour ?? 999999);
      return a.fullName.localeCompare(b.fullName);
    });

    return list;
  }, [guides, q, city, lang, sort]);

  return (
    <section style={{ display: "grid", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gap: 10,
          gridTemplateColumns: "1.3fr 0.7fr 0.7fr 0.6fr",
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search (name, city, specialties)…"
          style={inputStyle()}
        />

        <select value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle()}>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={lang} onChange={(e) => setLang(e.target.value)} style={inputStyle()}>
          {langs.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value as any)} style={inputStyle()}>
          <option value="top">Top</option>
          <option value="az">A → Z</option>
          <option value="price">Price</option>
        </select>
      </div>

      <div style={{ opacity: 0.8 }}>
        Showing <b>{filtered.length}</b> guides
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
      >
        {filtered.map((item) => (
          <GuideCard key={item.id} item={item} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 16,
            padding: 18,
            opacity: 0.85,
            lineHeight: 1.9,
          }}
        >
          ما فيه نتائج—جرّب تغيّر البحث أو الفلاتر.
        </div>
      ) : null}
    </section>
  );
}

function unique(arr: string[]) {
  return Array.from(new Set(arr)).sort((a, b) => a.localeCompare(b));
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    outline: "none",
  };
}
