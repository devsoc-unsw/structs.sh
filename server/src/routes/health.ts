import { Router } from 'express';

const healthRouter = Router();

/**
 * Health check route, just to check if backend is alive.
 */
healthRouter.get('/', (req, res) => {
    res.status(200).json({ status: 200, statusText: 'Structs.sh is alive!' });
});

export default healthRouter;
