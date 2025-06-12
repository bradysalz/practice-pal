import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';

const expo = SQLite.openDatabaseSync('db.db');
export const db = drizzle(expo);
