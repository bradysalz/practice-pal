import { DraftSetlistItem } from '@/types/setlist';

export function mapSetlistItemToRow(
  item: DraftSetlistItem,
  index: number,
  setlistId: string,
  timestamp: string
) {
  return {
    id: item.id,
    setlist_id: setlistId,
    type: item.type,
    song_id: item.type === 'song' ? item.song?.id : null,
    exercise_id: item.type === 'exercise' ? item.exercise?.id : null,
    position: index,
    updated_at: timestamp,
    created_at: timestamp,
  };
}
