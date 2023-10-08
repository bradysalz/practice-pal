import express from "express";
import { insertTsvData, maybeCreateTables } from "./src/create";
import { router } from "./src/routes";
import { sequelize } from "./src/models";
import path = require("path");
import livereload from "livereload";
import connectLiveReload from "connect-livereload";

async function startServer() {
    // Load some dummy data in
    // await maybeCreateTables(sequelize).then(() =>
    //     insertTsvData("data/book.tsv", "data/practices.tsv", "data/songs.tsv")
    // );

    const app = express();
    app.set("view engine", "pug");
    app.set("views", "./views");
    app.use(express.static("public"));

    app.use("/", router);
    app.use(connectLiveReload());

    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, "public"));

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

startServer().catch((error) => {
    console.error("Error starting the server:", error);
});
