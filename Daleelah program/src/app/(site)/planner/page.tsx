"use client";

import { useMemo, useState } from "react";
import { destinations } from "@/data/destinations";

type Interests = {
  Heritage: boolean;
  Nature: boolean;
  Adventure: boolean;
  City: boolean;
  Beach: boolean;
  Culture: boolean;
};

type DayPlan = {
  day: number;
  items: { title: string; city: string; category: string; summary: string }[];
};

export default function PlannerPage() {
  const cities = useMemo(() => Array.from(new Set(destinations.map((d) => d.city))).sort(), []);

  const [city, setCity] = useState<string>("");
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState<number>(2500);

  const [interests, setInterests] = useState<Interests>({
    Heritage: true,
    Nature: true,
    Adventure: false,
    City: true,
    Beach: false,
    Culture: false,
  });

  const selectedCategories = useMemo(() => {
    return Object.entries(interests)
      .filter(([, v]) => v)
      .map(([k]) => k);
  }, [interests]);

  const pool = useMemo(() => {
    const byCity = city ? destinations.filter((d) => d.city === city) : destinations;
    const byCat =
      selectedCategories.length > 0
        ? byCity.filter((d) => selectedCategories.includes(d.category))
        : byCity;

    // ترتيب أعلى تقييم أولاً
    return [...byCat].sort((a, b) => b.rating - a.rating);
  }, [city, selectedCategories]);

  const plan: DayPlan[] = useMemo(() => {
    const maxDays = Math.max(1, Math.min(7, days));
    const itemsPerDay = 2;

    const needed = maxDays * itemsPerDay;
    const picked = pool.slice(0, needed);

    const out: DayPlan[] = [];
    for (let i = 0; i < maxDays; i++) {
      const chunk = picked.slice(i * itemsPerDay, i * itemsPerDay + itemsPerDay);
      out.push({
        day: i + 1,
        items: chunk.map((x) => ({
          title: x.title,
          city: x.city,
          category: x.category,
          summary: x.summary,
        })),
      });
    }
    return out;
  }, [pool, days]);

  return (
    <main style={{ display: "grid", gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 34 }}>Trip Planner</h1>
        <p style={{ marginTop: 8, opacity: 0.75, lineHeight: 1.8 }}>
          هذا Planner مؤقت (Frontend). لاحقًا نربطه بالـAI والـDB.
        </p>
      </div>

      <section
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 16,
          padding: 14,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 6 }}>City</div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                outline: "none",
              }}
            >
              <option value="">Any</option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 6 }}>Days (1–7)</div>
            <input
              type="number"
              min={1}
              max={7}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          <div>
            <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 6 }}>Budget (SAR)</div>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(0,0,0,0.25)",
                color: "white",
                outline: "none",
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {Object.keys(interests).map((k) => {
            const key = k as keyof Interests;
            const active = interests[key];
            return (
              <button
                key={k}
                onClick={() => setInterests((p) => ({ ...p, [key]: !p[key] }))}
                style={{
                  padding: "8px 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.14)",
                  background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                  color: "white",
                  cursor: "pointer",
                  opacity: active ? 1 : 0.75,
                }}
              >
                {k}
              </button>
            );
          })}
        </div>

        <div style={{ opacity: 0.7, fontSize: 13 }}>
          Note: Budget حاليا فقط للعرض (نفعّله لاحقًا مع عروض/حجوزات).
        </div>
      </section>

      <section style={{ display: "grid", gap: 12 }}>
        <h2 style={{ margin: 0, fontSize: 20 }}>Suggested itinerary</h2>

        {plan.map((d) => (
          <div
            key={d.day}
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.04)",
              borderRadius: 16,
              padding: 14,
              display: "grid",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ fontWeight: 700 }}>Day {d.day}</div>
              <div style={{ opacity: 0.7, fontSize: 13 }}>
                {city ? city : "Mixed cities"} • Budget: {budget} SAR
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {d.items.length === 0 ? (
                <div style={{ opacity: 0.75 }}>No matching destinations. Try enabling more interests or choose Any city.</div>
              ) : (
                d.items.map((x, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.10)",
                      background: "rgba(0,0,0,0.22)",
                      padding: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ fontWeight: 700 }}>{x.title}</div>
                      <div style={{ opacity: 0.7, fontSize: 13 }}>{x.city} • {x.category}</div>
                    </div>
                    <div style={{ marginTop: 6, opacity: 0.8, lineHeight: 1.7 }}>{x.summary}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
