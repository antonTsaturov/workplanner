import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { storage } from '@/app/utils/localStorage';



export async function proxy(request: NextRequest) {
  
  const protectedRoutes = ['/pages/calendar'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  const session = request.cookies.get('session')?.value
    
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname == protectedRoutes && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/auth' && session) {
    return NextResponse.redirect(new URL('/pages/calendar', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
