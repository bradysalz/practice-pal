import { TimeSeriesData } from "@/components/stats/ItemTempoGraph";
import { TimeRange } from "@/types/stats";

/**
 * Formats a date string based on the selected time range and data context
 * @param dateStr - ISO date string to format
 * @param timeRange - Selected time range (week, month, year, all)
 * @param data - Array of data points used for context in 'all' range
 * @returns Formatted date string
 */
export function formatDateByRange(epochMillis: number, timeRange: TimeRange, data: TimeSeriesData[]): string {
  const date = new Date(epochMillis);

  switch (timeRange) {
    case 'week':
      return date.toLocaleDateString('en-US', { weekday: 'short' });

    case 'month':
      return `${date.getMonth() + 1}/${date.getDate()}`;

    case 'year':
      return date.toLocaleDateString('en-US', { month: 'short' });

    case 'all':
      const firstDate = new Date(data[0].timestamp);
      const lastDate = new Date(data[data.length - 1].timestamp);
      const monthsDiff = (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
        (lastDate.getMonth() - firstDate.getMonth());

      if (monthsDiff > 12) {
        return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      } else if (monthsDiff > 1) {
        return date.toLocaleDateString('en-US', { month: 'short' });
      } else {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }

    default:
      return date.toLocaleDateString();
  }
}
