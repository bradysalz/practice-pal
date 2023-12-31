import { Request, Response, Router } from "express";
import {
    Artist,
    Book,
    Exercise,
    Practice,
    Section,
    Song,
    User,
} from "./models";
import { artistRouter } from "./routes/artists";
import { songRouter } from "./routes/songs";
import { bookRouter } from "./routes/books";
import { sectionRouter } from "./routes/sections";
import { exerciseRouter } from "./routes/exercises";
import { practiceRouter } from "./routes/practices";

export let mainRouter = Router();

export interface DisplayRow {
    /** Displayed value in each row */
    value: string;
    /** Redirect link, if needed */
    link?: string;
}

mainRouter.use("/artists", artistRouter);
mainRouter.use("/songs", songRouter);
mainRouter.use("/books", bookRouter);
mainRouter.use("/sections", sectionRouter);
mainRouter.use("/exercises", exerciseRouter);
mainRouter.use("/practices", practiceRouter);

mainRouter.get("/", async (req: Request, res: Response) => {
    const numExercises = await Practice.findAndCountAll({
        include: [
            {
                model: Exercise,
                required: true
            },
        ]
    });
    const numSongs = await Practice.findAndCountAll({
        include: [
            {
                model: Song,
                required: true
            },
        ]
    });
    const numDays = await Practice.findAndCountAll({
        distinct: true,
        group: ["Practice.done_at"]
    });

    res.render("./home.pug", {
        numExercises: numExercises.count,
        numSongs: numSongs.count,
        numDays: numDays.count.length,
    });
});

/** Catches /table/<id>
 * Useful mostly for debugging tables. It's nice to have this quick debug view
 * to see what you're calling and working with.
 */
mainRouter.get("/table/:id", async (req: Request, res: Response) => {
    let model: any;
    switch (req.params.id) {
        case "users":
            model = User;
            break;
        case "books":
            model = Book;
            break;
        case "exercises":
            model = Exercise;
            break;
        case "practices":
            model = Practice;
            break;
        case "sections":
            model = Section;
            break;
        case "artists":
            model = Artist;
            break;
        case "songs":
            model = Song;
            break;
        default:
            model = Practice;
    }
    // this weird line is needed because Tyepscript can't infer they're all
    // compatible Model types for some reason
    const data = await (model as any).findAll({ raw: true });
    const fields = Object.keys(model.getAttributes());
    res.render("./generic_table", { fields: fields, rows: data });
});

mainRouter.get("/sections", async (req: Request, res: Response) => {
    const data = await Section.findAll({
        raw: true,
        include: [
            {
                model: Book,
                attributes: ["name"],
            },
        ],
    });
    let fields = ["id", "section", "Book.name"];
    res.render("./generic_table", { fields: fields, rows: data });
});

mainRouter.get("/plot", async (req: Request, res: Response) => {
    res.render("./chart");
});
