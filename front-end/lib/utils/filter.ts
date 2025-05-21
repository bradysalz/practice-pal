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
