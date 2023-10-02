import express from "express";
import { insertCsvData, maybeCreateTables } from "./config/create";
import { router } from "./src/routes";
import { engine } from "express-handlebars";
import { sequelize } from "./src/models";

async function startServer() {
    await maybeCreateTables(sequelize).then(() =>
        insertCsvData("data/book.csv", "data/practices.csv", "data/songs.csv")
    );

    const app = express();

    //Sets our app to use the handlebars engine
    app.engine("hbs", engine({ extname: ".hbs" }));
    app.set("view engine", ".hbs");

    app.use("/", router);
    app.listen(3000, () => {
        console.log("Server running on port 3000");
    });
}

startServer().catch((error) => {
    console.error("Error starting the server:", error);
});
