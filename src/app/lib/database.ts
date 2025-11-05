import Database from 'better-sqlite3';

let db;

export function getDatabase() {
  if (!db) {
    db = new Database('wpdb.sqlite');
    
    // Create tables if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start TEXT NOT NULL,
        end TEXT NOT NULL,
        duration TEXT NOT NULL,
        title TEXT NOT NULL,
        subtitle TEXT NOT NULL,
        project TEXT NOT NULL,
        dept TEXT NOT NULL,
        author TEXT NOT NULL,
        comments TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        dept TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

  }
  return db;
};

export async function query(sql: string, params: string): Promise<QueryResult> {
  try {
     //Инициализируем базу данных если это первое подключение
    //!db && db = new Database('wpdb.sqlite');
    !db && getDatabase();
    //await getUsersDatabase();

    // Выполняем запрос
    const preresult = await db.prepare(sql)
    const result = await preresult.get(params);
    //const result = await stmt.get(params);
    //await stmt.finalize();

    // Для SELECT запросов возвращаем rows
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      return {
        rows: result,
        //rowCount: result.length
      };
    }

    // Для INSERT/UPDATE/DELETE возвращаем информацию об изменениях
    const changes = (db as any).changes || 0;
    return {
      rows: result,
      rowCount: changes
    };

  } catch (error) {
    console.error('Database query error:', error);
    closeDatabase()
    throw error;
    
  }
};

export async function getUserByEmail(email: string): Promise<any | null> {
  try {
    const result = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    //console.log(result)
    return result;
    
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}


// Функция для закрытия соединения с базой данных
export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}


