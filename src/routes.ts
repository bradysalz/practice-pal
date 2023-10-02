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

export let router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("./layouts/index.pug");
});

/** Catches /table/<id>
 * Useful mostly for debugging tables. It's nice to have this quick debug view
 * to see what you're calling and working with.
 */
router.get("/table/:id", async (req: Request, res: Response) => {
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
    res.render("./table", { fields: fields, rows: data });
});
