import { DraftSession, DraftSessionItem } from '@/types/session';
import { DraftSetlist, DraftSetlistItem } from '@/types/setlist';
import { LocalExercise } from '@/types/exercise';
import { BookWithCountsRow } from '@/types/book';
import { SectionWithCountsRow } from '@/types/section';
import { exerciseToDraftSessionItem } from '@/utils/draft-session';
import { exerciseToDraftSetlistItem } from '@/utils/draft-setlist';

export function filterByName<T extends { name?: string }>(items: T[], query: string): T[] {
  return items.filter(item => item.name?.toLowerCase().includes(query.toLowerCase()));
}

export function isExerciseInDraft(
  exerciseId: string,
  mode: 'session' | 'setlist',
  draftSession: DraftSession | null,
  draftSetlist: DraftSetlist | null,
): boolean {
  if (mode === 'session' && draftSession) {
    return draftSession.items.some(
      (item) => item.type === 'exercise' && item.exercise?.id === exerciseId
    );
  }
  if (mode === 'setlist' && draftSetlist) {
    return draftSetlist.items.some(
      (item) => item.type === 'exercise' && item.exercise?.id === exerciseId
    );
  }
  return false;
}

export function createSessionExerciseItem(
  exercise: LocalExercise,
  section: SectionWithCountsRow,
  book: BookWithCountsRow,
): DraftSessionItem {
  return exerciseToDraftSessionItem(exercise, section, book);
}

export function createSetlistExerciseItem(
  exercise: LocalExercise,
  section: SectionWithCountsRow,
  book: BookWithCountsRow,
): DraftSetlistItem {
  return exerciseToDraftSetlistItem(exercise, section, book);
}

export function findSessionExerciseItemId(
  draft: DraftSession,
  exerciseId: string,
): string | undefined {
  const item = draft.items.find(
    (i) => i.type === 'exercise' && i.exercise?.id === exerciseId,
  );
  return item?.id;
}

export function findSetlistExerciseItemId(
  draft: DraftSetlist,
  exerciseId: string,
): string | undefined {
  const item = draft.items.find(
    (i) => i.type === 'exercise' && i.exercise?.id === exerciseId,
  );
  return item?.id;
}
