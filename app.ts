import express from 'express';
import { maybeCreateTables } from './config/create';
import { router } from './src/routes';
import { database } from './src/models';



maybeCreateTables(database);

const app = express();
app.use("/", router);
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
