/* /api/user */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabas, getUsersDatabase, query } from '../../../lib/database';

//import { query } from '@/lib/db';

export function GET(request) {
  try {
    const db = getUsersDatabase();
    const events = db.prepare(request).all();
    
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


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
      'SELECT id FROM users WHERE email = ?',
      email
    );

    if (existingUser.rows != undefined) {
      return NextResponse.json(
        { error: 'A user with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save to DB
    const db = getUsersDatabase();
    const stmt = db.prepare('INSERT INTO users (name, email, password, dept) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, email, password, dept);

    return NextResponse.json(
      { success: 'Registration success' },
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
