'use server'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables')
}

export interface SessionPayload {
  userId: string
  email: string
  name?: string
  dept?: string
}

export interface DecodedSession extends SessionPayload {
  iat: number
  exp: number
}

// Encrypt (sign) JWT token
export async function encrypt(payload: SessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d', // Token expires in 7 days
    issuer: 'your-app-name',
    audience: 'your-app-users',
  })
}

// Decrypt (verify) JWT token
export async function decrypt(token: string): SessionPayload | null {
  console.log('decrypt', token.value)
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedSession
    return {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      dept: decoded.dept,
    }
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export async function getCurrentSession() {
  try {
    const cookieStore = await cookies(); // Ждем cookies
    const sessionCookie = await cookieStore.get('session'); // Ждем куку
    
    console.log('Raw session cookie:', sessionCookie); // Для отладки
    
    if (!sessionCookie?.value) {
      console.log('No session cookie found');
      return null;
    }

    const session = decrypt(sessionCookie.value);
    console.log('sessionCookie.value:', sessionCookie.value); // Для отладки
    
    return session;
  } catch (error) {
    console.error('Error in getSession:', error);
    return null;
  }}

// Destroy session (logout)
export const destroySession = async () => {
  const cookieStore = await cookies();
  
  cookieStore.delete('session');
  const session = cookieStore.get('session');
  return session;
}

// Validate session and get user data
export async function validateSession(): Promise<{
  user: SessionPayload | null
  isValid: boolean
}> {
  const session = await getCurrentSession()
  return {
    user: session,
    isValid: !!session,
  }
}
