import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const sessionWithItemsView = sqliteTable('session_with_items', {
  id: text('id').primaryKey(), // session_id
  duration: integer('duration'),
  exercise_count: integer('exercise_count').notNull(),
  song_count: integer('song_count').notNull(),
});

export async function refreshSessionWithItemsView({ sessionId }: { sessionId?: string } = {}) {
  const whereClause = sessionId ? sql`where s.id = ${sessionId}` : sql``;

  db.run(sql`
    INSERT OR REPLACE INTO session_with_items (
      id,
      duration,
      song_count,
      exercise_count
    )
    select
      s.id,
      s.duration,
      count(si.song_id) filter (
        where
          si.song_id is not null
      ) as song_count,
      count(si.exercise_id) filter (
        where
          si.exercise_id is not null
      ) as exercise_count
    from
      sessions s
      left join session_items si on si.session_id = s.id
      ${whereClause}
    group by
      s.id;
  `);
}
