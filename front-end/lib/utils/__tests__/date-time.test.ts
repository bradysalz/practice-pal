import { formatTimestampToDate, formatToMinutes } from '@/lib/utils/date-time';

describe('formatToMinutes', () => {
  it('rounds up to nearest minute', () => {
    expect(formatToMinutes(170)).toBe(3); // 2.83 rounds to 3
    expect(formatToMinutes(30)).toBe(1); // 0.5 rounds to 1
    expect(formatToMinutes(0)).toBe(0);
  });
});

describe('formatTimestampToDate', () => {
  it('formats ISO timestamp to readable string', () => {
    const input = '2024-06-01T12:00:00Z';
    const result = formatTimestampToDate(input);
    expect(typeof result).toBe('string');
    expect(result).toMatch(/\w+, \w+ \d+/); // loose match like "Saturday, June 1"
  });
});
