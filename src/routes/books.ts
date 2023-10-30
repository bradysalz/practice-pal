import { Request, Response, Router } from "express";
import { Sequelize } from "sequelize";
import { Book, Exercise, Section, Practice } from "../models";
import { DisplayRow } from "../routes";

export const bookRouter = Router();

// Count Exercises Grouped by Sections in a Book
const countExercisesBySectionInBook = async (bookId: string) => {
    return await Exercise.findAndCountAll({
        attributes: [
            [
                Sequelize.fn("COUNT", Sequelize.col("Exercises.id")),
                "exerciseCount",
            ],
        ],
        include: [
            {
                model: Section,
                where: { book_id: bookId },
                attributes: ["section"],
                include: [
                    {
                        model: Book,
                        attributes: ["name"],
                    },
                ],
            },
        ],
        group: ["Section.id"], // Group by Section ID
    });
};

// Total Number of Exercises in a Book with at Least One Practice
const getTotalExercisesWithPracticesInBook = async (bookId: string) => {
    const exercisesWithPractices = await Exercise.count({
        distinct: true,
        where: {},
        include: [
            {
                model: Section,
                where: { book_id: bookId },
                include: [
                    {
                        model: Book,
                    },
                    {
                        model: Practice,
                    },
                ],
            },
        ],
    });

    return exercisesWithPractices;
};

/**
 * Show a list of all books and their sections
 */
bookRouter.get("/", async (req: Request, res: Response) => {
    const { rows } = await Book.findAndCountAll({
        raw: true,
        attributes: [
            "Book.*",
            [
                Sequelize.fn("COUNT", Sequelize.col("Sections.id")),
                "SectionCount",
            ],
        ],
        include: {
            model: Section,
        },
        group: ["Book.id"],
    });

    let titles = ["Artist", "Number of Sections"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            // @ts-ignore on table joins
            value: row["name"],
            link: "/books/" + row["id"].toString(),
        },
        {
            // @ts-ignore on table joins
            value: row["SectionCount"],
        },
    ]);

    res.render("./table", {
        sectionTitle: "Books",
        titles: titles,
        data: data,
    });
});

/**
 * Show a list of all exercises in a section
 */
bookRouter.get("/:bookId", async (req: Request, res: Response) => {
    const bookId = req.params["bookId"];
    const { rows } = await Section.findAndCountAll({
        raw: true,
        attributes: [
            "Section.*",
            [Sequelize.fn("COUNT", Sequelize.col("Exercises.id")), "Count"],
        ],
        where: {
            book_id: bookId,
        },
        include: {
            model: Exercise,
            attributes: ["id"],
        },
        group: ["Section.id"],
    });

    let titles = ["Section Title", "Number of Exercises"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            value: row["section"] || "Unnamed Section",
            link: "/sections/" + row["id"].toString(),
        },
        {
            //@ts-ignore on table joins
            value: row["Count"],
        },
    ]);

    const book = await Book.findOne({
        raw: true,
        where: {
            id: bookId,
        },
    });

    // const result =  await countExercisesBySectionInBook(bookId);
    // const ratio =
    //     (await getTotalExercisesWithPracticesInBook(bookId)) / result.count;

    // let percent = Math.floor(100 * ratio);
    let titleStr = `Sections in <a href=/books> ${book?.name} </a>`;

    res.render("./table", {
        sectionTitle: titleStr,
        titles: titles,
        data: data,
        // perecent:
    });
});
