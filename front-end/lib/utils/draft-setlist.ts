import { SongRow } from "@/stores/song-store";
import { Exercise } from "@/types/library";
import { DraftSetlist, DraftSetlistItem, SetlistWithItems } from '@/types/setlist';
import { v4 as uuidv4 } from 'uuid';

export function songRowToDraftSetlistItem(song: SongRow, artist?: { id: string; name: string }): DraftSetlistItem {
  return {
    id: uuidv4(),
    type: 'song',
    song: {
      id: song.id,
      name: song.name,
      artist: artist
    }
  };
};

export function exerciseToDraftSetlistItem(
  exercise: Exercise,
  section?: { id: string; name: string },
  book?: { id: string; name: string }
): DraftSetlistItem {
  return {
    id: uuidv4(),
    type: 'exercise',
    exercise: {
      id: exercise.id,
      name: exercise.name,
      section: section ? {
        id: section.id,
        name: section.name,
        book: book
      } : undefined
    }
  };
};


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
