import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
//import { cookies } from 'next/headers';
//import { decrypt, getCurrentSession, destroySession, validateSession } from '@/app/lib/session';
import { storage } from '@/app/utils/localStorage';



export async function proxy(request: NextRequest) {
  
  const protectedRoutes = ['/calendar'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  const session = request.cookies.get('session')?.value
    
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname == protectedRoutes && !session) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }
  
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/auth' && session) {
    return NextResponse.redirect(new URL('/calendar', request.url));
  }
  
  //const cookie = (await cookies()).get('session')?.value
  
  //destroySession()
  console.log('Session proxy: ', session)
  //const session = await validateSession()
  //if (!session) {
    //console.log('unautorized')
  //}

  // const response = NextResponse.json({ 
  //   result: session
  // })
  // return response;
  //return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
