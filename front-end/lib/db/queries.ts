import { db } from '@/lib/db/db';
import { asc, desc, eq, inArray } from 'drizzle-orm';
import {
  artistTable,
  exerciseTable,
  sessionItemTable,
  sessionTable,
  setlistItemTable,
  setlistTable,
  songTable,
} from '@/lib/db/schema';
import {
  sectionWithCountsView,
  refreshSectionWithCountsView,
} from '@/lib/db/views/section_counts';
import {
  bookWithCountsView,
  refreshBookWithCountsView,
} from '@/lib/db/views/book_counts';
import {
  sessionWithItemsView,
  refreshSessionWithItemsView,
} from '@/lib/db/views/session_items';
import {
  setlistsWithItemsView,
  refreshSetlistsWithItemsView,
} from '@/lib/db/views/setlist_items';
import {
  bookStatsView,
  refreshBookStatsView,
} from '@/lib/db/views/book_stats';
import {
  sectionStatsView,
  refreshSectionStatsView,
} from '@/lib/db/views/section_stats';
import {
  bookProgressHistoryView,
  refreshBookProgressHistory,
} from '@/lib/db/views/book_history';
import {
  sectionProgressHistoryView,
  refreshSectionProgressHistory,
} from '@/lib/db/views/section_history';

// Artist queries
export const selectArtists = () =>
  db.select().from(artistTable).orderBy(artistTable.name);

// Exercise queries
export const selectExercisesBySection = (sectionId: string) =>
  db
    .select()
    .from(exerciseTable)
    .where(eq(exerciseTable.section_id, sectionId))
    .orderBy(exerciseTable.order);

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
    .orderBy(sessionItemTable.position);

export const selectSessionItemsByExercise = (exerciseId: string) =>
  db
    .select()
    .from(sessionItemTable)
    .where(eq(sessionItemTable.exercise_id, exerciseId));

export const selectSessionItemsBySong = (songId: string) =>
  db
    .select()
    .from(sessionItemTable)
    .where(eq(sessionItemTable.song_id, songId));

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
    .orderBy(asc(sessionItemTable.position));

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
    .orderBy(asc(setlistItemTable.position));

export const selectSetlistItems = (setlistId: string) =>
  db
    .select()
    .from(setlistItemTable)
    .where(eq(setlistItemTable.setlist_id, setlistId))
    .orderBy(setlistItemTable.position);

// Song queries
export const selectSongs = () =>
  db.select().from(songTable).orderBy(songTable.name);

// Stat queries
export const refreshAndSelectBookStats = async (bookId: string) => {
  await refreshBookStatsView({ bookId });
  return db
    .select()
    .from(bookStatsView)
    .where(eq(bookStatsView.book_id, bookId));
};

export const refreshAndSelectSectionStats = async (sectionId: string) => {
  await refreshSectionStatsView({ sectionId });
  return db
    .select()
    .from(sectionStatsView)
    .where(eq(sectionStatsView.section_id, sectionId));
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
