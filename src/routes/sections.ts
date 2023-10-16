import { Request, Response, Router } from "express";
import { Sequelize } from "sequelize";
import { Book, Exercise, Practice, Section } from "../models";
import { DisplayRow } from "../routes";

export const sectionRouter = Router();

/**
 * Show a list of all sections and their exercsies
 */
sectionRouter.get("/", async (req: Request, res: Response) => {
    const { rows } = await Section.findAndCountAll({
        raw: true,
        attributes: [
            "Section.*",
            [Sequelize.fn("COUNT", Sequelize.col("Exercises.id")), "Count"],
        ],
        include: {
            model: Exercise,
        },
        group: ["Section.id"],
    });

    let titles = ["Section", "Number of Exercises"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            // @ts-ignore on table joins
            value: row["section"] || "Unnamed Section",
            link: "/sections/" + row["id"].toString(),
        },
        {
            // @ts-ignore on table joins
            value: row["Count"],
        },
    ]);

    res.render("./table", {
        sectionTitle: "Sections",
        titles: titles,
        data: data,
    });
});

/**
 * Show a list of all exercises in a section
 */
sectionRouter.get("/:sectionId", async (req: Request, res: Response) => {
    const { rows } = await Exercise.findAndCountAll({
        raw: true,
        where: {
            section_id: req.params["sectionId"],
        },
        attributes: [
            "Exercise.*",
            [Sequelize.fn("COUNT", Sequelize.col("Practices.id")), "Count"],
        ],
        include: [
            {
                model: Practice,
                attributes: ["id"],
            },
        ],
        group: ["Exercise.id"],
    });

    let titles = ["Exercise #", "Number of Practices"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            value: row["exercise"]?.toString() || "Unknown Exercise",
            link: "/exercises/" + row["id"].toString(),
        },
        {
            //@ts-ignore on table joins
            value: row["Count"],
        },
    ]);

    const section = await Section.findOne({
        raw: true,
        where: {
            id: req.params["sectionId"],
        },
        include: [
            {
                model: Book,
                attributes: ["id", "name"],
            },
        ],
    });

    //@ts-ignore on table joins
    const bookUrl = section?.["Book.id"];
    //@ts-ignore on table joins
    const bookName = section?.["Book.name"];

    let titleStr =
        "Exercises in " +
        section?.section +
        ` from <a href=/books/${bookUrl}> ${bookName} </a>`;

    res.render("./table", {
        sectionTitle: titleStr,
        titles: titles,
        data: data,
    });
});
