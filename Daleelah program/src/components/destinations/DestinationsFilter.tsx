"use client";

import { useMemo } from "react";

type DestinationsFilterProps = {
  filters: {
    search: string;
    city: string;
    category: string;
    sortBy: string;
  };
  setFilters: (filters: any) => void;
};

export default function DestinationsFilter({ filters, setFilters }: DestinationsFilterProps) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 16 }}>
        <input
          className="input"
          type="text"
          placeholder="ابحث عن وجهة..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          className="input"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
        >
          <option value="all">جميع المدن</option>
          <option value="AlUla">العلا</option>
          <option value="Riyadh">الرياض</option>
          <option value="Jeddah">جدة</option>
          <option value="Abha">أبها</option>
        </select>

        <select
          className="input"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">جميع الفئات</option>
          <option value="Heritage">تراث</option>
          <option value="Nature">طبيعة</option>
          <option value="City">مدينة</option>
          <option value="Adventure">مغامرة</option>
        </select>

        <select
          className="input"
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="rating">الأعلى تقييماً</option>
          <option value="name">الاسم</option>
        </select>
      </div>
    </div>
  );
}