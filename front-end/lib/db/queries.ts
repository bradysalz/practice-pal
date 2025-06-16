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
import { bookWithCountsView, refreshBookWithCountsView } from '@/lib/db/views/book_counts';
import { bookProgressHistoryView, refreshBookProgressHistory } from '@/lib/db/views/book_history';
import { bookStatsView, refreshBookStatsView } from '@/lib/db/views/book_stats';
import { refreshSectionWithCountsView, sectionWithCountsView } from '@/lib/db/views/section_counts';
import {
  refreshSectionProgressHistory,
  sectionProgressHistoryView,
} from '@/lib/db/views/section_history';
import { refreshSectionStatsView, sectionStatsView } from '@/lib/db/views/section_stats';
import { refreshSessionWithItemsView, sessionWithItemsView } from '@/lib/db/views/session_items';
import { refreshSetlistsWithItemsView, setlistsWithItemsView } from '@/lib/db/views/setlist_items';
import { asc, desc, eq, inArray } from 'drizzle-orm';

// Artist queries
export const selectArtists = () => db.select().from(artistTable).orderBy(artistTable.name);

// Exercise queries
export const selectExercisesBySection = (sectionId: string) =>
  db
    .select()
    .from(exerciseTable)
    .where(eq(exerciseTable.section_id, sectionId))
    .orderBy(exerciseTable.sort_order);

export const selectExerciseById = (id: string) =>
  db.select().from(exerciseTable).where(eq(exerciseTable.id, id));

// Section queries
export const refreshAndSelectSections = async () => {
  await refreshSectionWithCountsView();
  return db.select().from(sectionWithCountsView);
};

export const refreshAndSelectBooks = async () => {
  await refreshBookWithCountsView();
  return db.select().from(bookWithCountsView);
};

// Session item queries
export const selectSessionItemsBySession = (sessionId: string) =>
  db
    .select()
    .from(sessionItemTable)
    .where(eq(sessionItemTable.session_id, sessionId))
    .orderBy(sessionItemTable.sort_order);

export const selectSessionItemsByExercise = (exerciseId: string) =>
  db.select().from(sessionItemTable).where(eq(sessionItemTable.exercise_id, exerciseId));

export const selectSessionItemsBySong = (songId: string) =>
  db.select().from(sessionItemTable).where(eq(sessionItemTable.song_id, songId));

// Session queries
export const refreshAndSelectSessions = async () => {
  await refreshSessionWithItemsView();
  return db
    .select({
      id: sessionWithItemsView.id,
      duration: sessionWithItemsView.duration,
      exercise_count: sessionWithItemsView.exercise_count,
      song_count: sessionWithItemsView.song_count,
      created_at: sessionTable.created_at,
      created_by: sessionTable.created_by,
      updated_at: sessionTable.updated_at,
    })
    .from(sessionWithItemsView)
    .innerJoin(sessionTable, eq(sessionWithItemsView.id, sessionTable.id))
    .orderBy(desc(sessionTable.created_at));
};

export const refreshAndSelectRecentSessions = async (limit: number) => {
  await refreshSessionWithItemsView();
  return db
    .select({
      id: sessionWithItemsView.id,
      duration: sessionWithItemsView.duration,
      exercise_count: sessionWithItemsView.exercise_count,
      song_count: sessionWithItemsView.song_count,
      created_at: sessionTable.created_at,
      created_by: sessionTable.created_by,
      updated_at: sessionTable.updated_at,
    })
    .from(sessionWithItemsView)
    .innerJoin(sessionTable, eq(sessionWithItemsView.id, sessionTable.id))
    .orderBy(desc(sessionTable.created_at))
    .limit(limit);
};

export const refreshAndSelectSessionDetail = async (sessionId: string) => {
  await refreshSessionWithItemsView();
  return db
    .select({
      id: sessionWithItemsView.id,
      duration: sessionWithItemsView.duration,
      exercise_count: sessionWithItemsView.exercise_count,
      song_count: sessionWithItemsView.song_count,
      created_at: sessionTable.created_at,
      created_by: sessionTable.created_by,
      updated_at: sessionTable.updated_at,
    })
    .from(sessionWithItemsView)
    .innerJoin(sessionTable, eq(sessionWithItemsView.id, sessionTable.id))
    .where(eq(sessionWithItemsView.id, sessionId));
};

export const selectSessionItemsBySessionIds = (ids: string[]) =>
  db
    .select()
    .from(sessionItemTable)
    .where(inArray(sessionItemTable.session_id, ids))
    .orderBy(asc(sessionItemTable.sort_order));

