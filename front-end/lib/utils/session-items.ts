import { SessionItemWithNested } from '@/types/session';

export function isExerciseItem(item: SessionItemWithNested): item is SessionItemWithNested & {
  type: 'exercise';
  exercise: NonNullable<typeof item.exercise>;
} {
  return item.type === 'exercise' && item.exercise !== null;
}

export function isSongItem(
  item: SessionItemWithNested
): item is SessionItemWithNested & { type: 'song'; song: NonNullable<typeof item.song> } {
  return item.type === 'song' && item.song !== null;
}

export function groupSessionItems(items: SessionItemWithNested[]) {
  const exercises = items.filter(isExerciseItem);
  const songs = items.filter(isSongItem);
  return { exercises, songs };
}
