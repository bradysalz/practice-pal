import express from "express";
import { maybeCreateTables, fillBasicData } from "./config/create";
import { router } from "./src/routes";
import { sequelize } from "./src/models";
import { engine } from "express-handlebars";

maybeCreateTables(sequelize).then(() => fillBasicData());

const app = express();

//Sets our app to use the handlebars engine
app.engine("hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");

app.use("/", router);
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
