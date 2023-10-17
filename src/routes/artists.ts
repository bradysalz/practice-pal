import { Request, Response, Router } from "express";
import { Sequelize } from "sequelize";
import { Artist, Song } from "../models";
import { DisplayRow } from "../routes";

export const artistRouter = Router();

/**
 * Show a list of all artists
 */
artistRouter.get("/", async (req: Request, res: Response) => {
    const { rows } = await Artist.findAndCountAll({
        raw: true,
        attributes: [
            "Artist.*",
            [Sequelize.fn("COUNT", Sequelize.col("Songs.id")), "SongCount"],
        ],
        include: {
            model: Song,
        },
        group: ["Artist.id"],
    });

    let titles = ["Artist", "Number of Songs"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            value: row["name"],
            link: "/artists/" + row["id"].toString(),
        },
        {
            // @ts-ignore on table joins
            value: row["SongCount"],
        },
    ]);

    res.render("./table", {
        sectionTitle: "Artists",
        titles: titles,
        data: data,
    });
});

/**
 * Show a list of all songs by an artist
 */
artistRouter.get("/:artistId", async (req: Request, res: Response) => {
    // TODO this should be a Practice query, do a count-by on those
    const rows = await Song.findAll({
        raw: true,
        where: {
            artist_id: req.params["artistId"],
        },
        include: [
            {
                model: Artist,
                attributes: ["id", "name"],
            },
        ],
    });

    let titles = ["Song Title", "Number of Songs"];
    let data: DisplayRow[][] = rows.map((row) => [
        {
            value: row["name"],
            link: "/songs/" + row["id"].toString(),
        },
    ]);

    // TODO refactor to Artist query instead
    // TODO make the artist a link
    res.render("./table", {
        //@ts-ignore on table joins
        sectionTitle: "Songs by " + rows[0]["Artist.name"],
        titles: titles,
        data: data,
    });
});
