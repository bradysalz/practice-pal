import { Request, Response, Router } from "express";
import { Artist, Practice, Song } from "../models";
import { DisplayRow } from "../routes";

export const songRouter = Router();

/**
 * Show a list of all songs
 */
songRouter.get("/", async (req: Request, res: Response) => {
    const { rows } = await Song.findAndCountAll({
        raw: true,
        include: [
            {
                model: Artist,
                attributes: ["id", "name"],
            },
        ],
    });

    let titles = ["Song Title", "Artist"];
    let data = rows.map((row) => [
        {
            value: row["name"],
            link: "/songs/" + row["id"].toString(),
        },
        {
            // @ts-ignore on table joins
            value: row["Artist.name"],
            // @ts-ignore on table joins
            link: "/artists/" + row["Artist.id"].toString(),
        },
    ]);

    res.render("./table", {
        sectionTitle: "Songs",
        titles: titles,
        data: data,
    });
});

/**
 * Show a list of all practices on a song
 */
songRouter.get("/:songId", async (req: Request, res: Response) => {
    const rows = await Practice.findAll({
        raw: true,
        where: {
            song_id: req.params["songId"],
        },
        include: [
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
    });

    let titles = ["Date", "Notes"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            //@ts-ignore it gives me a string, not a Date, i dunno
            value: row["done_at"].split(" ")[0],
            link: "/practice-dates/" + row["id"].toString(),
        },
        {
            value: row["note"],
        },
    ]);

    res.render("./table", {
        sectionTitle:
            // TODO refactor to Song/Artist query instead of potiential null
            //@ts-ignore on table joins
            rows[0]["Song.name"] + " by " + rows[0]["Song.Artist.name"],
        titles: titles,
        data: data,
    });
});
