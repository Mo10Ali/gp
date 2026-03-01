export type Offer = {
  id: string;
  companyId: string;
  title: string;
  description: string;
  destinationIds: string[];
  guideIds?: string[];
  originalPrice: number;
  discountedPrice: number;
  validFrom: string;
  validUntil: string;
  images?: string[];
  tags?: string[];
  active: boolean;
  createdAt: string;
};
