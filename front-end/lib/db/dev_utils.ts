import { sql } from 'drizzle-orm';
import { db } from './db';

// In a new file, e.g., `db/devUtils.ts`
const ALL_TABLE_NAMES = [
  'books',
  'sections',
  'exercises',
  'artists',
  'songs',
  'setlists',
  'setlist_items',
  'sessions',
  'session_items',
  // Include all your "fast view" tables too
  'book_with_counts',
  'book_progress_history',
  'book_stats',
  'section_with_counts',
  'section_progress_history',
  'section_stats',
  'session_with_items',
  'setlists_with_items',
];

export async function resetAllTables() {
  console.log('Dropping all tables...');
  for (const tableName of ALL_TABLE_NAMES) {
    await db.run(sql`DROP TABLE IF EXISTS ${sql.raw(tableName)};`);
  }

  const tables = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table';`);
  console.log('Tables after reset:', tables);
}
