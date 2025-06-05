export type TimeRange = 'week' | 'month' | 'year' | 'all';

export interface ItemTempoPoint {
  timestamp: string;
  tempo: number;
  [key: string]: string | number;
}
