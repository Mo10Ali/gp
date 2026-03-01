import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();
    console.log('Updating guide:', params.id, body);

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone || null,
        avatar: body.avatar || null,
      },
    });

    const specialties = Array.isArray(body.specialties)
      ? body.specialties
      : body.specialties?.split(',').map((s: string) => s.trim()).filter(Boolean) || [];

    const languages = Array.isArray(body.languages)
      ? body.languages
      : body.languages?.split(',').map((l: string) => l.trim()).filter(Boolean) || ['العربية'];

    await prisma.guideProfile.upsert({
      where: { userId: params.id },
      update: {
        bio: body.bio || '',
        specialties: JSON.stringify(specialties),
        languages: JSON.stringify(languages),
        pricePerHour: parseInt(body.pricePerHour) || 100,
        experienceYears: parseInt(body.experienceYears) || 0,
        rating: parseFloat(body.rating) || 0,
      },
      create: {
        userId: params.id,
        bio: body.bio || '',
        specialties: JSON.stringify(specialties),
        languages: JSON.stringify(languages),
        pricePerHour: parseInt(body.pricePerHour) || 100,
        experienceYears: parseInt(body.experienceYears) || 0,
        rating: parseFloat(body.rating) || 0,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error updating guide:', error);
    return NextResponse.json(
      { error: 'فشل في التعديل: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;

    await prisma.guideProfile.deleteMany({
      where: { userId: params.id },
    });

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting guide:', error);
    return NextResponse.json(
      { error: 'فشل في الحذف: ' + (error as Error).message },
      { status: 500 }
    );
  }
}