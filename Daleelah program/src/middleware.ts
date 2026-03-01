import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // الصفحات العامة (ما تحتاج تسجيل دخول)
  const publicPaths = [
    '/',
    '/home',
    '/destinations',
    '/guides',
    '/about',
    '/contact',
    '/auth/login',
    '/auth/register',
    '/auth/select-role',
  ];

  // السماح بالوصول للصفحات العامة
  if (publicPaths.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    return NextResponse.next();
  }

  // السماح بالوصول للـ API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // السماح بالوصول للملفات الثابتة
  if (pathname.startsWith('/_next') || pathname.startsWith('/images') || pathname.startsWith('/favicon')) {
    return NextResponse.next();
  }

  // التحقق من وجود user في localStorage (من خلال cookie)
  const userCookie = request.cookies.get('user');
  
  // إذا ما في user في cookie، نتحقق من localStorage عبر header
  if (!userCookie) {
    // السماح بالمرور - سيتم التحقق في الصفحة نفسها
    return NextResponse.next();
  }

  try {
    const user = JSON.parse(userCookie.value);

    // التحقق من الصلاحيات حسب المسار
    if (pathname.startsWith('/tourist') && user.role !== 'TOURIST') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (pathname.startsWith('/guide') && user.role !== 'GUIDE') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (pathname.startsWith('/company') && user.role !== 'COMPANY') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (pathname.startsWith('/ministry') && user.role !== 'MINISTRY') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (pathname.startsWith('/admin') && user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

  } catch (error) {
    // إذا في مشكلة في parsing الـ cookie، نسمح بالمرور
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};