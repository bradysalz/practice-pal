import express from "express";
import { initializeAllModels } from "./src/models";
import { mainRouter } from "./src/routes";
import path = require("path");
import livereload from "livereload";
import connectLiveReload from "connect-livereload";

async function startServer() {
    const app = express();
    app.set("view engine", "pug");
    app.set("views", "./views");
    app.use(express.static("public"));

    app.use("/", mainRouter);
    app.use(connectLiveReload());

    const liveReloadServer = livereload.createServer();
    liveReloadServer.watch(path.join(__dirname, "public"));

    initializeAllModels();

    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

startServer().catch((error) => {
    console.error("Error starting the server:", error);
});
