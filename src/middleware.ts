import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();

  // If user is logged in and trying to access the home page, redirect to dashboard
  if (session?.user && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: '/', // Only run on home page
  // Alternative if you want to run on multiple paths:
  // matcher: ['/', '/login', '/register']
};
