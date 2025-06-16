// db/schema.ts
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const CREATE_STATEMENT = [
  sql`--BOOKS
  CREATE TABLE IF NOT EXISTS books(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    author TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--SECTIONS
  CREATE TABLE IF NOT EXISTS sections(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    book_id TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--EXERCISES
  CREATE TABLE IF NOT EXISTS exercises(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    section_id TEXT NOT NULL,
    goal_tempo INTEGER,
    filepath TEXT,
    sort_order INTEGER NOT NULL,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--ARTISTS
  CREATE TABLE IF NOT EXISTS artists(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--SONGS
  CREATE TABLE IF NOT EXISTS songs(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    artist_id TEXT,
    goal_tempo INTEGER,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--SETLISTS
  CREATE TABLE IF NOT EXISTS setlists(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--SETLIST ITEMS
  CREATE TABLE IF NOT EXISTS setlist_items(
    id TEXT PRIMARY KEY,
    setlist_id TEXT NOT NULL,
    type TEXT NOT NULL,
    exercise_id TEXT,
    song_id TEXT,
    sort_order INTEGER NOT NULL,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--SESSIONS
  CREATE TABLE IF NOT EXISTS sessions(
    id TEXT PRIMARY KEY,
    duration INTEGER,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--SESSION ITEMS
  CREATE TABLE IF NOT EXISTS session_items(
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    tempo INTEGER,
    type TEXT NOT NULL,
    song_id TEXT,
    exercise_id TEXT,
    notes TEXT,
    sort_order INTEGER,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_synced INTEGER DEFAULT 0,
    remote_id TEXT
  );`,

  sql`--BOOK WITH COUNTS
  CREATE TABLE IF NOT EXISTS book_with_counts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    author TEXT,
    created_by TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    exercise_count INTEGER NOT NULL
  );`,

  sql`--BOOK PROGRESS HISTORY
  CREATE TABLE IF NOT EXISTS book_progress_history (
    book_id TEXT NOT NULL,
    date TEXT NOT NULL,
    total INTEGER NOT NULL,
    played INTEGER NOT NULL,
    at_goal INTEGER NOT NULL,
    percent_played REAL NOT NULL,
    percent_at_goal REAL NOT NULL
  );`,

  sql`--BOOK STATS
  CREATE TABLE IF NOT EXISTS book_stats (
    book_id TEXT PRIMARY KEY,
    total_exercises INTEGER NOT NULL,
    played_exercises INTEGER NOT NULL,
    goal_reached_exercises INTEGER NOT NULL
  );`,

  sql`--SECTION COUNTS
  CREATE TABLE IF NOT EXISTS section_with_counts (
    id TEXT PRIMARY KEY,
    book_id TEXT NOT NULL,
    name TEXT NOT NULL,
    sort_order INTEGER NOT NULL,
    exercise_count INTEGER
  );`,

  sql`--SECTION PROGRESS HISTORY
  CREATE TABLE IF NOT EXISTS section_progress_history (
    section_id TEXT NOT NULL,
    date TEXT NOT NULL,
    total INTEGER NOT NULL,
    played INTEGER NOT NULL,
    at_goal INTEGER NOT NULL,
    percent_played REAL NOT NULL,
    percent_at_goal REAL NOT NULL
  );`,

  sql`--SECTION STATS
  CREATE TABLE IF NOT EXISTS section_stats (
    section_id TEXT PRIMARY KEY,
    total_exercises INTEGER NOT NULL,
    played_exercises INTEGER NOT NULL,
    goal_reached_exercises INTEGER NOT NULL
  );`,

  sql`--SESSION WITH ITEMS
  CREATE TABLE IF NOT EXISTS session_with_items (
    id TEXT PRIMARY KEY,
    duration INTEGER,
    exercise_count INTEGER NOT NULL,
    song_count INTEGER NOT NULL
  );`,

  sql`--SETLISTS WITH ITEMS
  CREATE TABLE IF NOT EXISTS setlists_with_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    exercise_count INTEGER NOT NULL,
    song_count INTEGER NOT NULL
  );`,
];

export async function runMigrationsIfNeeded(db: ReturnType<typeof drizzle>) {
  for (const statement of CREATE_STATEMENT) {
    await db.run(statement);
  }
}
