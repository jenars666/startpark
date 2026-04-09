import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/admin')) {
    const role = request.cookies.get('user-role')?.value;

    if (role !== 'admin') {
      // Not admin — redirect to login with a message
      const loginUrl = new URL('/login', request.url);
      const redirectTarget = `${request.nextUrl.pathname}${request.nextUrl.search}`;
      loginUrl.searchParams.set('redirect', redirectTarget || '/admin');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
