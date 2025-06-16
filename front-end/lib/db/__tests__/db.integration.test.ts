// Jest setup to mock database and helpers
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

// predetermined ids for uuid.v4
const uuidValues = [
  'artist1',
  'book1',
  'section1',
  'exercise1',
  'song1',
  'setlist1',
  'setlistitem1',
  'session1',
  'sessionitem1',
  'sessionitem2',
];

jest.mock('uuid', () => ({ v4: () => uuidValues.shift() }));

jest.mock('expo-sqlite', () => {
  const Database = require('better-sqlite3');
  return {
    openDatabaseSync: (path) => {
      const db = new Database(path);
      return {
        prepareSync: (sql) => {
          const stmt = db.prepare(sql);
          return {
            executeSync: (...params) => {
              const res = stmt.run(...params);
              return {
                changes: res.changes,
                lastInsertRowId: res.lastInsertRowid,
                getAllSync: (...p) => stmt.all(...p),
                getFirstSync: (...p) => stmt.get(...p),
                resetSync: () => {},
              };
            },
            executeForRawResultSync: (...params) => {
              const res = stmt.run(...params);
              return {
                changes: res.changes,
                lastInsertRowId: res.lastInsertRowid,
                getAllSync: (...p) => stmt.all(...p),
                getFirstSync: (...p) => stmt.get(...p),
                resetSync: () => {},
              };
            },
            finalizeSync: () => {},
          };
        },
        execSync: (sql) => db.exec(sql),
        runSync: (sql, ...params) => db.prepare(sql).run(...params),
      };
    },
  };
});

jest.mock('@/lib/db/db', () => {
  const { drizzle } = require('drizzle-orm/expo-sqlite');
  const SQLite = require('expo-sqlite');
  const dbInstance = SQLite.openDatabaseSync(':memory:');
  const db = drizzle(dbInstance);
  return { dbInstance, db };
});

jest.mock('@/lib/supabase/shared', () => ({
  getCurrentUserId: async () => 'test-user',
}));

import { db } from '@/lib/db/db';
import { runMigrationsIfNeeded } from '@/lib/db/migrations';
import {
  insertArtist,
  insertBook,
  insertSection,
  insertExercise,
  insertSong,
  insertSetlist,
  insertSetlistItem,
  insertSession,
  insertSessionItem,
  refreshAllFastViews,
} from '@/lib/db/mutations';
import {
  selectArtists,
  selectExercisesBySection,
  selectExerciseById,
  refreshAndSelectBooks,
  refreshAndSelectSections,
  refreshAndSelectSessions,
  refreshAndSelectRecentSessions,
  refreshAndSelectSessionDetail,
  selectSessionItemsBySession,
  selectSessionItemsByExercise,
  selectSessionItemsBySong,
  selectSessionItemsBySessionIds,
  selectSessionItemsWithNestedBySessionIds,
  refreshAndSelectSetlists,
  selectSetlistItems,
  selectSetlistItemsByIds,
  selectSetlistItemsWithNestedByIds,
  selectSongs,
  refreshAndSelectBookStats,
  refreshAndSelectSectionStats,
  refreshAndSelectBookHistory,
  refreshAndSelectSectionHistory,
} from '@/lib/db/queries';

