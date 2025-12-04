/* /api/user */

import { query, insert, remove, update } from '../../../lib/database';
import { NextResponse } from 'next/server';


// GET - Fetch all events or by author (email)
export async function GET(request: Request) {

  try {

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    //console.log(request)

    if (!email) {

      const eventsAll = await query('SELECT * FROM events');

      //return NextResponse.json(
        //{ success: false, error: 'Author (email) is required' },
        //{ status: 400 }
      //);
      return NextResponse.json(
        { success: true, data: eventsAll },
        { status: 200 }
      );
    }

    const events = await query(
      'SELECT * FROM events WHERE author = $1',
      [email]
    );

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
    console.log('Fetch all events by author error: ', error);

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST - Save new event
export async function POST(request: Request) {

  try {
    const data = await request.json();
    const result = insert('events', data)

    return NextResponse.json(
      {
        success: true,
        message: 'Event created successfully',
        id: result
      },
      { status: 201 }
    );

  } catch (error) {
    console.log('Save new event error: ', error);

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';

    if (errorMessage.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: true, message: 'Event already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: true, message: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Delete an event by ID
export async function DELETE(request: Request) {
  try {
    const id = request.headers.get('X-Event-ID');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    // Check if event exists
    const existingEvent = await query(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete the event
    remove('events', parseInt(id))

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
      deletedId: id
    });

  } catch (error) {
    console.log('Delete an event by ID error: ', error);

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT - Update an existing event
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    // Check if event exists
    const existingEvent = await query(
      'SELECT * FROM events WHERE id = $1',
      [data.id]
    );

    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Update the event
    const result = await update('events', data)
    if (result) {
      return NextResponse.json(
        {
          success: true,
          message: 'Event updated successfully',
          //id: id
        }
      );
    }
  } catch (error) {
    console.log('Update an existing event error: ', error);

    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred';
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
