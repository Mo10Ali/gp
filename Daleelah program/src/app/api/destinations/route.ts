import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json({ error: 'فشل في جلب الوجهات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating destination:', body);

    if (!body.title || !body.slug || !body.city) {
      return NextResponse.json(
        { error: 'الحقول المطلوبة: العنوان، Slug، المدينة' },
        { status: 400 }
      );
    }

    const destination = await prisma.destination.create({
      data: {
        slug: body.slug,
        title: body.title,
        city: body.city,
        region: body.region || '',
        category: body.category || 'Heritage',
        summary: body.summary || '',
        description: body.description || '',
        images: JSON.stringify(body.images || []),
        tags: JSON.stringify(body.tags || []),
        rating: parseFloat(body.rating) || 0,
        status: body.status || Status.APPROVED,
      },
    });

    console.log('Destination created:', destination.id);
    return NextResponse.json(destination, { status: 201 });
  } catch (error) {
    console.error('Error creating destination:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء الوجهة: ' + (error as Error).message },
      { status: 500 }
    );
  }
}