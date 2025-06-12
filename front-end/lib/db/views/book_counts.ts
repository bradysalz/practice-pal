import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const bookWithCountsView = sqliteTable('book_with_counts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  author: text('author').notNull(),
  created_by: text('created_by').notNull(),
  created_at: string('created_at').notNull(),
  updated_at: string('updated_at').notNull(),
  exercise_count: integer('exercise_count').notNull(),
});


export async function refreshBookWithCountsView() {
  db.run(sql`
    INSERT OR REPLACE INTO book_with_counts
      (id, name, author, exercise_count)
    SELECT
      id,
      name,
      author,
      books.created_by,
      books.created_at,
      books.updated_at,
      COUNT(e.id) AS exercise_count
    FROM books
    LEFT JOIN sections s on s.book_id = books.id
    LEFT JOIN exercises e on e.section_id = s.id
    GROUP BY id
    ORDER BY name
  `);
}
