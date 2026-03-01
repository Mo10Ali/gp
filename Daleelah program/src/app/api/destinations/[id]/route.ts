import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    
    const destination = await prisma.destination.findUnique({
      where: { id: params.id },
    });
    
    if (!destination) {
      return NextResponse.json({ error: 'غير موجود' }, { status: 404 });
    }
    
    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    return NextResponse.json({ error: 'فشل' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();

    const destination = await prisma.destination.update({
      where: { id: params.id },
      data: {
        slug: body.slug,
        title: body.title,
        city: body.city,
        region: body.region,
        category: body.category,
        summary: body.summary,
        description: body.description,
        images: JSON.stringify(body.images || []),
        tags: JSON.stringify(body.tags || []),
        rating: parseFloat(body.rating) || 0,
        status: body.status || Status.APPROVED,
      },
    });

    return NextResponse.json(destination);
  } catch (error) {
    console.error('Error updating destination:', error);
    return NextResponse.json({ error: 'فشل في التعديل' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    console.log('Deleting destination:', params.id);

    await prisma.review.deleteMany({
      where: { destinationId: params.id },
    });

    await prisma.booking.deleteMany({
      where: { destinationId: params.id },
    });

    await prisma.destination.delete({
      where: { id: params.id },
    });

    console.log('Destination deleted successfully');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting destination:', error);
    return NextResponse.json(
      { error: 'فشل في الحذف: ' + (error as Error).message },
      { status: 500 }
    );
  }
}