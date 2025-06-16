import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const bookWithCountsView = sqliteTable('book_with_counts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  author: text('author').notNull(),
  created_by: text('created_by').notNull(),
  created_at: text('created_at').notNull(),
  updated_at: text('updated_at').notNull(),
  exercise_count: integer('exercise_count').notNull(),
});

export async function refreshBookWithCountsView() {
  await db.run(sql`
    INSERT OR REPLACE INTO book_with_counts (
      id,
      name,
      author,
      created_by,
      created_at,
      updated_at,
      exercise_count
    )
    SELECT
      b.id,
      b.name,
      b.author,
      b.created_by,
      b.created_at,
      b.updated_at,
      COUNT(e.id) AS exercise_count
    FROM books b
    LEFT JOIN sections s ON s.book_id = b.id
    LEFT JOIN exercises e ON e.section_id = s.id
    GROUP BY
      b.id
  `);
}
