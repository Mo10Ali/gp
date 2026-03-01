import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const guideId = searchParams.get('guideId');

    const tours = await prisma.tour.findMany({
      where: guideId ? { guideId } : {},
      include: {
        guide: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: { date: 'asc' },
    });

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'فشل في جلب الجولات' },
      { status: 500 }
    );
  }
}