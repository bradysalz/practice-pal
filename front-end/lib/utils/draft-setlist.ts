import { BookWithCountsRow } from "@/stores/book-store";
import { SectionWithCountsRow } from "@/stores/section-store";
import { ArtistRow, ExerciseRow, SongRow } from "@/types/session";
import { DraftSetlist, DraftSetlistItem, SetlistItemWithNested, SetlistWithItems } from '@/types/setlist';
import { v4 as uuidv4 } from 'uuid';

export function setlistItemToDraftSetlistItem(item: SetlistItemWithNested): DraftSetlistItem {
  if (item.song && item.song_id) {
    return {
      id: item.id,
      type: 'song' as const,
      song: {
        id: item.song_id,
        name: item.song.name ?? '',
      },
    };
  } else if (item.exercise && item.exercise.section?.book && item.exercise_id) {
    return {
      id: item.id,
      type: 'exercise' as const,
      exercise: {
        id: item.exercise_id,
        name: item.exercise.name ?? '',
        section: {
          id: item.exercise.section.id.toString(),
          name: item.exercise.section.name ?? '',
          book: {
            id: item.exercise.section.book.id,
            name: item.exercise.section.book.name ?? '',
          },
        },
      },
    };
  }
  // Should not be possible to reach
  throw new Error('Invalid setlist item');
}

export function songRowToDraftSetlistItem(song: SongRow, artist?: ArtistRow): DraftSetlistItem {
  return {
    id: uuidv4(),
    type: 'song',
    song: {
      id: song.id,
      name: song.name,
      artist: artist
    }
  };
}

export function exerciseToDraftSetlistItem(
  exercise: ExerciseRow,
  section: SectionWithCountsRow,
  book: BookWithCountsRow
): DraftSetlistItem {
  return {
    id: uuidv4(),
    type: 'exercise',
    exercise: {
      id: exercise.id,
      name: exercise.name,
      section: {
        id: section.id,
        name: section.name,
        book: {
          id: book.id,
          name: book.name,
        }
      }
    }
  };
}

export function createNewDraft(): DraftSetlist {
  return {
    id: uuidv4(),
    name: null,
    description: null,
    items: [],
  };
}

export function createDraftFromSetlist(setlist: SetlistWithItems): DraftSetlist {
  const draftItems: DraftSetlistItem[] = setlist.setlist_items.map((item) => {
    const draftItem: DraftSetlistItem = {
      id: uuidv4(),
      type: item.type as 'exercise' | 'song',
    };

    if (item.type === 'song' && item.song) {
      draftItem.song = {
        id: item.song.id,
        name: item.song.name,
        artist: item.song.artist
          ? {
            id: item.song.artist.id,
            name: item.song.artist.name,
          }
          : undefined,
      };
    } else if (item.type === 'exercise' && item.exercise) {
      draftItem.exercise = {
        id: item.exercise.id,
        name: item.exercise.name,
        section: item.exercise.section
          ? {
            id: item.exercise.section.id,
            name: item.exercise.section.name,
            book: item.exercise.section.book
              ? {
                id: item.exercise.section.book.id,
                name: item.exercise.section.book.name,
              }
              : undefined,
          }
          : undefined,
      };
    }

    return draftItem;
  });

  return {
    id: setlist.id,
    name: setlist.name,
    description: setlist.description,
    items: draftItems,
  };
}
