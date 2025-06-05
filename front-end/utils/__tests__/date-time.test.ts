import { TimeRange } from '@/types/stats';
import { calculateCutoffDate, formatDate, formatTimestampToDate, formatToMinutes, isValidDate } from '@/utils/date-time';

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

describe('calculateCutoffDate', () => {
  beforeEach(() => {
    // Mock the current date to ensure consistent test results
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each<[TimeRange, string]>([
    ['week', '2024-01-08T12:00:00.000Z'],
    ['month', '2023-12-15T12:00:00.000Z'],
    ['year', '2023-01-15T12:00:00.000Z'],
    ['all', '1970-01-01T00:00:00.000Z'],
  ])('should calculate correct cutoff date for %s range', (range, expected) => {
    const result = calculateCutoffDate(range);
    expect(result.toISOString()).toBe(expected);
  });
});

describe('formatDate', () => {
  it('should format valid date strings correctly', () => {
    expect(formatDate('2024-01-15T12:00:00Z')).toBe('2024-01-15');
    expect(formatDate('2023-12-31')).toBe('2023-12-31');
  });

  it('should handle invalid date strings', () => {
    expect(formatDate('invalid')).toBe('Invalid Date');
    expect(formatDate('')).toBe('Invalid Date');
  });
});

describe('isValidDate', () => {
  it('should return true for valid date strings', () => {
    expect(isValidDate('2024-01-15T12:00:00Z')).toBe(true);
    expect(isValidDate('2023-12-31')).toBe(true);
  });

  it('should return false for invalid date strings', () => {
    expect(isValidDate('invalid')).toBe(false);
    expect(isValidDate('')).toBe(false);
  });
});
