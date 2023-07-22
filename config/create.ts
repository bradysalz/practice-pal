import { Sequelize } from "sequelize";
import { Book, User, Section, Exercise, Practice } from "../src/models";

/**
 * Alters/migrates existing tables if they exist, else creates
 * @param seq Sequelize database instance
 */
export async function maybeCreateTables(seq: Sequelize) {
    await seq.sync({ alter: true });
}

/**
 * Delete all existing tables, and then create them fresh
 * @param seq database instance
 */
export async function deleteAndCreateTables(seq: Sequelize) {
    await seq.sync({ force: true });
}

/**
 * Fill the database with some dummy data
 */
export async function fillBasicData() {
    const exampleUserData = [
        {
            username: "brady",
            createdAt: new Date(),
        },
        {
            username: "tom",
            createdAt: new Date(),
        },
        {
            username: "ally",
            createdAt: new Date(),
        },
    ];
    let userEntry: User[] = [];
    for (let user of exampleUserData) {
        const newUser = await User.create(user);
        userEntry.push(newUser);
    }

    const exampleBookData = [
        { name: "Portraits of Rhythm" },
        { name: "Stick Control" },
        { name: "Intermediate Snare Studies" },
    ];
    let bookEntry = [];
    for (let book of exampleBookData) {
        const newBook = await Book.create(book);
        bookEntry.push(newBook);
    }

    const exampleSectionData = [
        {
            book_id: bookEntry[0].id,
            section: "Quarter Notes",
        },
        {
            book_id: bookEntry[0].id,
            section: "Eighth Notes",
        },
        {
            book_id: bookEntry[0].id,
            section: "Triplet Notes",
        },
    ];
    let sectionEntry = [];
    for (let section of exampleSectionData) {
        const newSection = await Section.create(section);
        sectionEntry.push(newSection);
    }

    const exampleExerciseData = [
        {
            book_id: sectionEntry[0].book_id,
            name: "The First One",
        },
        {
            book_id: sectionEntry[0].book_id,
            name: "The Second One",
        },
        {
            book_id: sectionEntry[0].book_id,
            name: "The Third One",
        },
        {
            book_id: bookEntry[1].id,
            section_id: sectionEntry[1].id,
            exercise: 4,
        },
        {
            book_id: bookEntry[1].id,
            section_id: sectionEntry[1].id,
            exercise: 5,
        },
        {
            book_id: bookEntry[1].id,
            section_id: sectionEntry[1].id,
            exercise: 6,
        },
    ];
    let exerciseEntry: Exercise[] = [];
    for (let exercise of exampleExerciseData) {
        const newExercise = await Exercise.create(exercise);
        exerciseEntry.push(newExercise);
    }

    const examplePracticeData = [
        {
            user_id: userEntry[0].id,
            exercise_id: exerciseEntry[0].id,
            done_at: new Date(),
            tempo: 78,
        },
        {
            user_id: userEntry[0].id,
            exercise_id: exerciseEntry[1].id,
            done_at: new Date(),
            tempo: 83,
        },
        {
            user_id: userEntry[0].id,
            exercise_id: exerciseEntry[2].id,
            done_at: new Date(),
            tempo: 94,
        },
        {
            user_id: userEntry[1].id,
            exercise_id: exerciseEntry[3].id,
            done_at: new Date(),
            tempo: 132,
        },
        {
            user_id: userEntry[1].id,
            exercise_id: exerciseEntry[4].id,
            done_at: new Date(),
            tempo: 196,
        },
    ];
    for (let practice of examplePracticeData) {
        await Practice.create(practice);
    }
}
