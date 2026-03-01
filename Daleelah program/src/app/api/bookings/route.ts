import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        destination: {
          select: {
            id: true,
            title: true,
            city: true,
            images: true,
          },
        },
        tourist: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
          },
        },
        guide: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            guideProfile: {
              select: {
                pricePerHour: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.touristId || !body.destinationId || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        touristId: body.touristId,
        guideId: body.guideId || null,
        destinationId: body.destinationId,
        startDate: startDate,
        endDate: endDate,
        status: BookingStatus.CONFIRMED,  // ← تغيير هنا
        totalPrice: parseInt(body.totalPrice) || 0,
        participants: parseInt(body.participants) || 1,
        notes: body.notes || null,
      },
      include: {
        destination: true,
        guide: {
          include: {
            guideProfile: true,
          },
        },
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}