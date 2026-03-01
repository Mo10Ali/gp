import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const body = await request.json();

    const user = await prisma.user.update({
      where: { id: params.id },
      data: { isSuspended: body.isSuspended },
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Error suspending guide:', error);
    return NextResponse.json(
      { error: 'فشل في العملية' },
      { status: 500 }
    );
  }
}