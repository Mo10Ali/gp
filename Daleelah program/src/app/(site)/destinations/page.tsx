"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationsFilter from "@/components/destinations/DestinationsFilter";

type Destination = {
  id: string;
  slug: string;
  title: string;
  city: string;
  region: string;
  category: string;
  summary: string;
  images: string;
  tags: string;
  rating: number;
};

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    city: "all",
    category: "all",
    sortBy: "rating",
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/destinations');
      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDestinations = destinations.filter((dest) => {
    const matchSearch = dest.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                        dest.summary.toLowerCase().includes(filters.search.toLowerCase());
    const matchCity = filters.city === "all" || dest.city === filters.city;
    const matchCategory = filters.category === "all" || dest.category === filters.category;

    return matchSearch && matchCity && matchCategory;
  });

  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (filters.sortBy === "rating") return b.rating - a.rating;
    if (filters.sortBy === "name") return a.title.localeCompare(b.title);
    return 0;
  });

  if (loading) {
    return (
      <main style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>جاري التحميل...</h3>
        </div>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 42, fontWeight: 900 }}>الوجهات السياحية</h1>
        <p style={{ marginTop: 12, color: "var(--muted)", fontSize: 18 }}>
          استكشف الوجهات — فلترة + بحث (Front-end فقط حالياً).
        </p>
      </header>

      <DestinationsFilter filters={filters} setFilters={setFilters} />

      <div style={{ marginBottom: 20, color: "var(--muted)" }}>
        النتائج: {sortedDestinations.length} وجهة
      </div>

      {sortedDestinations.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>لا توجد نتائج</h3>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {sortedDestinations.map((dest) => {
            // Parse JSON strings
            const images = JSON.parse(dest.images);
            const tags = JSON.parse(dest.tags);

            return (
              <DestinationCard
                key={dest.id}
                id={dest.id}
                slug={dest.slug}
                title={dest.title}
                city={dest.city}
                region={dest.region}
                category={dest.category}
                summary={dest.summary}
                images={images}
                tags={tags}
                rating={dest.rating}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}