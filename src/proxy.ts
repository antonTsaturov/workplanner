import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Если запрос к корневому пути
  if (request.nextUrl.pathname === '/') {
    // Перенаправляем на страницу авторизации
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match only root path:
     * - /
     */
    '/',
  ],
};
