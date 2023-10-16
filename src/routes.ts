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

export let mainRouter = Router();

export interface DisplayRow {
    /** Displayed value in each row */
    value: string;
    /** Redirect link, if needed */
    link?: string;
}

mainRouter.use("/artists", artistRouter);
mainRouter.use("/songs", songRouter);

mainRouter.get("/", (req: Request, res: Response) => {
    res.render("./layouts/index.pug");
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
    // let fields = Object.keys(Section.getAttributes());
    let fields = ["id", "section", "Book.name"];
    console.log(data);
    res.render("./generic_table", { fields: fields, rows: data });
});

mainRouter.get("/plot", async (req: Request, res: Response) => {
    res.render("./chart");
});
