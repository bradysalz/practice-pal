import { ArtistRow } from '@/types/artist';
import { BookRow } from '@/types/book';
import { ExerciseRow } from '@/types/exercise';
import { SectionRow } from '@/types/section';
import { DraftSetlistItem, SetlistItemWithNested } from '@/types/setlist';
import { SongRow } from '@/types/song';

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

export type ExerciseWithSetlist = ExerciseRow & {
  section: SectionRow & {
    book: BookRow | null;
  };
};

type SectionWithExercises = SectionRow & {
  book: BookRow | null;
  exercises: ExerciseWithSetlist[];
};

type BookWithSections = BookRow & {
  sections: SectionWithExercises[];
};

type SongWithSetlist = SongRow & {
  artist: ArtistRow | null;
};

type ArtistWithSongs = ArtistRow & {
  songs: SongWithSetlist[];
};

export function groupSongsByArtistFromSetlist(items: SetlistItemWithNested[]): ArtistWithSongs[] {
  const artistsMap = new Map<string, ArtistWithSongs>();

  items.forEach((item) => {
    if (!item.song || !item.song.artist) return;

    const artist = item.song.artist;
    const song = item.song;

    // Get or create artist entry
    let artistEntry = artistsMap.get(artist.id);
    if (!artistEntry) {
      artistEntry = { ...artist, songs: [] };
      artistsMap.set(artist.id, artistEntry);
    }

    // Add song (avoid duplicates)
    const alreadyExists = artistEntry.songs.some((s) => s.id === song.id);
    if (!alreadyExists) {
      artistEntry.songs.push({ ...song, artist });
    }
  });

  return Array.from(artistsMap.values());
}

export function groupExercisesByBookAndSectionFromSetlist(
  items: SetlistItemWithNested[]
): BookWithSections[] {
  const booksMap = new Map<string, BookWithSections>();

  items.forEach((item) => {
    // Skip partially formed items
    if (!item.exercise || !item.exercise.section || !item.exercise.section.book) return;

    const book = item.exercise.section.book;
    const section = item.exercise.section;
    const exercise = item.exercise;

    // Get or create book
    let bookEntry = booksMap.get(book.id);
    if (!bookEntry) {
      bookEntry = { ...book, sections: [] };
      booksMap.set(book.id, bookEntry);
    }

    // Get or create section
    let sectionEntry = bookEntry.sections.find((s) => s.id === section.id);
    if (!sectionEntry) {
      sectionEntry = { ...section, book, exercises: [] };
      bookEntry.sections.push(sectionEntry);
    }

    // Add exercise
    if (!sectionEntry.exercises.find((e) => e.id === exercise.id)) {
      sectionEntry.exercises.push({
        ...exercise,
        section: { ...section, book },
      });
    }
  });

  return Array.from(booksMap.values());
}
