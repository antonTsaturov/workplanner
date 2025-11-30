// Change password
import { getUserByEmail } from '../../../lib/database';
import { getCurrentSession } from '../../../lib/session';
import bcrypt from 'bcryptjs';
import { query, insert, remove, update } from '../../../lib/database';
import { NextResponse } from 'next/server';



export async function PUT(request) {
  try {
    
    const { current, newpass } = await request.json();
    
    // Get user hash by email from session
    const session = await getCurrentSession();
    const email = (session as any).email;
    const user = await getUserByEmail(email);

    // Check is current password is valid
    const isPasswordValid = await bcrypt.compare(current, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Wrong email or password' },
        { status: 401 }
      );
    }
    
    // Create hash from newpass and create object data
    const hashedPassword = await bcrypt.hash(newpass, 12);
    const data = {id: user.id, password: hashedPassword}
    
    // Update pass hash in DB
    const result = update('users', data)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Password updated successfully',
        id: result.lastInsertRowid 
      },
      { status: 201 }
    );
  } catch (error) {
        
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}

