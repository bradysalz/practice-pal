import { BookWithCountsRow } from '@/types/book';
import { LocalExercise } from '@/types/exercise';
import { SectionWithCountsRow } from '@/types/section';
import { DraftSession } from '@/types/session';
import { DraftSetlist } from '@/types/setlist';
import {
  createSessionExerciseItem,
  createSetlistExerciseItem,
  filterByName,
  findSessionExerciseItemId,
  findSetlistExerciseItemId,
  isExerciseInDraft,
} from '@/utils/books-tab';

describe('books-tab utils', () => {
  test('filterByName filters items by query', () => {
    const items = [{ name: 'Alpha' }, { name: 'Beta' }, { name: 'Gamma' }];
    expect(filterByName(items, 'a')).toEqual([
      { name: 'Alpha' },
      { name: 'Beta' },
      { name: 'Gamma' },
    ]);
  });

  test('isExerciseInDraft detects exercise in session or setlist', () => {
    const session: DraftSession = {
      id: '1',
      duration: 0,
      items: [
        {
          id: 'a',
          type: 'exercise',
          notes: null,
          tempo: null,
          exercise: {
            id: 'ex1',
            name: '',
            section: { id: 's', name: '', book: { id: 'b', name: '' } },
          },
        },
      ],
    };
    const setlist: DraftSetlist = { id: '2', name: null, description: null, items: [] };
    expect(isExerciseInDraft('ex1', 'session', session, null)).toBe(true);
    expect(isExerciseInDraft('ex1', 'setlist', null, setlist)).toBe(false);
  });

  test('create and find session exercise item', () => {
    const book: BookWithCountsRow = {
      id: 'b',
      name: 'Book',
      author: '',
      created_at: '',
      created_by: '',
      updated_at: '',
      exercise_count: 0,
    };
    const section: SectionWithCountsRow = {
      id: 's',
      name: 'Sec',
      book_id: 'b',
      created_at: '',
      created_by: '',
      updated_at: '',
      exercise_count: 0,
      sort_order: 1,
    };
    const exercise: LocalExercise = {
      id: 'ex1',
      name: 'Ex',
      section_id: 's',
      created_at: '',
      updated_at: '',
      filepath: null,
      goal_tempo: null,
      sort_order: 1,
    };
    const draft: DraftSession = { id: '1', duration: 0, items: [] };
    const item = createSessionExerciseItem(exercise, section, book);
    const updated: DraftSession = { ...draft, items: [item] };
    expect(findSessionExerciseItemId(updated, 'ex1')).toBe(item.id);
  });

  test('create and find setlist exercise item', () => {
    const book: BookWithCountsRow = {
      id: 'b',
      name: 'Book',
      author: '',
      created_at: '',
      created_by: '',
      updated_at: '',
      exercise_count: 0,
    };
    const section: SectionWithCountsRow = {
      id: 's',
      name: 'Sec',
      book_id: 'b',
      created_at: '',
      created_by: '',
      updated_at: '',
      exercise_count: 0,
      sort_order: 1,
    };
    const exercise: LocalExercise = {
      id: 'ex1',
      name: 'Ex',
      section_id: 's',
      created_at: '',
      updated_at: '',
      filepath: null,
      goal_tempo: null,
      sort_order: 1,
    };
    const draft: DraftSetlist = { id: '1', name: null, description: null, items: [] };
    const item = createSetlistExerciseItem(exercise, section, book);
    const updated: DraftSetlist = { ...draft, items: [item] };
    expect(findSetlistExerciseItemId(updated, 'ex1')).toBe(item.id);
  });
});
