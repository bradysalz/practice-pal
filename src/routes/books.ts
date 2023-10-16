import { Request, Response, Router } from "express";
import { Sequelize } from "sequelize";
import { Book, Exercise, Section } from "../models";
import { DisplayRow } from "../routes";

export const bookRouter = Router();

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
    const { rows } = await Section.findAndCountAll({
        raw: true,
        attributes: [
            "Section.*",
            [Sequelize.fn("COUNT", Sequelize.col("Exercises.id")), "Count"],
        ],
        where: {
            book_id: req.params["bookId"],
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
            id: req.params["bookId"],
        },
    });
    let titleStr = `Sections in <a href=/books> ${book?.name} </a>`;

    res.render("./table", {
        sectionTitle: titleStr,
        titles: titles,
        data: data,
    });
});
