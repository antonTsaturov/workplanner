///* /api/user/register */
//import { NextResponse } from 'next/server';
//import bcrypt from 'bcryptjs';
//import { getDatabase, getUserByEmail } from '../../../lib/database';

//export async function POST(request) {
  //try {
    //const { name, email, password, dept } = await request.json();

    //// Validation
    //if (!name || !email || !password || !dept) {
      //return NextResponse.json(
        //{ error: 'All fields are required' },
        //{ status: 400 }
      //);
    //}
    //if (password.length < 6) {
      //return NextResponse.json(
        //{ error: 'Password must be at least 6 characters long' },
        //{ status: 400 }
      //);
    //}

    //// Is user exist?
    //const db = getDatabase();
    //const sql = `SELECT id FROM users WHERE email = ?`;
    //const existingUser = await db.prepare(sql).get(email);
    //if (existingUser) {
      //return NextResponse.json(
        //{ error: 'A user with this email already exists.' },
        //{ status: 409 }
      //);
    //}

    //// Hash password
    //const hashedPassword = await bcrypt.hash(password, 12);

    //// Save to DB
    //const stmt = db.prepare('INSERT INTO users (name, email, password, dept) VALUES (?, ?, ?, ?)');
    //const result = stmt.run(name, email, hashedPassword, dept);

    //return NextResponse.json(
      //{ success: 'Registration success' },
      //{ status: 201 }
    //);

  //} catch (error) {
    //console.error('Registration error:', error);
    //return NextResponse.json(
      //{ error: 'Registration error' },
      //{ status: 500 }
    //);
  //}
//}

/* /api/user/register */
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase, getUserByEmail, insert } from '../../../lib/database';

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
    await getDatabase();
    //const existingUser = await getUserByEmail(email);
    //if (existingUser) {
      //return NextResponse.json(
        //{ error: 'A user with this email already exists.' },
        //{ status: 409 }
      //);
    //}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save to DB
    //console.log({name: name, email: email, password: hashedPassword, dept: dept})
    await insert('users', {name: name, email: email, password: hashedPassword, dept: dept})

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
