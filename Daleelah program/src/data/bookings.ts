import type { Booking } from "@/types/booking";

export const mockBookings: Booking[] = [
  {
    id: "b1",
    touristId: "t1",
    guideId: "g1",
    destinationId: "d1",
    startDate: "2026-03-15",
    endDate: "2026-03-17",
    status: "confirmed",
    totalPrice: 1200,
    notes: "Family trip with 2 kids",
    createdAt: "2026-02-10T10:00:00Z",
  },
  {
    id: "b2",
    touristId: "t1",
    guideId: "g2",
    destinationId: "d2",
    startDate: "2026-04-01",
    endDate: "2026-04-03",
    status: "pending",
    totalPrice: 1800,
    createdAt: "2026-02-12T14:30:00Z",
  },
  {
    id: "b3",
    touristId: "t2",
    guideId: "g3",
    startDate: "2026-02-20",
    endDate: "2026-02-21",
    status: "completed",
    totalPrice: 650,
    notes: "Evening tour at the corniche",
    createdAt: "2026-02-01T09:15:00Z",
  },
];
