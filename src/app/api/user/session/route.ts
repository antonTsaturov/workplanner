// app/api/session/route.ts
import { getCurrentSession } from '../../../lib/session';
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
        userId: session.userId,
        email: session.email,
        name: session.name,
        dept: session.dept,
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