describe('SQLite integration', () => {
  beforeAll(async () => {
    await runMigrationsIfNeeded(db);
  });

  it('should run through mutations and queries', async () => {
    await insertArtist('Miles');
    await insertBook('Book One', 'Author');
    await insertSection('Section One', 'book1', 0);
    await insertExercise('Exercise One', 'section1', 0, 120);
    await insertSong('Song One', 'artist1', 130);
    await insertSetlist('Setlist One', 'desc');
    await insertSetlistItem('setlist1', 'song', 0, 'song1');
    await insertSession(45);
    await insertSessionItem('session1', 'exercise', 0, 110, undefined, 'exercise1', 'note');
    await insertSessionItem('session1', 'song', 1, 140, 'song1', undefined, 'note2');

    await refreshAllFastViews();

    const artists = await selectArtists();
    expect(artists).toHaveLength(1);
    expect(artists[0].id).toBe('artist1');

    const books = await refreshAndSelectBooks();
    expect(books).toHaveLength(1);
    expect(books[0].id).toBe('book1');
    expect(books[0].exercise_count).toBe(1);

    const sections = await refreshAndSelectSections();
    expect(sections).toHaveLength(1);
    expect(sections[0].id).toBe('section1');
    expect(sections[0].exercise_count).toBe(1);

    const setlists = await refreshAndSelectSetlists();
    expect(setlists).toHaveLength(1);
    expect(setlists[0].id).toBe('setlist1');
    expect(setlists[0].song_count).toBe(1);

    const setlistItems = await selectSetlistItems('setlist1');
    expect(setlistItems).toHaveLength(1);
    expect(setlistItems[0].id).toBe('setlistitem1');

    const sessions = await refreshAndSelectSessions();
    expect(sessions).toHaveLength(1);
    expect(sessions[0].id).toBe('session1');
    expect(sessions[0].exercise_count).toBe(1);
    expect(sessions[0].song_count).toBe(1);

    const sessionItems = await selectSessionItemsBySession('session1');
    expect(sessionItems).toHaveLength(2);
    expect(sessionItems[0].id).toBe('sessionitem1');

    const exercisesBySection = await selectExercisesBySection('section1');
    expect(exercisesBySection).toHaveLength(1);
    expect(exercisesBySection[0].id).toBe('exercise1');

    const exerciseById = await selectExerciseById('exercise1');
    expect(exerciseById).toHaveLength(1);
    expect(exerciseById[0].id).toBe('exercise1');

    const sessionItemsByExercise = await selectSessionItemsByExercise('exercise1');
    expect(sessionItemsByExercise).toHaveLength(1);

    const sessionItemsBySong = await selectSessionItemsBySong('song1');
    expect(sessionItemsBySong).toHaveLength(1);

    const sessionItemsByIds = await selectSessionItemsBySessionIds(['session1']);
    expect(sessionItemsByIds).toHaveLength(2);

    const sessionItemsNested = await selectSessionItemsWithNestedBySessionIds(['session1']);
    expect(sessionItemsNested).toHaveLength(2);

    const sessionDetail = await refreshAndSelectSessionDetail('session1');
    expect(sessionDetail).toHaveLength(1);

    const recentSessions = await refreshAndSelectRecentSessions(5);
    expect(recentSessions).toHaveLength(1);

    const setlistItemsByIds = await selectSetlistItemsByIds(['setlist1']);
    expect(setlistItemsByIds).toHaveLength(1);

    const setlistItemsNested = await selectSetlistItemsWithNestedByIds(['setlist1']);
    expect(setlistItemsNested).toHaveLength(1);

    const songs = await selectSongs();
    expect(songs).toHaveLength(1);

    const bookStats = await refreshAndSelectBookStats('book1');
    expect(bookStats).toHaveLength(1);
    expect(bookStats[0].played_exercises).toBe(1);

    const sectionStats = await refreshAndSelectSectionStats('section1');
    expect(sectionStats).toHaveLength(1);
    expect(sectionStats[0].played_exercises).toBe(1);

    const bookHistory = await refreshAndSelectBookHistory('book1');
    expect(bookHistory).toHaveLength(1);
    expect(bookHistory[0]).toEqual(
      expect.objectContaining({
        book_id: 'book1',
        total: 1,
        played: 1,
        at_goal: 0,
        percent_played: 100,
        percent_at_goal: 0,
      })
    );

    const sectionHistory = await refreshAndSelectSectionHistory('section1');
    expect(sectionHistory).toHaveLength(1);
    expect(sectionHistory[0]).toEqual(
      expect.objectContaining({
        section_id: 'section1',
        total: 1,
        played: 1,
        at_goal: 0,
        percent_played: 100,
        percent_at_goal: 0,
      })
    );
  });
});
