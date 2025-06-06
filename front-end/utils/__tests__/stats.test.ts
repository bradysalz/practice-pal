import { ItemTempoPoint } from '@/types/stats';
import { formatDateByRange } from '../stats';

describe('formatDateByRange', () => {
  // Helper function to create test data
  const createTestData = (startDate: string, endDate: string): ItemTempoPoint[] => [
    { timestamp: new Date(startDate).getTime(), tempo: 100 },
    { timestamp: new Date(endDate).getTime(), tempo: 120 }
  ];

  describe('week range', () => {
    it('should format date as short weekday', () => {
      const date = new Date('2024-05-01T12:00:00Z').getTime();
      const result = formatDateByRange(date, 'week', []);
      // May 1, 2024 is a Wednesday
      expect(result).toBe('Wed');
    });
  });

  describe('month range', () => {
    it('should format date as M/D', () => {
      const date = new Date('2024-05-15T12:00:00Z').getTime();
      const result = formatDateByRange(date, 'month', []);
      expect(result).toBe('5/15');
    });
  });

  describe('year range', () => {
    it('should format date as short month', () => {
      const date = new Date('2024-05-01T12:00:00Z').getTime();
      const result = formatDateByRange(date, 'year', []);
      expect(result).toBe('May');
    });
  });

  describe('all range', () => {
    it('should show month/year when range > 12 months', () => {
      const data = createTestData('2023-01-01T00:00:00Z', '2024-12-31T00:00:00Z');
      const date = new Date('2024-05-01T12:00:00Z').getTime();
      const result = formatDateByRange(date, 'all', data);
      expect(result).toBe('May 24');
    });

    it('should show only month when range is 1-12 months', () => {
      const data = createTestData('2024-01-01T00:00:00Z', '2024-06-30T00:00:00Z');
      const date = new Date('2024-05-01T12:00:00Z').getTime();
      const result = formatDateByRange(date, 'all', data);
      expect(result).toBe('May');
    });

    it('should show M/D when range is <= 1 month', () => {
      const data = createTestData('2024-05-01T00:00:00Z', '2024-05-15T00:00:00Z');
      const date = new Date('2024-05-10T12:00:00Z').getTime();
      const result = formatDateByRange(date, 'all', data);
      expect(result).toBe('5/10');
    });
  });
});
