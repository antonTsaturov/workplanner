// app/api/auth/logout/

import { NextResponse } from 'next/server'
import { destroySession } from '../../../lib/session'

export async function GET() {
  const result = await destroySession();

  const response = NextResponse.json({ 
    success: true,
    message: 'Logged out successfully',
    result: result
  })

  // Delete the cookie by setting it with an expired date
  // response.cookies.set('session', '', {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   expires: new Date(0), // Expire immediately
  //   sameSite: 'lax',
  //   path: '/',
  // })

  return response
}
