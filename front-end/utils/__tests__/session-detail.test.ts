import { DraftSession, DraftSessionItem } from '@/types/session';
import {
  applyTemposToDraft,
  formatTime,
  getItemId,
  getItemName,
  initializeTempos,
  updateDraftItemTempo,
} from '@/utils/session-detail';

const mockItems: DraftSessionItem[] = [
  {
    id: '1',
    type: 'song',
    notes: null,
    tempo: 120,
    song: { id: 'song1', name: 'Song A' },
  },
  {
    id: '2',
    type: 'exercise',
    notes: null,
    tempo: null,
    exercise: {
      id: 'ex1',
      name: 'Ex 1',
      section: { id: 'sec1', name: 'Sec', book: { id: 'book1', name: 'Book' } },
    },
  },
];

const mockDraft: DraftSession = {
  id: 'draft1',
  notes: null,
  duration: null,
  items: mockItems,
};

describe('session-detail utils', () => {
  test('formatTime', () => {
    expect(formatTime(0)).toBe('00:00');
    expect(formatTime(125)).toBe('02:05');
  });

  test('initializeTempos', () => {
    expect(initializeTempos(mockItems)).toEqual({ '1': '120', '2': '' });
  });

  test('updateDraftItemTempo', () => {
    const updated = updateDraftItemTempo(mockItems, '2', '90');
    expect(updated[1].tempo).toBe(90);
  });

  test('applyTemposToDraft', () => {
    const result = applyTemposToDraft(mockDraft, { '1': '110', '2': '80' }, 30);
    expect(result.duration).toBe(30);
    expect(result.items[0].tempo).toBe(110);
    expect(result.items[1].tempo).toBe(80);
  });

  test('getItemId and getItemName', () => {
    expect(getItemId(mockItems[0])).toBe('song1');
    expect(getItemName(mockItems[0])).toBe('Song A');
    expect(getItemId(mockItems[1])).toBe('ex1');
    expect(getItemName(mockItems[1])).toBe('Ex 1');
  });
});
