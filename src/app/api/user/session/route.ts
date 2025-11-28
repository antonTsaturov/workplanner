// app/api/session/route.ts
import { decrypt, getCurrentSession, destroySession, validateSession } from '../../../lib/session';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getCurrentSession();

    // Если сессии нет, возвращаем соответствующий ответ
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    // Возвращаем данные сессии
    return NextResponse.json({
      authenticated: true,
      user: {
        userId: (session as any).userId,
        email: (session as any).email,
        name: (session as any).name,
        dept: (session as any).dept,
      }
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
