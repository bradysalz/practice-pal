import { ItemProgressPoint } from '@/types/stats';
import { filterProgressData } from '@/utils/item-progress';

describe('item-progress utils', () => {
  test('filterProgressData filters and sorts data', () => {
    const now = Date.now();
    const data: ItemProgressPoint[] = [
      { timestamp: now - 1000 * 60 * 60 * 24 * 2, played: 1, at_goal: 0, percent_played: 0, percent_at_goal: 0, total: 1 },
      { timestamp: now - 1000 * 60 * 60 * 24 * 10, played: 2, at_goal: 1, percent_played: 0, percent_at_goal: 0, total: 2 },
    ];
    const { filteredData: filtered } = filterProgressData(data, 'week', now);
    expect(filtered.length).toBe(1);
  });
});
