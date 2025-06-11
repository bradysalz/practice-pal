import { ItemProgressPoint, TimeRange } from '@/types/stats';
import { calculateCutoffDate } from './date-time';

export function filterProgressData(
  data: ItemProgressPoint[],
  timeRange: TimeRange,
  now: number = Date.now()
): { filtered: ItemProgressPoint[]; cutoffDate: number } {
  const cutoffDate =
    timeRange === 'all' && data.length > 0
      ? Math.min(...data.map(point => point.timestamp))
      : calculateCutoffDate(timeRange).getTime();

  const filtered = data
    .filter(point => point.timestamp >= cutoffDate)
    .filter(point => point.timestamp <= now)
    .sort((a, b) => a.timestamp - b.timestamp)
    .map(point => ({ ...point, timestamp: point.timestamp }));

  return { filtered, cutoffDate };
}
