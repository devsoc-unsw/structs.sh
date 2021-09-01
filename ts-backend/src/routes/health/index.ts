import { Router } from 'express';

const healthRouter = Router();

/**
 * Health check route - unprotected, just to check if backend is alive.
 */
healthRouter.get('/health-check', (req, res) => {
  res
    .status(200)
    .json({ status: 200, statusText: 'Backend is alive and running well...' });
});

export default healthRouter;
