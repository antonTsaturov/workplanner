

import { query, insert } from '../../../lib/database';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  
  try {
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (email) {
      //Here we check is email unique when adding new employee
      const isEmplExist = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      
      console.log(isEmplExist)
      if (isEmplExist.rowCount == 0 ) {
        return NextResponse.json(
          { check: true, message: 'OK' },
        );
        
      } else {
        return NextResponse.json(
          { check: false, message: 'Email is exist' },
        );
      }
      
    } else {
      
      const columns = 'id, name, email, dept, phone, location, projects, position, status, hireDate'
      const staff = await query(`SELECT ${columns} FROM users`);

      if (!staff) {
        return NextResponse.json(
          { error: 'Events not found' },
          { status: 404 }
        );
      }
        
      return NextResponse.json(
        { success: true, data: staff },
        { status: 200 }
      );
    }
  }
  catch (error) {

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';
    
    //console.log(error)
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = insert('users', data)
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Employee record created successfully',
        data: result 
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';

      if (errorMessage.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: true, message: 'Employe with the same email is exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: true, message: errorMessage },
      { status: 500 }
    );
  }
}
