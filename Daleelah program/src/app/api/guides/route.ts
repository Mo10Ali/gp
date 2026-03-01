import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

function toArray(value: any): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((s: string) => s.trim()).filter(Boolean);
  return [];
}

export async function GET() {
  try {
    const guides = await prisma.user.findMany({
      where: { role: Role.GUIDE },
      include: { guideProfile: true },
    });

    const guidesFormatted = guides.map((guide) => ({
      ...guide,
      pricePerHour: guide.guideProfile?.pricePerHour || 100,
    }));

    return NextResponse.json(guidesFormatted);
  } catch (error) {
    console.error('Error fetching guides:', error);
    return NextResponse.json(
      { error: 'فشل في جلب المرشدين: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating guide body:', body);

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password || '123456',
        fullName: body.fullName,
        phone: body.phone || null,
        avatar: body.avatar || null,
        role: Role.GUIDE,
      },
    });

    const specialties = toArray(body.specialties);
    const languages = toArray(body.languages).length > 0
      ? toArray(body.languages)
      : ['العربية'];

    const profile = await prisma.guideProfile.create({
      data: {
        userId: user.id,
        bio: body.bio || '',
        specialties: JSON.stringify(specialties),
        languages: JSON.stringify(languages),
        pricePerHour: parseInt(body.pricePerHour) || 100,
        experienceYears: parseInt(body.experienceYears) || 0,
        rating: parseFloat(body.rating) || 0,
      },
    });

    console.log('Guide created successfully:', user.id);
    return NextResponse.json({ ...user, guideProfile: profile }, { status: 201 });

  } catch (error) {
    console.error('Error creating guide:', error);
    return NextResponse.json(
      { error: 'فشل في إنشاء المرشد: ' + (error as Error).message },
      { status: 500 }
    );
  }
}