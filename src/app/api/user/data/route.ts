import { getDatabase } from '../../../lib/database';
import { NextResponse } from 'next/server';


export async function GET(request) {
  
  try {
    
    const db = await getDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      const stmt = db.prepare('SELECT * FROM staff WHERE email = ?')
      const isEmplExist = stmt.all(email);
      console.log(isEmplExist)
      if (isEmplExist.length == 0 ) {
        return NextResponse.json(
          { check: true, message: 'OK' },
        );
        
      } else {
        return NextResponse.json(
          { check: false, message: 'Email is exist' },
        );
      }
      
    } else {
      
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
    const result = stmt.run( dept, email, name, hireDate, location, phone, position, JSON.stringify(projects), status );

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
        { error: true, message: 'Employe with the same email is exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: true, message: error.message },
      { status: 500 }
    );
  }
}
