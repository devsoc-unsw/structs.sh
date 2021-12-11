import { Router } from 'express';

const healthRouter = Router();

/**
 * @swagger
 * /ping:
 *  get:
 *      summary: health check
 *      description: This is a health check route for checking if backend is alive.
 *      tags:
 *          - Debug
 *      responses:
 *          '200':
 *              description: The server is listening and responding to requests.
 */
healthRouter.get('/ping', (req, res) => {
    const message: string = 'Structs.sh API is alive!';
    console.log(` ➤ ${message}`);
    res.status(200).send(message);
});

export default healthRouter;
