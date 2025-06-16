import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Shared columns for all tables
const baseColumns = {
  created_by: text('created_by').notNull(),
  created_at: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  is_synced: integer('is_synced', { mode: 'boolean' }).default(false),
  remote_id: text('remote_id'), // ID of the record in Supabase, populates when syncing
};

export const bookTable = sqliteTable('books', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  author: text('author'),
  ...baseColumns,
});

export const sectionTable = sqliteTable('sections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  book_id: text('book_id').notNull(),
  sort_order: integer('sort_order').notNull(),
  ...baseColumns,
});

export const exerciseTable = sqliteTable('exercises', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  section_id: text('section_id').notNull(),
  goal_tempo: integer('goal_tempo'),
  filepath: text('filepath'),
  sort_order: integer('sort_order').notNull(),
  ...baseColumns,
});

export const artistTable = sqliteTable('artists', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  ...baseColumns,
});

export const songTable = sqliteTable('songs', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  artist_id: text('artist_id'),
  goal_tempo: integer('goal_tempo'),
  ...baseColumns,
});

export const setlistTable = sqliteTable('setlists', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  ...baseColumns,
});

export const setlistItemTable = sqliteTable('setlist_items', {
  id: text('id').primaryKey(),
  setlist_id: text('setlist_id').notNull(),
  type: text('type').notNull(),
  exercise_id: text('exercise_id'),
  song_id: text('song_id'),
  sort_order: integer('sort_order').notNull(),
  ...baseColumns,
});

export const sessionTable = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  duration: integer('duration'),
  ...baseColumns,
});

export const sessionItemTable = sqliteTable('session_items', {
  id: text('id').primaryKey(),
  session_id: text('session_id').notNull(),
  tempo: integer('tempo'),
  type: text('type').notNull(),
  song_id: text('song_id'),
  exercise_id: text('exercise_id'),
  notes: text('notes'),
  sort_order: integer('sort_order'),
  ...baseColumns,
});
