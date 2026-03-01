export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export type Booking = {
  id: string;
  touristId: string;
  guideId?: string;
  destinationId?: string;
  companyId?: string;
  startDate: string;
  endDate: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
};
