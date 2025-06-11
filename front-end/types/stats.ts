import { Database } from '@/types/supabase';
import { NonNullableFields } from '@/types/util';

export type BookStatRow = NonNullableFields<Database['public']['Views']['book_stats_view']['Row']>;
export type SectionStatRow = NonNullableFields<
  Database['public']['Views']['section_stats_view']['Row']
>;
export type BookStatOverTimeRow = NonNullableFields<
  Database['public']['Views']['book_progress_history']['Row']
>;

export type SectionStatOverTimeRow = NonNullableFields<
  Database['public']['Views']['section_progress_history']['Row']
>;

export type TimeRange = 'week' | 'month' | 'year' | 'all';

export type Timestamped = {
  timestamp: number;
};

export interface ItemTempoPoint extends Timestamped {
  tempo: number;
  goal_tempo: number;
}

export interface ItemProgressPoint extends Timestamped {
  percent_at_goal: number;
  percent_played: number;
  played: number;
  at_goal: number;
  total: number;
}
