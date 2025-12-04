/* /api/user/login */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../../../lib/database';
import { createSessionToken } from '../../../lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
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

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }
    
    // Create session payload
    const sessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      dept: user.dept,
    }

    // Create session (sets HTTP-only cookie)
    const token = await createSessionToken(sessionPayload)

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
  
    return NextResponse.json({ success: true, user: sessionPayload });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal error on server' },
      { status: 500 }
    );
  }
}
