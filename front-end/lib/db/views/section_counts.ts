import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const sectionWithCountsView = sqliteTable('section_with_counts', {
  id: text('id').primaryKey(), // section_id
  book_id: text('book_id').notNull(),
  name: text('name').notNull(),
  exercise_count: integer('exercise_count').notNull(),
  order: integer('order').notNull(),
});

export async function refreshSectionWithCountsView() {
  db.run(sql`
    INSERT OR REPLACE INTO section_with_counts (id, book_id, name, exercise_count, order)
    SELECT id, book_id, name, COUNT(*) AS exercise_count, order
    FROM sections
    LEFT JOIN exercises e on e.section_id = sections.id
    GROUP BY id
  `);
}
