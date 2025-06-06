export type TimeRange = 'week' | 'month' | 'year' | 'all';

export type Timestamped = {
  timestamp: number;
}

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
