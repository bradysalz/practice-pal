import { db } from '@/lib/db/db';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const sectionStatsView = sqliteTable('section_stats', {
  section_id: text('section_id').notNull().primaryKey(),
  total_exercises: integer('total_exercises').notNull(),
  played_exercises: integer('played_exercises').notNull(),
  goal_reached_exercises: integer('goal_reached_exercises').notNull(),
});

export async function refreshSectionStatsView({ sectionId }: { sectionId?: string }) {
  const whereClause = sectionId ? sql`WHERE s.id = ${sectionId}` : sql``;

  db.run(sql`
    INSERT OR REPLACE INTO section_stats (
      section_id,
      total_exercises,
      played_exercises,
      goal_reached_exercises
    )
    with
      all_exercises as (
        select
          s.id as section_id,
          e.id as exercise_id,
          e.goal_tempo
        from
          sections s
          join exercises e on e.section_id = s.id
          ${whereClause}
      ),
      last_tempos as (
        select
          si.exercise_id,
          max(si.tempo) as max_recorded_tempo
        from
          session_items si
        group by
          si.exercise_id
      )
    select
      ae.section_id,
      count(*) as total_exercises,
      count(lt.exercise_id) as played_exercises,
      count(
        case
          when lt.max_recorded_tempo >= ae.goal_tempo then 1
        end
      ) as goal_reached_exercises
    from
      all_exercises ae
      left join last_tempos lt on lt.exercise_id = ae.exercise_id
    group by
      ae.section_id;
  `);
}
