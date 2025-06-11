import { Database } from '@/types/supabase';

export type BookStatRow = Database['public']['Views']['book_stats_view']['Row'];
export type SectionStatRow = Database['public']['Views']['section_stats_view']['Row'];
export type BookStatOverTimeRow = Database['public']['Views']['book_progress_history']['Row'];
export type SectionStatOverTimeRow = Database['public']['Views']['section_progress_history']['Row'];

export type TimeRange = 'week' | 'month' | 'year' | 'all';

export type Timestamped = {
  timestamp: number;
};

export interface ItemTempoPoint extends Timestamped {
  tempo: number;
}

export interface ItemProgressPoint extends Timestamped {
  percent_at_goal: number;
  percent_played: number;
  played: number;
  at_goal: number;
  total: number;
}
