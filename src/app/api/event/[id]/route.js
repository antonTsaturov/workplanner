/* /api/user */
import { getDatabase } from '../../../lib/database';
import { NextResponse } from 'next/server';

// GET - Fetch all events
export async function GET() {
  try {
    const db = await getDatabase();
    const events = db.prepare('SELECT * FROM events').all();    
    return NextResponse.json({ success: true, data: events });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new event
export async function POST(request) {
  try {
    const { start, end, title, subtitle, project, dept, author, comments } = await request.json();
    
    //Validate input
    if (!start || !end) {
      return NextResponse.json(
        { error: 'Start and end are required' },
        { status: 400 }
      );
    } 
    
    const db = getDatabase();
    const stmt = db.prepare('INSERT INTO events (start, end, title, subtitle, project, dept, author, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const result = stmt.run(start, end, title, subtitle, project, dept, author, comments);

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
        { error: true, message: 'Event already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: true, message: error.message },
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

// PUT - Update an existing event
export async function PUT(request) {
  try {
    const { id, start, end, title, subtitle, project, comments } = await request.json();
        
    const db = getDatabase();
    
    // Check if event exists
    const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    
    if (!existingEvent) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Update the event
    const stmt = db.prepare('UPDATE events SET start = ?, end = ?, title = ?, subtitle = ?, project = ?, comments = ? WHERE id = ?');
    const result = stmt.run(start, end, title, subtitle, project, comments, id);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Event updated successfully',
        id: id
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
