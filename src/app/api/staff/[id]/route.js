import { getDatabase } from '../../../lib/database';
import { NextResponse } from 'next/server';


export async function GET() {
  
  try {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM staff')
    const events = stmt.all(); //').all();
    
    if (!events) {
      return NextResponse.json(
        { error: 'Events not found' },
        { status: 404 }
      );
    }
      
    return NextResponse.json(
      { success: true, data: events },
      { status: 200 }
    );
    
  }
  catch (error) {
    //console.log(error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const { dept, email, name, hireDate, location, phone, position, projects, status } = await request.json();

    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO staff (dept, email, name, hireDate, location, phone, position, projects, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run( dept, email, name, hireDate, location, phone, position, projects, status );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Employee record created successfully',
        id: result.lastInsertRowid 
      },
      { status: 201 }
    );
  } catch (error) {
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: true, message: 'Employe already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
