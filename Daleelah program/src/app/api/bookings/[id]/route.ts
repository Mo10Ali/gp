import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, BookingStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();

    const updateData: any = {};

    if (body.status) {
      updateData.status = body.status;
    }

    if (body.startDate) {
      updateData.startDate = new Date(body.startDate);
    }

    if (body.endDate) {
      updateData.endDate = new Date(body.endDate);
    }

    if (body.participants) {
      updateData.participants = parseInt(body.participants);
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'فشل في تحديث الحجز' }, { status: 500 });
  }
}
