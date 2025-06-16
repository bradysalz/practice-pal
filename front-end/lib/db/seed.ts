import { db } from './db';
// @ts-ignore TS2307 - seed_data.ts is for dev only
import { seedSql } from './seed_data';

function stripSqlComments(sql: string): string {
  return (
    sql
      // remove multi-line comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // remove single-line comments
      .replace(/--.*$/gm, '')
      .trim()
  );
}

function convertToIso8601(sql: string): string {
  // Convert timestamps from "YYYY-MM-DD HH:MM:SS.sss+00" to "YYYY-MM-DDTHH:MM:SS.sssZ"
  return sql.replace(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}(?:\.\d+)?)\+00/g, '$1T$2Z');
}

export function seedLocalDb() {
  const cleanedSql = stripSqlComments(seedSql);
  const iso8601Sql = convertToIso8601(cleanedSql);

  const statements = iso8601Sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

  db.transaction(async (tx) => {
    statements.forEach((statement, i) => {
      try {
        tx.run(statement);
      } catch (error) {
        console.error(`Error in seed statement ${i + 1}:`, error);
      }
    });
  });
}
