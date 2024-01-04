import { Request, Response, Router } from "express";
import { Sequelize } from "sequelize";
import { Book, Exercise, Section, Practice } from "../models";
import { DisplayRow } from "../routes";

export const bookRouter = Router();

/**
 * Maybe this is too fancy, doesn't work yet
 * @returns 
 */
const getBooksWithCounts = async () => {
    const books = await Book.findAll({
        attributes: [
            'id',
            'name',
            [Sequelize.fn('COUNT', Sequelize.col('Sections.id')), 'TotalSections'],
            [Sequelize.fn('COUNT', Sequelize.col('Sections.Exercises.id')), 'TotalExercises'],
            [Sequelize.fn('COUNT', Sequelize.col('Sections.Exercises.Practices.id')), 'ExercisesWithPractices'],
        ],
        include: [{
            model: Section,
            attributes: ['id'],
            include: [{
                model: Exercise,
                attributes: ['id'],
                include: [{
                    model: Practice,
                    attributes: ['id'],
                }],
            }],
        }],
        group: ['Book.id'],
    });

    return books;
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

    const bbbbooks = await getBooksWithCounts();
    console.log(bbbbooks);

    let titles = ["Book", "Sections"];
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

    res.render("./progress_table", {
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
