import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

// Create a single shared database connection
export const dbInstance = SQLite.openDatabaseSync('practicepal.db');
export const db = drizzle(dbInstance);