export const selectSessionItemsWithNestedBySessionIds = (ids: string[]) =>
  db
    .select({
      // Session item fields
      id: sessionItemTable.id,
      session_id: sessionItemTable.session_id,
      tempo: sessionItemTable.tempo,
      type: sessionItemTable.type,
      song_id: sessionItemTable.song_id,
      exercise_id: sessionItemTable.exercise_id,
      notes: sessionItemTable.notes,
      sort_order: sessionItemTable.sort_order,
      created_by: sessionItemTable.created_by,
      created_at: sessionItemTable.created_at,
      updated_at: sessionItemTable.updated_at,
      // Song fields
      song_name: songTable.name,
      song_goal_tempo: songTable.goal_tempo,
      // Artist fields
      artist_id: artistTable.id,
      artist_name: artistTable.name,
      // Exercise fields
      exercise_name: exerciseTable.name,
      exercise_goal_tempo: exerciseTable.goal_tempo,
      exercise_filepath: exerciseTable.filepath,
      exercise_sort_order: exerciseTable.sort_order,
      // Section fields
      section_id: sectionTable.id,
      section_name: sectionTable.name,
      section_sort_order: sectionTable.sort_order,
      // Book fields
      book_id: bookTable.id,
      book_name: bookTable.name,
      book_author: bookTable.author,
    })
    .from(sessionItemTable)
    .leftJoin(songTable, eq(sessionItemTable.song_id, songTable.id))
    .leftJoin(artistTable, eq(songTable.artist_id, artistTable.id))
    .leftJoin(exerciseTable, eq(sessionItemTable.exercise_id, exerciseTable.id))
    .leftJoin(sectionTable, eq(exerciseTable.section_id, sectionTable.id))
    .leftJoin(bookTable, eq(sectionTable.book_id, bookTable.id))
    .where(inArray(sessionItemTable.session_id, ids))
    .orderBy(asc(sessionItemTable.sort_order));

// Setlist queries
export const refreshAndSelectSetlists = async () => {
  await refreshSetlistsWithItemsView();
  return db
    .select({
      id: setlistTable.id,
      name: setlistTable.name,
      description: setlistTable.description,
      created_at: setlistTable.created_at,
      created_by: setlistTable.created_by,
      updated_at: setlistTable.updated_at,
      song_count: setlistsWithItemsView.song_count,
      exercise_count: setlistsWithItemsView.exercise_count,
    })
    .from(setlistTable)
    .innerJoin(setlistsWithItemsView, eq(setlistTable.id, setlistsWithItemsView.id));
};

export const selectSetlistItemsByIds = (ids: string[]) =>
  db
    .select()
    .from(setlistItemTable)
    .where(inArray(setlistItemTable.setlist_id, ids))
    .orderBy(asc(setlistItemTable.sort_order));

export const selectSetlistItemsWithNestedByIds = (ids: string[]) =>
  db
    .select({
      // Setlist item fields
      id: setlistItemTable.id,
      setlist_id: setlistItemTable.setlist_id,
      type: setlistItemTable.type,
      song_id: setlistItemTable.song_id,
      exercise_id: setlistItemTable.exercise_id,
      sort_order: setlistItemTable.sort_order,
      created_by: setlistItemTable.created_by,
      created_at: setlistItemTable.created_at,
      updated_at: setlistItemTable.updated_at,
      // Song fields
      song_name: songTable.name,
      song_goal_tempo: songTable.goal_tempo,
      // Artist fields
      artist_id: artistTable.id,
      artist_name: artistTable.name,
      // Exercise fields
      exercise_name: exerciseTable.name,
      exercise_goal_tempo: exerciseTable.goal_tempo,
      exercise_filepath: exerciseTable.filepath,
      exercise_sort_order: exerciseTable.sort_order,
      // Section fields
      section_id: sectionTable.id,
      section_name: sectionTable.name,
      section_sort_order: sectionTable.sort_order,
      // Book fields
      book_id: bookTable.id,
      book_name: bookTable.name,
      book_author: bookTable.author,
    })
    .from(setlistItemTable)
    .leftJoin(songTable, eq(setlistItemTable.song_id, songTable.id))
    .leftJoin(artistTable, eq(songTable.artist_id, artistTable.id))
    .leftJoin(exerciseTable, eq(setlistItemTable.exercise_id, exerciseTable.id))
    .leftJoin(sectionTable, eq(exerciseTable.section_id, sectionTable.id))
    .leftJoin(bookTable, eq(sectionTable.book_id, bookTable.id))
    .where(inArray(setlistItemTable.setlist_id, ids))
    .orderBy(asc(setlistItemTable.sort_order));

export const selectSetlistItems = (setlistId: string) =>
  db
    .select()
    .from(setlistItemTable)
    .where(eq(setlistItemTable.setlist_id, setlistId))
    .orderBy(setlistItemTable.sort_order);

// Song queries
export const selectSongs = () => db.select().from(songTable).orderBy(songTable.name);

// Stat queries
export const refreshAndSelectBookStats = async (bookId: string) => {
  await refreshBookStatsView({ bookId });
  return db.select().from(bookStatsView).where(eq(bookStatsView.book_id, bookId));
};

export const refreshAndSelectSectionStats = async (sectionId: string) => {
  await refreshSectionStatsView({ sectionId });
  return db.select().from(sectionStatsView).where(eq(sectionStatsView.section_id, sectionId));
};

export const refreshAndSelectBookHistory = async (bookId: string) => {
  await refreshBookProgressHistory({ bookId });
  return db
    .select()
    .from(bookProgressHistoryView)
    .where(eq(bookProgressHistoryView.book_id, bookId));
};

export const refreshAndSelectSectionHistory = async (sectionId: string) => {
  await refreshSectionProgressHistory({ sectionId });
  return db
    .select()
    .from(sectionProgressHistoryView)
    .where(eq(sectionProgressHistoryView.section_id, sectionId));
};
