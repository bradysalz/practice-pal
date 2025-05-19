import { format } from 'date-fns';

export function formatToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

export function formatTimestampToDate(timestamp: string): string {
  return format(timestamp, 'EEEE, MMMM d');
}
