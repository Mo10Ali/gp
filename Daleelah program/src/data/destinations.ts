import type { Destination } from "@/types/destination";

export const destinations: Destination[] = [
  {
    id: "d1",
    slug: "diriyah-bujairi-terrace",
    title: "Diriyah — Bujairi Terrace",
    city: "Riyadh",
    region: "Riyadh Region",
    category: "Heritage",
    summary: "Historic vibes + modern dining in Diriyah.",
    description:
      "Explore Diriyah’s heritage area and enjoy a curated dining experience. Great for evening walks and photos.",
    images: [
      "/images/diriyah_1.webp",
     
    ],
    tags: ["Family", "Food", "History"],
    rating: 4.7,
  },
  {
    id: "d2",
    slug: "alula-hegra",
    title: "AlUla — Hegra (Madain Saleh)",
    city: "AlUla",
    region: "Madinah Region",
    category: "Heritage",
    summary: "Ancient tombs and breathtaking desert landscapes.",
    description:
      "Hegra is UNESCO listed with incredible Nabataean heritage. Best visited with guided tours.",
    images: [
     "/images/alula_2.jpeg",
    ],
    tags: ["UNESCO", "Tours", "Photography"],
    rating: 4.9,
  },
  {
    id: "d3",
    slug: "abha-soudah-park",
    title: "Abha — Al Soudah Park",
    city: "Abha",
    region: "Asir Region",
    category: "Nature",
    summary: "Cool weather, mountains, and foggy views.",
    description:
      "Perfect for nature lovers. Enjoy viewpoints, light hiking, and local cafés.",
    images: [
     "/images/abha.jpg"
    ],
    tags: ["Hiking", "Nature", "Chill"],
    rating: 4.6,
  },
  {
    id: "d4",
    slug: "jeddah-corniche",
    title: "Jeddah — Corniche",
    city: "Jeddah",
    region: "Makkah Region",
    category: "Beach",
    summary: "Sea breeze, sunsets, and long walks.",
    description:
      "A classic waterfront experience with cafés, parks, and family areas.",
    images: [
      "/images/jeedh.avif"
    ],
    tags: ["Sea", "Family", "Sunset"],
    rating: 4.4,
  },
  {
    id: "d5",
    slug: "riyadh-boulevard-city",
    title: "Riyadh — Boulevard City",
    city: "Riyadh",
    region: "Riyadh Region",
    category: "City",
    summary: "Entertainment, food, events, and nightlife.",
    description:
      "A vibrant spot for events and experiences. Great for groups.",
    images: [
      "/images/boly.jpg",
    ],
    tags: ["Events", "Food", "Fun"],
    rating: 4.5,
  },
  {
    id: "d6",
    slug: "neom-city",
    title: "neom — Red Sea coast",
    city: "Neom",
    region: "Tabuk Region",
    category: "City",
    summary: "Entertainment, food, events, and nightlife.",
    description:
      "dramatic desert-and-mountain landscapes, and a bold futuristic vision.",
    images: [
      "/images/neom.jpg",
    ],
    tags: ["Events", "Food", "Fun"],
    rating: 4.5,
  },
];
