import { BookWithCountsRow } from "@/stores/book-store";
import { SectionWithCountsRow } from "@/stores/section-store";
import { ArtistRow, DraftSession, DraftSessionItem, ExerciseRow, SessionWithItems, SongRow } from "@/types/session";
import { SetlistItemWithNested } from "@/types/setlist";
import { v4 as uuidv4 } from 'uuid';

export function songRowToDraftSessionItem(song: SongRow, artist?: ArtistRow): DraftSessionItem {
  return {
    id: uuidv4(),
    type: 'song',
    notes: null,
    tempo: null,
    song: {
      id: song.id,
      name: song.name,
      artist: artist ? {
        id: artist.id,
        name: artist.name,
      } : undefined,
    }
  };
}

export function exerciseToDraftSessionItem(
  exercise: ExerciseRow,
  section: SectionWithCountsRow,
  book: BookWithCountsRow
): DraftSessionItem {
  return {
    id: uuidv4(),
    type: 'exercise',
    notes: null,
    tempo: exercise.goal_tempo ?? null,
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

export function createNewDraft(): DraftSession {
  return {
    id: uuidv4(),
    notes: null,
    duration: null,
    items: [],
  };
}

export function createDraftFromSession(session: SessionWithItems): DraftSession {
  const draftItems: DraftSessionItem[] = session.session_items.map((item) => {
    const draftItem: DraftSessionItem = {
      id: uuidv4(),
      type: item.type as 'exercise' | 'song',
      notes: item.notes,
      tempo: item.tempo,
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
        section: {
          id: item.exercise.section.id,
          name: item.exercise.section.name,
          book: {
            id: item.exercise.section.book.id,
            name: item.exercise.section.book.name,
          }
        },
      };
    }

    return draftItem;
  });

  return {
    id: session.id,

    notes: session.notes,
    duration: session.duration,
    items: draftItems,
  };
}

export function setlistItemToDraftSessionItem(item: SetlistItemWithNested): DraftSessionItem {
  const draftItem: DraftSessionItem = {
    id: uuidv4(),
    type: item.type as 'exercise' | 'song',
    notes: null,
    tempo: null,
  };

  if (item.type === 'song' && item.song) {
    draftItem.song = {
      id: item.song.id,
      name: item.song.name || '',
      artist: item.song.artist
        ? {
          id: item.song.artist.id,
          name: item.song.artist.name,
        }
        : undefined,
    };
  } else if (item.type === 'exercise' && item.exercise?.section?.book) {
    draftItem.exercise = {
      id: item.exercise.id,
      name: item.exercise.name || '',
      section: {
        id: item.exercise.section.id,
        name: item.exercise.section.name || '',
        book: {
          id: item.exercise.section.book.id,
          name: item.exercise.section.book.name || '',
        }
      }
    };
  }

  return draftItem;
}
