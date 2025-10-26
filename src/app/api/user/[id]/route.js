/* /api/user */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '../../../lib/database';

//import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { name, email, password, dept } = await request.json();

    // Validation
    if (!name || !email || !password || !dept) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Is user exist?
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with email exist' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save to DB
    //const result = await query(
      //'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      //[name, email, hashedPassword]
    //);
    const db = getUsersDatabase();
    const stmt = db.prepare('INSERT INTO users (name, email, password, dept) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, email, password, dept);


    const user = result.rows[0];

    return NextResponse.json(
      { 
        message: 'Registration success',
        user: { id: user.id, name: user.name, email: user.email, dept:user.dept }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration error' },
      { status: 500 }
    );
  }
}
