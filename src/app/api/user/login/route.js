/* /api/user/login */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabas, getUsersDatabase, getUserByEmail } from '../../../lib/database';
//import { createSession } from '@/app/lib/session'
import { createSessionToken } from '../../../lib/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Search user
    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(password, user.rows.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }
    
    // Create session payload
    const sessionPayload = {
      userId: user.rows.id,
      email: user.rows.email,
      name: user.rows.name,
      dept: user.rows.dept,
    }
    //console.log(sessionPayload)
    // Create session (sets HTTP-only cookie)
    const token = await createSessionToken(sessionPayload)


    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 неделя
      path: '/',
    });
  
    return NextResponse.json({ success: true, user: sessionPayload });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
