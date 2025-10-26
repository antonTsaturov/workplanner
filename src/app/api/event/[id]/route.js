/* /api/user */
import { getDatabase } from '../../../lib/database';
import { NextResponse } from 'next/server';

// GET - Fetch all events
export function GET() {
  try {
    const db = getDatabase();
    const events = db.prepare('SELECT id, start, end FROM events').all();
    
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new event
export async function POST(request) {
  try {
    const { start, end } = await request.json();
    
     //Validate input
    if (!start || !end) {
      return NextResponse.json(
        { success: false, error: 'Start and end are required' },
        { status: 400 }
      );
    } 
    
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO events (start, end) VALUES (?, ?)');
    const result = stmt.run(start, end);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Event created successfully',
        id: result.lastInsertRowid 
      },
      { status: 201 }
    );
  } catch (error) {
    
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { success: false, error: 'Id already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete an event by ID
export async function DELETE(request) {
  try {
    const id = request.headers.get('X-Event-ID');
    
    //console.log(id);
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Event ID is required' },
        { status: 400 }
      );
    }

    const db = getDatabase();
    
    // Check if event exists
    const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete the event
    db.prepare('DELETE FROM events WHERE id = ?').run(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully',
      deletedId: id
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
