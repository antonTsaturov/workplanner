///* /api/user */
//import { getDatabase } from '../../../lib/database';
//import { NextResponse } from 'next/server';


//// GET - Fetch all events by authow (email)
//export async function GET(request) {
  
  //try {
    
    //const { searchParams } = new URL(request.url);
    //const email = searchParams.get('email');
        
    
    //if (!email) {
      //return NextResponse.json(
        //{ success: false, error: 'Author (email) is required' },
        //{ status: 400 }
      //);
    //}
    
    //const db = await getDatabase();
    //const stmt = db.prepare('SELECT * FROM events WHERE author = ?')
    //const events = stmt.all(email); //').all();
    
    //if (!events) {
      //return NextResponse.json(
        //{ error: 'Events not found' },
        //{ status: 404 }
      //);
    //}
      
    //return NextResponse.json(
      //{ success: true, data: events },
      //{ status: 200 }
    //);
    
  //}
  //catch (error) {
    ////console.log(error)
    //return NextResponse.json(
      //{ success: false, error: error.message },
      //{ status: 500 }
    //);
  //}
//}

//// POST - Save new event 
//export async function POST(request) {
  
  //try {    
    //const { start, end, duration, title, subtitle, project, dept, author, comments } = await request.json();
    
    ////Validate input
    //if (!start || !end) {
      //return NextResponse.json(
        //{ error: 'Start and end are required' },
        //{ status: 400 }
      //);
    //} 
    
    //const db = getDatabase();
    //const stmt = db.prepare('INSERT INTO events (start, end, duration, title, subtitle, project, dept, author, comments) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    //const result = stmt.run(start, end, duration, title, subtitle, project, dept, author, comments);

    //return NextResponse.json(
      //{ 
        //success: true, 
        //message: 'Event created successfully',
        //id: result.lastInsertRowid 
      //},
      //{ status: 201 }
    //);
    
  //} catch (error) {
    //if (error.message.includes('UNIQUE constraint failed')) {
      //return NextResponse.json(
        //{ error: true, message: 'Event already exists' },
        //{ status: 400 }
      //);
    //}
    
    //return NextResponse.json(
      //{ error: true, message: error.message },
      //{ status: 500 }
    //);
  //}
//}

//// DELETE - Delete an event by ID
//export async function DELETE(request) {
  //try {
    //const id = request.headers.get('X-Event-ID');
    
    ////console.log(id);
    
    //if (!id) {
      //return NextResponse.json(
        //{ success: false, error: 'Event ID is required' },
        //{ status: 400 }
      //);
    //}

    //const db = getDatabase();
    
    //// Check if event exists
    //const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    
    //if (!existingEvent) {
      //return NextResponse.json(
        //{ success: false, error: 'Event not found' },
        //{ status: 404 }
      //);
    //}

    //// Delete the event
    //db.prepare('DELETE FROM events WHERE id = ?').run(id);
    
    //return NextResponse.json({ 
      //success: true, 
      //message: 'Event deleted successfully',
      //deletedId: id
    //});
  //} catch (error) {
    //return NextResponse.json(
      //{ success: false, error: error.message },
      //{ status: 500 }
    //);
  //}
//}

//// PUT - Update an existing event
//export async function PUT(request) {
  //try {
    //const { id, start, end, duration, title, subtitle, project, comments } = await request.json();
        
    //const db = getDatabase();
    
    //// Check if event exists
    //const existingEvent = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
    
    //if (!existingEvent) {
      //return NextResponse.json(
        //{ success: false, error: 'Event not found' },
        //{ status: 404 }
      //);
    //}

    //// Update the event
    //const stmt = db.prepare('UPDATE events SET start = ?, end = ?, duration = ?, title = ?, subtitle = ?, project = ?, comments = ? WHERE id = ?');
    //const result = stmt.run(start, end, duration, title, subtitle, project, comments, id);

    //return NextResponse.json(
      //{ 
        //success: true, 
        //message: 'Event updated successfully',
        //id: id
      //}
    //);
  //} catch (error) {
    //return NextResponse.json(
      //{ success: false, error: error.message },
      //{ status: 500 }
    //);
  //}
//}

/* /api/user */
//import { getDatabase } from '../../../lib/database';
import { query, insert, remove, update } from '../../../lib/database';
import { NextResponse } from 'next/server';


// GET - Fetch all events by author (email)
export async function GET(request) {
  
  try {
    
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
        
    
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
    //console.log(error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Save new event 
export async function POST(request) {
  
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
    remove('events', id)
    
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
    const result = update('events', data)
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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
