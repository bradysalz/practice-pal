import { Request, Response, Router } from 'express';

// Routes are constraints that decide when a controller should run, (if the request if for the controller’s path) so we have each controller with its route.
// Create an index.js file inside the routes/ folder that will be the default require file whenever we import the routes subfolder.

export let router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});
