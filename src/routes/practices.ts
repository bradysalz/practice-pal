import { Request, Response, Router } from "express";
import { Artist, Book, Exercise, Practice, Section, Song } from "../models";
import { DisplayRow } from "../routes";
import { Sequelize } from "sequelize";

export const practiceRouter = Router();

/**
 * Collapse a Practice into one DisplayRow
 * @param row A Practice with full joins on it
 * Lazy on the typing, sorry not sorry
 */
function displayRowFromPractice(row: any): DisplayRow[] {
    let display: DisplayRow[] = [
        {
            value: row["done_at"],
            link: "/practices/dates/" + row["done_at"],
        },
    ];

    let val: DisplayRow;
    if (row["exercise_id"] === null) {
        // This is a Song
        val = {
            value: `${row["Song.name"]} by ${row["Song.Artist.name"]}`,
            link: `/songs/${row["Song.id"]}`,
        };
    } else {
        // This is an Exercise
        val = {
            value:
                `#${row["Exercise.exercise"]} from ` +
                `${row["Exercise.Section.section"]} in ` +
                `${row["Exercise.Section.Book.name"]}`,
        };
    }
    display.push(val);
    display.push({
        value: row["tempo"]?.toString() || "",
    });
    display.push({
        value: row["note"],
    });
    return display;
}

practiceRouter.get("/", async (req: Request, res: Response) => {
    const rows = await Practice.findAll({
        raw: true,
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
            {
                model: Song,
                attributes: ["id", "name"],
                include: [
                    {
                        model: Artist,
                        attributes: ["id", "name"],
                    },
                ],
            },
        ],
        order: [["done_at", "DESC"]],
        limit: 40,
    });

    let titles = ["Date", "Piece", "Tempo", "Notes"];
    let data: DisplayRow[][] = rows.map((row) => displayRowFromPractice(row));
    res.render("./table", {
        sectionTitle: "Recent Practices",
        titles: titles,
        data: data,
    });
});

practiceRouter.get("/dates/:date", async (req: Request, res: Response) => {
    const rows = await Practice.findAll({
        raw: true,
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
            {
                model: Song,
                attributes: ["id", "name"],
                include: [
                    {
                        model: Artist,
                        attributes: ["id", "name"],
                    },
                ],
            },
        ],
        where: {
            done_at: req.params["date"],
        },
    });
    console.log(rows);
    let titles = ["Date", "Piece", "Tempo", "Notes"];
    let data: DisplayRow[][] = rows.map((row) => displayRowFromPractice(row));
    res.render("./table", {
        sectionTitle: `${req.params["date"]}`,
        titles: titles,
        data: data,
    });
});
