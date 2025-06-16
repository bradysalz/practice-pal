import { TimeRange } from '@/types/stats';
import { format } from 'date-fns';

export function formatToMinutes(seconds: number): number {
  return Math.round(seconds / 60);
}

export function formatTimestampToDate(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return format(date, 'EEEE, MMMM d');
  } catch (error) {
    console.warn('Error formatting timestamp:', timestamp, error);
    return 'Invalid Date';
  }
}

export function calculateCutoffDate(timeRange: TimeRange): Date {
  const now = new Date();
  const cutoffDate = new Date();

  switch (timeRange) {
    case 'week':
      cutoffDate.setDate(now.getDate() - 7);
      break;
    case 'month':
      cutoffDate.setMonth(now.getMonth() - 1);
      break;
    case 'year':
      cutoffDate.setFullYear(now.getFullYear() - 1);
      break;
    case 'all':
      return new Date(0); // Beginning of Unix epoch
  }

  return cutoffDate;
}

export function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toISOString().split('T')[0];
  } catch (e) {
    console.warn('Error formatting date:', dateStr, e);
    return 'Invalid Date';
  }
}

export function isValidDate(dateStr: string): boolean {
  try {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  } catch (e) {
    return false;
  }
}
