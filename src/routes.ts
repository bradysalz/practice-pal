import { Request, Response, Router } from "express";
import { Practice } from "./models";

export let router = Router();

router.get("/", (req: Request, res: Response) => {
    res.render("home");
});

router.get("/practice", async (req: Request, res: Response) => {
    const pracs = await Practice.findAll({ raw: true });
    res.render("./table", { practices: pracs });
});
