import { Request, Response, Router } from "express";
import { Book, Exercise, Practice, Section } from "./models";

export let router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("home");
});

router.get("/book", async (req: Request, res: Response) => {
    const pracs = await Book.findAll({ raw: true });
    res.render("./book_table", { book: pracs });
});

router.get("/section", async (req: Request, res: Response) => {
    const pracs = await Section.findAll({ raw: true });
    res.render("./section_table", { section: pracs });
});

router.get("/exercise", async (req: Request, res: Response) => {
    const pracs = await Exercise.findAll({ raw: true });
    res.render("./exercise_table", { exercises: pracs });
});

router.get("/practice", async (req: Request, res: Response) => {
    const pracs = await Practice.findAll({ raw: true });
    res.render("./table", { practices: pracs });
});
