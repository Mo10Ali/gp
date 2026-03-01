export type Review = {
  id: string;
  touristId: string;
  targetType: 'guide' | 'destination' | 'company';
  targetId: string;
  rating: number; // 1-5
  comment: string;
  images?: string[];
  createdAt: string;
};
