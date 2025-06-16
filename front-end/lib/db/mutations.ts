import { db } from '@/lib/db/db';
import {
  artistTable,
  bookTable,
  exerciseTable,
  sectionTable,
  sessionItemTable,
  sessionTable,
  setlistItemTable,
  setlistTable,
  songTable,
} from '@/lib/db/schema';
import { getCurrentUserId } from '@/lib/supabase/shared';
import { BookUploadData } from '@/types/book';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { refreshBookWithCountsView } from './views/book_counts';
import { refreshBookProgressHistory } from './views/book_history';
import { refreshBookStatsView } from './views/book_stats';
import { refreshSectionWithCountsView } from './views/section_counts';
import { refreshSectionProgressHistory } from './views/section_history';
import { refreshSectionStatsView } from './views/section_stats';
import { refreshSessionWithItemsView } from './views/session_items';
import { refreshSetlistsWithItemsView } from './views/setlist_items';

// Artist mutations
export async function insertArtist(name: string) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  return db.insert(artistTable).values({
    id,
    name,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });
}

export async function updateArtist(id: string, updates: { name?: string }) {
  return db
    .update(artistTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(artistTable.id, id));
}

export async function deleteArtist(id: string) {
  return db.delete(artistTable).where(eq(artistTable.id, id));
}

// Book mutations
export async function insertBook(name: string, author?: string) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  const result = await db.insert(bookTable).values({
    id,
    name,
    author,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });

  await Promise.all([
    refreshBookWithCountsView(),
    refreshBookStatsView({ bookId: id }),
    refreshBookProgressHistory({ bookId: id }),
  ]);

  return result;
}

export async function insertFullBook(bookData: BookUploadData): Promise<string> {
  const userId = await getCurrentUserId();
  const bookId = uuidv4();
  const timestamp = new Date().toISOString();

  // Insert the book
  await db.insert(bookTable).values({
    id: bookId,
    name: bookData.bookName,
    author: bookData.bookAuthor,
    created_by: userId,
    created_at: timestamp,
    updated_at: timestamp,
    is_synced: false,
  });

  // Insert all sections and their exercises
  for (let i = 0; i < bookData.sections.length; i++) {
    const section = bookData.sections[i];
    const sectionId = uuidv4();

    // Insert the section
    await db.insert(sectionTable).values({
      id: sectionId,
      name: section.name,
      book_id: bookId,
      sort_order: i,
      created_by: userId,
      created_at: timestamp,
      updated_at: timestamp,
      is_synced: false,
    });

    // Insert all exercises for this section
    for (let j = 0; j < section.exerciseNames.length; j++) {
      const exerciseId = uuidv4();
      await db.insert(exerciseTable).values({
        id: exerciseId,
        name: section.exerciseNames[j],
        section_id: sectionId,
        sort_order: j,
        created_by: userId,
        created_at: timestamp,
        updated_at: timestamp,
        is_synced: false,
      });
    }
  }

  // Refresh all relevant views
  await Promise.all([
    refreshBookWithCountsView(),
    refreshBookStatsView({ bookId }),
    refreshBookProgressHistory({ bookId }),
    refreshSectionWithCountsView(),
    refreshSectionStatsView(),
    refreshSectionProgressHistory(),
  ]);

  return bookId;
}

export async function updateBook(id: string, updates: { name?: string; author?: string }) {
  const result = await db
    .update(bookTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(bookTable.id, id));

  await refreshBookWithCountsView();

  return result;
}

export async function deleteBook(id: string) {
  const result = await db.delete(bookTable).where(eq(bookTable.id, id));

  await Promise.all([
    refreshBookWithCountsView(),
    refreshBookStatsView({ bookId: id }),
    refreshBookProgressHistory({ bookId: id }),
  ]);

  return result;
}

// Section mutations
export async function insertSection(name: string, bookId: string, sort_order: number) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  const result = await db.insert(sectionTable).values({
    id,
    name,
    book_id: bookId,
    sort_order: sort_order,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });

  await Promise.all([
    refreshBookWithCountsView(),
    refreshSectionWithCountsView(),
    refreshSectionStatsView({ sectionId: id }),
    refreshSectionProgressHistory({ sectionId: id }),
  ]);

  return result;
}

export async function updateSection(
  id: string,
  updates: { name?: string; book_id?: string; sort_order?: number }
) {
  const result = await db
    .update(sectionTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(sectionTable.id, id));

  await Promise.all([
    refreshBookWithCountsView(),
    refreshSectionWithCountsView(),
    refreshSectionStatsView({ sectionId: id }),
    refreshSectionProgressHistory({ sectionId: id }),
  ]);

  return result;
}

export async function deleteSection(id: string) {
  const result = await db.delete(sectionTable).where(eq(sectionTable.id, id));

  await Promise.all([
    refreshBookWithCountsView(),
    refreshSectionWithCountsView(),
    refreshSectionStatsView({ sectionId: id }),
    refreshSectionProgressHistory({ sectionId: id }),
  ]);

  return result;
}

// Exercise mutations
export async function insertExercise(
  name: string,
  sectionId: string,
  sort_order: number,
  goalTempo?: number
) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  const result = await db.insert(exerciseTable).values({
    id,
    name,
    section_id: sectionId,
    sort_order,
    goal_tempo: goalTempo,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });

  await Promise.all([
    refreshBookWithCountsView(),
    refreshSectionWithCountsView(),
    refreshSectionStatsView({ sectionId }),
    refreshSectionProgressHistory({ sectionId }),
  ]);

  return result;
}

