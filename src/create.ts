import fs from "fs";
import sqlite from "sqlite3";
import csvParser from "csv-parser";
import { sequelize } from "./models";
import {
    Book,
    User,
    Section,
    Exercise,
    Practice,
    Artist,
    Song,
} from "./models";

/**
 * Alters/migrates existing tables if they exist, else creates
 * @param seq Sequelize database instance
 */
export async function maybeCreateTables() {
    await sequelize.sync({ alter: true });
}

/**
 * Delete all existing tables, and then create them fresh
 * @param seq database instance
 */
export async function deleteAndCreateTables() {
    await sequelize.sync({ force: true });
}

/**
 * Read data from TSV's into an array
 */
export function readDataFromTSV(filePath: string): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
        const results: any[] = [];

        const stream = fs
            .createReadStream(filePath)
            .pipe(csvParser({ separator: "\t" }));

        stream.on("data", (data) => {
            results.push(data);
        });

        stream.on("end", () => {
            resolve(results);
        });

        stream.on("error", (error) => {
            reject(error);
        });
    });
}

/**
 * Insert the csv-loaded data into the database
 * @param data array of book/section/exercies copying the example CSV
 */
async function fillBookSheetData(data: any[]) {
    for (const row of data) {
        const bookName = row["Book"];
        const sectionName = row["Section"];
        const startExercise = parseInt(row["Start Exercise"]);
        const endExercise = parseInt(row["End Exercise"]);

        // Find or create the book
        const [book] = await Book.findOrCreate({
            where: { name: bookName },
        });

        // Find or create the section within the book
        const [section] = await Section.findOrCreate({
            where: { section: sectionName, book_id: book.id },
        });

        // Create exercises within the section based on the range
        for (
            let exerciseNumber = startExercise;
            exerciseNumber <= endExercise;
            exerciseNumber++
        ) {
            await Exercise.create({
                section_id: section.id,
                exercise: exerciseNumber,
            });
        }
    }
}
async function fillSongData(data: any[], userId: number) {
    for (const row of data) {
        const practiceDate = new Date(row["Date"]);
        const songName = row["Song"];
        const artistName = row["Artist"];
        const notes = row["Notes"];
        let tempo = parseInt(row["Tempo"]);
        if (Number.isNaN(tempo)) {
            tempo = 0;
        }

        // Find or create the artist
        const [artist] = await Artist.findOrCreate({
            where: { name: artistName },
        });

        const [song] = await Song.findOrCreate({
            where: {
                name: songName,
                artist_id: artist.id,
            },
        });

        await Practice.create({
            user_id: userId,
            song_id: song.id,
            done_at: practiceDate,
            tempo: tempo,
            note: notes,
        });
    }
}
async function fillPracticeData(data: any[], userId: number) {
    for (const row of data) {
        const practiceDate = new Date(row["Date"]);
        const bookName = row["Book"];
        const sectionName = row["Section"];
        const exerciseRange = row["Exercise"];
        const tempo = parseInt(row["Tempo"]);
        const notes = row["Notes"];

        // Find or create the book
        const [book] = await Book.findOrCreate({
            where: { name: bookName },
        });

        // Find or create the section within the book
        const [section] = await Section.findOrCreate({
            where: { section: sectionName, book_id: book.id },
        });

        // Split the exercise range and create practices for each exercise
        let startExercise;
        let endExercise;
        if (exerciseRange.includes("-")) {
            [startExercise, endExercise] = exerciseRange.split("-").map(Number);
        } else {
            startExercise = parseInt(exerciseRange);
            endExercise = parseInt(exerciseRange);
        }

        for (
            let exerciseNumber = startExercise;
            exerciseNumber <= endExercise;
            exerciseNumber++
        ) {
            // Find or create the exercise witin the section
            const [exercise] = await Exercise.findOrCreate({
                where: {
                    section_id: section.id,
                    exercise: exerciseNumber,
                },
            });

            // Create the practice record and associate it with the user,
            // exercise, and other data
            await Practice.create({
                user_id: userId,
                exercise_id: exercise.id,
                done_at: practiceDate,
                tempo: tempo,
                note: notes,
            });
        }
    }
}

export async function insertTsvData(
    bookFilePath: string,
    practiceFilePath: string,
    songFilePath: string
) {
    // Everything is me for now, lazy
    const brady = await User.create({
        username: "brady",
        createdAt: new Date(),
    });
    const bookData = await readDataFromTSV(bookFilePath);
    await fillBookSheetData(bookData);

    const practiceData = await readDataFromTSV(practiceFilePath);
    await fillPracticeData(practiceData, brady.id);

    const songData = await readDataFromTSV(songFilePath);
    await fillSongData(songData, brady.id);
}

// Load some dummy data in
export async function createDatabase() {
    const db = new sqlite.Database("database.sqlite");
    await deleteAndCreateTables();
    await insertTsvData(
        "data/book.tsv",
        "data/practices.tsv",
        "data/songs.tsv"
    );
    sequelize.sync();
}

createDatabase();
