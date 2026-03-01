export type DestinationCategory =
  | "Heritage"
  | "Nature"
  | "Adventure"
  | "City"
  | "Beach"
  | "Culture";

export type Destination = {
  id: string;
  slug: string;
  title: string;     // اسم الوجهة (EN أو AR حسب ما تفضّل)
  city: string;
  region: string;
  category: DestinationCategory;
  summary: string;
  description: string;
  images: string[];
  tags: string[];
  rating: number;    // 0..5
};