export async function updateExercise(
  id: string,
  updates: { name?: string; section_id?: string; order?: number; goal_tempo?: number }
) {
  const result = await db
    .update(exerciseTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(exerciseTable.id, id));

  await Promise.all([
    refreshBookWithCountsView(),
    refreshSectionWithCountsView(),
    refreshSectionStatsView({ sectionId: updates.section_id }),
    refreshSectionProgressHistory({ sectionId: updates.section_id }),
  ]);

  return result;
}

export async function deleteExercise(id: string) {
  const result = await db.delete(exerciseTable).where(eq(exerciseTable.id, id));

  await Promise.all([
    refreshBookWithCountsView(),
    refreshSectionWithCountsView(),
    refreshSectionStatsView(),
    refreshSectionProgressHistory(),
  ]);

  return result;
}

// Song mutations
export async function insertSong(name: string, artistId?: string, goalTempo?: number) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  return db.insert(songTable).values({
    id,
    name,
    artist_id: artistId,
    goal_tempo: goalTempo,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });
}

export async function updateSong(
  id: string,
  updates: { name?: string; artist_id?: string; goal_tempo?: number }
) {
  return db
    .update(songTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(songTable.id, id));
}

export async function deleteSong(id: string) {
  return db.delete(songTable).where(eq(songTable.id, id));
}

// Setlist mutations
export async function insertSetlist(name: string, description?: string) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  const result = await db.insert(setlistTable).values({
    id,
    name,
    description,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });

  await refreshSetlistsWithItemsView();
  return result;
}

export async function updateSetlist(id: string, updates: { name?: string; description?: string }) {
  const result = await db
    .update(setlistTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(setlistTable.id, id));

  await refreshSetlistsWithItemsView();
  return result;
}

export async function deleteSetlist(id: string) {
  const result = await db.delete(setlistTable).where(eq(setlistTable.id, id));

  await refreshSetlistsWithItemsView();
  return result;
}

// SetlistItem mutations
export async function insertSetlistItem(
  setlistId: string,
  type: 'song' | 'exercise',
  sort_order: number,
  songId?: string,
  exerciseId?: string
) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  const result = await db.insert(setlistItemTable).values({
    id,
    setlist_id: setlistId,
    type,
    song_id: songId,
    exercise_id: exerciseId,
    sort_order,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });

  await refreshSetlistsWithItemsView();
  return result;
}

export async function updateSetlistItem(
  id: string,
  updates: {
    setlist_id?: string;
    type?: 'song' | 'exercise';
    song_id?: string;
    exercise_id?: string;
    sort_order?: number;
  }
) {
  const result = await db
    .update(setlistItemTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(setlistItemTable.id, id));

  await refreshSetlistsWithItemsView();
  return result;
}

export async function deleteSetlistItem(id: string) {
  const result = await db.delete(setlistItemTable).where(eq(setlistItemTable.id, id));

  await refreshSetlistsWithItemsView();
  return result;
}

// Session mutations
export async function insertSession(duration: number) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  const result = await db.insert(sessionTable).values({
    id,
    duration,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });

  await refreshSessionWithItemsView();
  return result;
}

export async function updateSession(id: string, updates: { duration: number }) {
  const result = await db
    .update(sessionTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(sessionTable.id, id));

  await refreshSessionWithItemsView();
  return result;
}

export async function deleteSession(id: string) {
  const result = await db.delete(sessionTable).where(eq(sessionTable.id, id));

  await refreshSessionWithItemsView();
  return result;
}

// SessionItem mutations
export async function insertSessionItem(
  sessionId: string,
  type: 'song' | 'exercise',
  sort_order: number,
  tempo?: number,
  songId?: string,
  exerciseId?: string,
  notes?: string
) {
  const userId = await getCurrentUserId();
  const id = uuidv4();

  const result = await db.insert(sessionItemTable).values({
    id,
    session_id: sessionId,
    type,
    tempo,
    song_id: songId,
    exercise_id: exerciseId,
    notes,
    sort_order,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_synced: false,
  });

  await refreshSessionWithItemsView({ sessionId: sessionId });
  return result;
}

export async function updateSessionItem(
  id: string,
  updates: {
    session_id?: string;
    type?: 'song' | 'exercise';
    tempo?: number;
    song_id?: string;
    exercise_id?: string;
    notes?: string;
    sort_order?: number;
  }
) {
  const result = await db
    .update(sessionItemTable)
    .set({
      ...updates,
      updated_at: new Date().toISOString(),
      is_synced: false,
    })
    .where(eq(sessionItemTable.id, id));

  await refreshSessionWithItemsView({ sessionId: updates.session_id });
  return result;
}

export async function deleteSessionItem(id: string) {
  const sessionId = await db
    .select({ session_id: sessionItemTable.session_id })
    .from(sessionItemTable)
    .where(eq(sessionItemTable.id, id))
    .then(([item]) => item?.session_id);
  const result = await db.delete(sessionItemTable).where(eq(sessionItemTable.id, id));

  await refreshSessionWithItemsView({ sessionId });
  return result;
}

export async function refreshAllFastViews() {
  await Promise.all([
    refreshBookWithCountsView(),
    refreshBookStatsView(),
    refreshSectionWithCountsView(),
    refreshSectionStatsView(),
    refreshSessionWithItemsView(),
    refreshSetlistsWithItemsView(),
  ]);
}
