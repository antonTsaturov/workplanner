import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
//import { cookies } from 'next/headers';
import { getSessionInfo } from './app/lib/fetch'
import { decrypt, getCurrentSession, destroySession, validateSession } from '@/app/lib/session';


export async function proxy(request: NextRequest) {
  
  const protectedRoutes = ['/calendar'];
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );
  
  //const session = await getSessionInfo();
  let session;
  
    try {
      const response = await fetch(`${'http://localhost:3000'}/api/user/session`, {
        method: 'GET',
      });
  
      const result = await response.json()
      session = result;
  
    } catch (error) {
      console.log(' getSessionInfo fetch Error: ', error);
      
    } 
  
   //Если запрос к корневому пути без авторизации
  //if (request.nextUrl.pathname === '/' && !session) {
    //// Перенаправляем на страницу авторизации
    //return NextResponse.redirect(new URL('/auth', request.url));
  //}
  
  //if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/auth' && session) {
    //return NextResponse.redirect(new URL('/calendar', request.url));
  //}
  
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
}

//export const config = {
  //matcher: [
    ///*
     //* Match only root path:
     //* - /
     //*/
    //'/',
  //],
//};
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
