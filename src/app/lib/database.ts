//import Database from 'better-sqlite3';

//let db;

//export function getDatabase() {
  //if (!db) {
    //db = new Database('wpdb.sqlite');
    
    //// Create tables if it doesn't exist
    //db.exec(`
      //CREATE TABLE IF NOT EXISTS events (
        //id INTEGER PRIMARY KEY AUTOINCREMENT,
        //start TEXT NOT NULL,
        //end TEXT NOT NULL,
        //duration TEXT NOT NULL,
        //title TEXT NOT NULL,
        //subtitle TEXT NOT NULL,
        //project TEXT NOT NULL,
        //dept TEXT NOT NULL,
        //author TEXT NOT NULL,
        //comments TEXT,
        //created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      //)
    //`);
    //db.exec(`
      //CREATE TABLE IF NOT EXISTS users (
        //id INTEGER PRIMARY KEY AUTOINCREMENT,
        //name TEXT NOT NULL,
        //email TEXT NOT NULL UNIQUE,
        //password TEXT NOT NULL,
        //dept TEXT NOT NULL,
        //phone TEXT NOT NULL,
        //location TEXT NOT NULL,
        //projects TEXT NOT NULL,
        //position TEXT NOT NULL,
        //status TEXT NOT NULL,
        //hireDate TEXT NOT NULL,
        //created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      //)
    //`);
  //}
  //return db;
//};

//export async function query(sql: string, params: string): Promise<QueryResult> {
  //try {
     ////Инициализируем базу данных если это первое подключение
    ////!db && db = new Database('wpdb.sqlite');
    //!db && getDatabase();
    ////await getUsersDatabase();

    //// Выполняем запрос
    //const preresult = await db.prepare(sql)
    //const result = await preresult.get(params);
    ////const result = await stmt.get(params);
    ////await stmt.finalize();

    //// Для SELECT запросов возвращаем rows
    //if (sql.trim().toUpperCase().startsWith('SELECT')) {
      //return {
        //rows: result,
        ////rowCount: result.length
      //};
    //}

    //// Для INSERT/UPDATE/DELETE возвращаем информацию об изменениях
    //const changes = (db as any).changes || 0;
    //return {
      //rows: result,
      //rowCount: changes
    //};

  //} catch (error) {
    //console.error('Database query error:', error);
    //closeDatabase()
    //throw error;
    
  //}
//};

//export async function getUserByEmail(email: string): Promise<any | null> {
  //try {
    //const result = await query(
      //'SELECT * FROM users WHERE email = ?',
      //[email]
    //);
    
    ////console.log(result)
    //return result;
    
  //} catch (error) {
    //console.error('Error getting user by email:', error);
    //throw error;
  //}
//}


//// Функция для закрытия соединения с базой данных
//export async function closeDatabase(): Promise<void> {
  //if (db) {
    //await db.close();
    //db = null;
  //}
//}


import { Pool, QueryResult as PGQueryResult } from 'pg';

// Define types
interface QueryResult {
  rows: string[];
  rowCount: number;
}

// PostgreSQL connection pool
let pool: Pool | null = null;

export function getDatabase(): Pool {
  if (!pool) {
    pool = new Pool({
      //connectionString: process.env.POSTGRES_URL,
      //ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT || '5432'),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      //ssl: true,
    });

    // Test connection and create tables
    initializeDatabase();
  }
  return pool;
}

async function initializeDatabase(): Promise<void> {
  try {
    const client = await pool!.connect();
    
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        start TEXT NOT NULL,
        "end" TEXT NOT NULL,
        length TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        project TEXT NOT NULL,
        dept TEXT NOT NULL,
        author TEXT NOT NULL,
        name TEXT NOT NULL,
        comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        dept TEXT NOT NULL,
        phone TEXT,
        location TEXT,
        projects TEXT,
        position TEXT,
        status TEXT,
        hireDate TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    client.release();
    console.log('PostgreSQL database initialized successfully');
  } catch (error) {
    console.error('Error initializing PostgreSQL database:', error);
    throw error;
  }
}

export async function query(sql: string, params: string[] = []): Promise<QueryResult> {
  try {
    console.log(sql, params);
    const db = getDatabase();
    const result: PGQueryResult = await db.query(sql, params);
    
    console.log('database query result: ', result.rowCount)
    // For all query types, return the standardized format
    return {
      rows: result.rows,
      rowCount: result.rowCount as number
    };

  } catch (error) {
    console.error('Database query error:', error);
    closeDatabase();
    throw error;
  }
}

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  dept: string;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length > 0) {
      // Type assertion since TypeScript doesn't know the shape of database rows
      return result.rows[0] as unknown as User;
    }
    
    return null;
    
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}


export async function insert(table: string, data: object): Promise<QueryResult> {
  
  //Create columns list (string) and add "" for column with title end
  const columns = Object.keys(data).map(item => { 
    return item == 'end' ? '"end"' : item;
  }).join(', ')
  
  const placeholders = Object.keys(data).map((_, index) => `$${index + 1}`).join(', ');
  const values = Object.values(data);
  
  const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
  return await query(sql, values);
}

export async function update(table: string, data: Record<string, string>): Promise<QueryResult> {
  const id = data.id
  
  const setClause = Object.keys(data).map((key, index) => {
    return key == 'end' ? `"end" = $${index + 1}` : `${key} = $${index + 1}`
  }).join(', ');
  const values = Object.values(data)
  
  const sql = `UPDATE ${table} SET ${setClause} WHERE id = ${id} RETURNING *`;
  console.log(sql)
  return await query(sql, values);
}

export async function remove(table: string, id: string): Promise<QueryResult> {
  const sql = `DELETE FROM ${table} WHERE id = $1`;
  return await query(sql, [id]);
}

// Function to close the database connection pool
export async function closeDatabase(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('PostgreSQL connection pool closed');
  }
}

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query('SELECT NOW()');
    return !!result.rows[0];
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

