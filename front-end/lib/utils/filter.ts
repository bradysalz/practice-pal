import { SessionItemWithNested } from '@/types/session';

// Shared constraint to ensure the item has the necessary shape
type HasTypeAndPossiblyExerciseOrSong = {
  type: string;
  exercise?: any;
  song?: any;
};

export function isExerciseItem<T extends HasTypeAndPossiblyExerciseOrSong>(
  item: T
): item is T & { type: 'exercise'; exercise: NonNullable<T['exercise']> } {
  return item.type === 'exercise' && item.exercise != null;
}

export function isSongItem<T extends HasTypeAndPossiblyExerciseOrSong>(
  item: T
): item is T & { type: 'song'; song: NonNullable<T['song']> } {
  return item.type === 'song' && item.song != null;
}

export function groupItems<T extends HasTypeAndPossiblyExerciseOrSong>(items: T[]) {
  const exercises = items.filter(isExerciseItem);
  const songs = items.filter(isSongItem);
  return { exercises, songs };
}

export function getBookAndSongNamesFromSession(items: SessionItemWithNested[]) {
  const bookMap = new Map<string, string>();
  const songMap = new Map<string, string>();

  for (const item of items) {
    const book = item.exercise?.section?.book;
    if (book && book.id && book.name && !bookMap.has(book.id)) {
      bookMap.set(book.id, book.name);
    }

    const song = item.song;
    if (song && song.id && song.name && !songMap.has(song.id)) {
      songMap.set(song.id, song.name);
    }
  }

  return { bookMap, songMap };
}
