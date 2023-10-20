import { Request, Response, Router } from "express";
import { Book, Exercise, Practice, Section } from "../models";
import { DisplayRow } from "../routes";
import { Sequelize } from "sequelize";

export const exerciseRouter = Router();

/**
 * Show a list of 100 random exercises
 * The full list is too long to show, woudld be dumb and crash the browser
 */
exerciseRouter.get("/", async (req: Request, res: Response) => {
    const rows = await Exercise.findAll({
        raw: true,
        include: [
            {
                model: Section,
                attributes: ["id", "section"],
                include: [
                    {
                        model: Book,
                        attributes: ["id", "name"],
                    },
                ],
            },
        ],
        order: [Sequelize.literal("random()")],
        limit: 40,
    });

    let titles = ["Exercise", "Section", "Book"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            value: row["exercise"],
            link: "/exercises/" + row["id"].toString(),
        },
        {
            // @ts-ignore on table joins
            value: row["Section.section"],
            // @ts-ignore on table joins
            link: "/sections/" + row["Section.id"].toString(),
        },
        {
            // @ts-ignore on table joins
            value: row["Section.Book.name"],
            // @ts-ignore on table joins
            link: "/books/" + row["Section.Book.name"].toString(),
        },
    ]);

    res.render("./table", {
        sectionTitle: "Exercises (40 Random Ones)",
        titles: titles,
        data: data,
    });
});

/**
 * Show a list of all practices on an exercise
 */
exerciseRouter.get("/:exerciseId", async (req: Request, res: Response) => {
    const rows = await Practice.findAll({
        raw: true,
        where: {
            exercise_id: req.params["exerciseId"],
        },
        include: [
            {
                model: Exercise,
                attributes: ["id", "exercise"],
                include: [
                    {
                        model: Section,
                        attributes: ["id", "section"],
                        include: [
                            {
                                model: Book,
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
            },
        ],
        order: [["done_at", "DESC"]],
    });

    let titles = ["Date", "Tempo", "Notes"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            //@ts-ignore it gives me a string, not a Date, i dunno
            value: row["done_at"].toString(),
            link: "/practices/dates/" + row["done_at"].toString(),
        },
        {
            value: row["tempo"]?.toString() || "",
        },
        {
            value: row["note"],
        },
    ]);

    // TODO this crashes with no practices, refactor to an Exercise query
    const r = rows[0];
    const titleStr =
        //@ts-ignore on table joins
        `Exercise ${r["Exercise.exercise"]}` +
        //@ts-ignore on table joins
        ` from <a href=/sections/${r["Exercise.Section.id"]}}> ${r["Exercise.Section.section"]}</a>` +
        //@ts-ignore on table joins
        ` in <a href=/books/${r["Exercise.Section.Book.id"]}}> ${r["Exercise.Section.Book.name"]}</a>`;

    res.render("./table", {
        sectionTitle: titleStr,
        titles: titles,
        data: data,
    });
});
