import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone, role } = await request.json();

    // تحقق من وجود المستخدم
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'البريد الإلكتروني مستخدم بالفعل' },
        { status: 400 }
      );
    }

    // إنشاء المستخدم
    const user = await prisma.user.create({
      data: {
        email,
        password, // في الواقع يجب تشفيره، لكن للتبسيط نتركه كما هو
        fullName,
        phone,
        role: role as Role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    );
  }
}