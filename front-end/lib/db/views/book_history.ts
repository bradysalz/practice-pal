import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const bookProgressHistoryView = sqliteTable(
  'book_progress_history',
  {
    date: text('date').notNull(),
    book_id: text('book_id').notNull(),
    total: integer('total').notNull(),
    played: integer('played').notNull(),
    at_goal: integer('at_goal').notNull(),
    percent_played: integer('percent_played').notNull(),
    percent_at_goal: integer('percent_at_goal').notNull(),
  },
  (table) => [primaryKey({ columns: [table.book_id, table.date] })]
);

export async function refreshBookProgressHistory({ bookId }: { bookId?: string } = {}) {
  const whereClause = bookId ? sql`WHERE b.id = ${bookId}` : sql``;

  db.run(sql`
    INSERT OR REPLACE INTO book_progress_history (
      book_id,
      date,
      total,
      played,
      at_goal,
      percent_played,
      percent_at_goal
    )
    WITH
      all_exercises AS (
        SELECT
          b.id AS book_id,
          e.id AS exercise_id,
          e.goal_tempo
        FROM books b
        JOIN sections s ON s.book_id = b.id
        JOIN exercises e ON e.section_id = s.id
        ${whereClause}
      ),
      session_data AS (
        SELECT
          si.exercise_id,
          date(s.created_at / 1000, 'unixepoch') AS session_date,
          si.tempo
        FROM session_items si
        JOIN sessions s ON s.id = si.session_id
      ),
      combined AS (
        SELECT
          ae.book_id,
          ae.exercise_id,
          ae.goal_tempo,
          sd.session_date,
          sd.tempo
        FROM all_exercises ae
        LEFT JOIN session_data sd ON sd.exercise_id = ae.exercise_id
      ),
      first_play_dates AS (
        SELECT
          book_id,
          exercise_id,
          MIN(session_date) AS first_played_on
        FROM combined
        WHERE session_date IS NOT NULL
        GROUP BY book_id, exercise_id
      ),
      first_goal_dates AS (
        SELECT
          book_id,
          exercise_id,
          MIN(session_date) AS first_at_goal
        FROM combined
        WHERE session_date IS NOT NULL
          AND tempo >= goal_tempo
        GROUP BY book_id, exercise_id
      ),
      relevant_dates AS (
        SELECT session_date AS date FROM session_data
        UNION
        SELECT first_played_on AS date FROM first_play_dates
        UNION
        SELECT first_at_goal AS date FROM first_goal_dates
        WHERE first_at_goal IS NOT NULL
      ),
      book_total_exercises AS (
        SELECT
          book_id,
          COUNT(DISTINCT exercise_id) AS total_exercises
        FROM all_exercises
        GROUP BY book_id
      ),
      played_book_exercises AS (
        SELECT DISTINCT book_id, exercise_id
        FROM first_play_dates
      ),
      book_progress_summary AS (
        SELECT
          bte.book_id,
          rd.date,
          bte.total_exercises AS total,
          COUNT(DISTINCT CASE
            WHEN f.first_played_on <= rd.date THEN pbe.exercise_id
          END) AS played,
          COUNT(DISTINCT CASE
            WHEN g.first_at_goal <= rd.date THEN pbe.exercise_id
          END) AS at_goal
        FROM book_total_exercises bte
        CROSS JOIN relevant_dates rd
        JOIN played_book_exercises pbe ON pbe.book_id = bte.book_id
        LEFT JOIN first_play_dates f ON f.book_id = pbe.book_id AND f.exercise_id = pbe.exercise_id
        LEFT JOIN first_goal_dates g ON g.book_id = pbe.book_id AND g.exercise_id = pbe.exercise_id
        GROUP BY bte.book_id, rd.date, bte.total_exercises
      )
    SELECT
      bps.book_id,
      bps.date,
      bps.total,
      bps.played,
      bps.at_goal,
      ROUND(CAST(bps.played AS REAL) / NULLIF(bps.total, 0) * 100, 1) AS percent_played,
      ROUND(CAST(bps.at_goal AS REAL) / NULLIF(bps.total, 0) * 100, 1) AS percent_at_goal
    FROM book_progress_summary bps
    ORDER BY bps.book_id, bps.date;
  `);
}
