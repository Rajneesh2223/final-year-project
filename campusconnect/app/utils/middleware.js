import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies.get('token'); 
  const protectedRoutes = ['/dashboard', '/events', '/clubs', '/analytics', '/notifications', '/settings'];

  if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/events', '/clubs', '/analytics', '/notifications', '/settings'],
};
