import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const sectionWithCountsView = sqliteTable('section_with_counts', {
  id: text('id').primaryKey(), // section_id
  book_id: text('book_id').notNull(),
  name: text('name').notNull(),
  sort_order: integer('sort_order').notNull(),
  exercise_count: integer('exercise_count'),
});

export async function refreshSectionWithCountsView() {
  await db.run(sql`
    INSERT OR REPLACE INTO section_with_counts (
      id,
      book_id,
      name,
      sort_order,
      exercise_count
    )
    SELECT
      s.id,
      s.book_id,
      s.name,
      s.sort_order,
      COUNT(e.id) AS exercise_count
    FROM sections s
    LEFT JOIN exercises e on e.section_id = s.id
    GROUP BY s.id
  `);
}
