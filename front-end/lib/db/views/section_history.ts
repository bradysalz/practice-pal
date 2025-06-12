import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const sectionProgressHistoryView = sqliteTable('section_progress_history', {
  date: text('date').notNull(),
  section_id: text('section_id').notNull(),
  total: integer('total').notNull(),
  played: integer('played').notNull(),
  at_goal: integer('at_goal').notNull(),
  percent_played: integer('percent_played').notNull(),
  percent_at_goal: integer('percent_at_goal').notNull(),
});

export async function refreshSectionProgressHistory({ sectionId }: { sectionId?: string }) {
  const whereClause = sectionId ? sql`WHERE s.id = ${sectionId}` : sql``;

  db.run(sql`
    INSERT OR REPLACE INTO section_progress_history (
      section_id,
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
          s.id AS section_id,
          e.id AS exercise_id,
          e.goal_tempo
        FROM sections s
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
          ae.section_id,
          ae.exercise_id,
          ae.goal_tempo,
          sd.session_date,
          sd.tempo
        FROM all_exercises ae
        LEFT JOIN session_data sd ON sd.exercise_id = ae.exercise_id
      ),
      first_play_dates AS (
        SELECT
          section_id,
          exercise_id,
          MIN(session_date) AS first_played_on
        FROM combined
        WHERE session_date IS NOT NULL
        GROUP BY section_id, exercise_id
      ),
      first_goal_dates AS (
        SELECT
          section_id,
          exercise_id,
          MIN(session_date) AS first_at_goal
        FROM combined
        WHERE session_date IS NOT NULL
          AND tempo >= goal_tempo
        GROUP BY section_id, exercise_id
      ),
      relevant_dates AS (
        SELECT session_date AS date FROM session_data
        UNION
        SELECT first_played_on AS date FROM first_play_dates
        UNION
        SELECT first_at_goal AS date FROM first_goal_dates
        WHERE first_at_goal IS NOT NULL
      ),
      section_total_exercises AS (
        SELECT
          section_id,
          COUNT(DISTINCT exercise_id) AS total_exercises
        FROM all_exercises
        GROUP BY section_id
      ),
      played_section_exercises AS (
        SELECT DISTINCT section_id, exercise_id
        FROM first_play_dates
      ),
      section_progress_summary AS (
        SELECT
          ste.section_id,
          rd.date,
          ste.total_exercises AS total,
          COUNT(DISTINCT CASE
            WHEN f.first_played_on <= rd.date THEN pse.exercise_id
          END) AS played,
          COUNT(DISTINCT CASE
            WHEN g.first_at_goal <= rd.date THEN pse.exercise_id
          END) AS at_goal
        FROM section_total_exercises ste
        CROSS JOIN relevant_dates rd
        JOIN played_section_exercises pse ON pse.section_id = ste.section_id
        LEFT JOIN first_play_dates f ON f.section_id = pse.section_id AND f.exercise_id = pse.exercise_id
        LEFT JOIN first_goal_dates g ON g.section_id = pse.section_id AND g.exercise_id = pse.exercise_id
        GROUP BY ste.section_id, rd.date, ste.total_exercises
      )
    SELECT
      sps.section_id,
      sps.date,
      sps.total,
      sps.played,
      sps.at_goal,
      ROUND(CAST(sps.played AS REAL) / NULLIF(sps.total, 0) * 100, 1) AS percent_played,
      ROUND(CAST(sps.at_goal AS REAL) / NULLIF(sps.total, 0) * 100, 1) AS percent_at_goal
    FROM section_progress_summary sps
    ORDER BY sps.section_id, sps.date;
  `);
}
