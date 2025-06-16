import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const setlistsWithItemsView = sqliteTable('setlists_with_items', {
  id: text('id').primaryKey(), // setlist_id
  name: text('name').notNull(),
  description: text('description'),
  song_count: integer('song_count').notNull(),
  exercise_count: integer('exercise_count').notNull(),
});

export async function refreshSetlistsWithItemsView({ setlistId }: { setlistId?: string } = {}) {
  const whereClause = setlistId ? sql`where s.id = ${setlistId}` : sql``;

  db.run(sql`
    INSERT OR REPLACE INTO setlists_with_items (
      id,
      name,
      description,
      song_count,
      exercise_count
    )
    select
      s.id,
      s.name,
      s.description,
      count(si.song_id) filter (
        where
          si.song_id is not null
      ) as song_count,
      count(si.exercise_id) filter (
        where
          si.exercise_id is not null
      ) as exercise_count
    from
      setlists s
      left join setlist_items si on si.setlist_id = s.id
      ${whereClause}
    group by
      s.id;
  `);
}
