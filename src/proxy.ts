import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  
  const protectedRoutes = [
  '/pages/calendar',
  '/pages/staff',
  '/calendar', // For not see 404 page
  '/staff',    // For not see 404 page
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  const session = request.cookies.get('session')?.value
  
  //console.log('proxy: ', request.nextUrl.pathname)
    
  if (request.nextUrl.pathname === '/' || protectedRoutes.includes(request.nextUrl.pathname) && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/auth' && session) {
    return NextResponse.redirect(new URL('/pages/calendar', request.url));
  }
  
  if (request.nextUrl.pathname === '/public') {
    //return NextResponse.redirect(new URL('/pages/calendar', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
