// Change password
import { getUserByEmail } from '../../../lib/database';
import { getCurrentSession } from '../../../lib/session';
import bcrypt from 'bcryptjs';
import { update } from '../../../lib/database';
import { NextResponse } from 'next/server';


export async function PUT(request: Request) {
  try {
    
    const { current, newpass } = await request.json();
    
    // Get user hash by email from session
    const session = await getCurrentSession();
    //const email = (session as any).email;
    const email = session? session.email : null;
    if (!email) {
      return;
    }
    const user = await getUserByEmail(email);

    // Check is current password is valid
    if (user) {
      const isPasswordValid = await bcrypt.compare(current, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Wrong email or password' },
          { status: 401 }
        );
      }
      // Create hash from newpass and create object data
      const hashedPassword = await bcrypt.hash(newpass, 12);
      const stringId = user.id.toString();
      const data = {id: stringId, password: hashedPassword};
      // Update pass hash in DB
      update('users', data)

      return NextResponse.json(
        { success: true, message: 'Password updated successfully' },
        { status: 201 }
      );
    }
  } catch (error) {

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';

      return NextResponse.json(
      { error: true, message: errorMessage },
      { status: 500 }
    );
  }
}

