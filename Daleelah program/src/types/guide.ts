export type Guide = {
  id: string;
  slug: string;
  fullName: string;
  city: string;
  region: string;
  bio: string;
  languages: string[];
  specialties: string[];
  rating: number;
  pricePerHour: number;
  avatar?: string;
  images?: string[];
};
