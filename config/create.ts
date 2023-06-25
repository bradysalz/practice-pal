import { Sequelize } from 'sequelize';


/**
 * Alters/migrates existing tables if they exist, else creates
 * @param db sqlite3 database instance
 */
export async function maybeCreateTables(seq: Sequelize) {
    await seq.sync({ alter: true });
};

/**
 * Delete all existing tables, and then create them fresh
 * @param seq database instance
 */
export async function deleteAndCreateTables(seq: Sequelize) {
    await seq.sync({ force: true });
};
