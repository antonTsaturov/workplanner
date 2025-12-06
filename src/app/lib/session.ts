'use server'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables')
}

// export interface SessionPayload {
//   userId: string;
//   email: string;
//   name?: string;
//   dept?: string;
// }

// export interface DecodedSession extends SessionPayload {
//   iat: number;
//   exp: number;
// }

interface DecodedSession extends JwtPayload {
  userId: string;
  email: string;
  name: string;
  dept: string;
}

interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  dept: string;
}

// Encrypt (sign) JWT token
// export async function encrypt(payload: SessionPayload): Promise<string> {
//   return jwt.sign(payload, JWT_SECRET, {
//     expiresIn: '1d', // Token expires in 7 days
//     issuer: 'your-app-name',
//     audience: 'your-app-users',
//   })
// }
export async function encrypt(payload: SessionPayload): Promise<string> {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1d',
      issuer: 'your-app-name',
      audience: 'your-app-users',
    });
  } catch (error) {
    console.error('JWT encryption failed:', error);
    throw error; // Re-throw to let the caller handle it
  }
}
// Decrypt (verify) JWT token
// export async function decrypt(token: string): Promise<SessionPayload | null> {
//   //console.log('decrypt', token.value)
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as DecodedSession
//     return {
//       userId: decoded.userId,
//       email: decoded.email,
//       name: decoded.name,
//       dept: decoded.dept,
//     }
//   } catch (error) {
//     console.error('JWT verification failed:', error)
//     return null
//   }
// }

export async function decrypt(token: string): Promise<SessionPayload | null> {
  try {
    // Ensure JWT_SECRET is defined
    const JWT_SECRET = process.env.JWT_SECRET;
    
    if (!JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return null;
    }
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Check if the decoded token has the required properties
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      'userId' in decoded &&
      'email' in decoded &&
      'name' in decoded &&
      'dept' in decoded
    ) {
      const sessionDecoded = decoded as DecodedSession;
      return {
        userId: sessionDecoded.userId,
        email: sessionDecoded.email,
        name: sessionDecoded.name,
        dept: sessionDecoded.dept,
      };
    } else {
      console.error('Decoded JWT does not contain required fields');
      return null;
    }
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

export async function getCurrentSession() {
  try {
    const cookieStore = await cookies(); // Ждем cookies
    const sessionCookie = cookieStore.get('session');
    
    //console.log('Raw session cookie:', sessionCookie); 
    if (!sessionCookie?.value) {
      console.log('No session cookie found');
      return null;
    }

    const session = decrypt(sessionCookie.value);
    //console.log('sessionCookie.value:', sessionCookie.value); 
    
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

export const setSessionLang = async (lang: string) => {
  const cookieStore = await cookies();
  
  cookieStore.set('locale', lang, {
    path: '/',           // Important: accessible from all paths
    maxAge: 60 * 60 * 24 * 30, // 30 days 
    sameSite: 'lax',
  });
}

export const getSessionLang = async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value;
  return locale;
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
