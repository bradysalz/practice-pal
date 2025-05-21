import {
  BookRow,
  ExerciseRow,
  SectionRow,
  SessionItemRow,
  SessionItemWithNested,
} from '@/types/session';

export type ExerciseWithSession = ExerciseRow & {
  session: SessionItemRow;
};

type SectionWithExercises = SectionRow & {
  exercises: ExerciseWithSession[];
};

type BookWithSections = BookRow & {
  sections: SectionWithExercises[];
};

export function groupExercisesByBookAndSectionWithSession(
  items: SessionItemWithNested[]
): BookWithSections[] {
  const booksMap = new Map<string, BookWithSections>();

  items.forEach((item) => {
    // Skip partially formed items
    if (!item.exercise || !item.exercise.section || !item.exercise.section.book) return;

    const book = item.exercise.section.book;
    const section = item.exercise.section;
    const exercise = item.exercise;
    const session = item; // contains session_id, tempo, notes, etc.

    // Get or create book
    let bookEntry = booksMap.get(book.id);
    if (!bookEntry) {
      bookEntry = { ...book, sections: [] };
      booksMap.set(book.id, bookEntry);
    }

    // Get or create section
    let sectionEntry = bookEntry.sections.find((s) => s.id === section.id);
    if (!sectionEntry) {
      sectionEntry = { ...section, exercises: [] };
      bookEntry.sections.push(sectionEntry);
    }

    // Add exercise with session
    if (!sectionEntry.exercises.find((e) => e.id === exercise.id && e.session.id === session.id)) {
      sectionEntry.exercises.push({
        ...exercise,
        session: session,
      });
    }
  });

  return Array.from(booksMap.values());
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
