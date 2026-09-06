import { Router } from 'express';
import { checkDatabase } from '../db/pool';

export const healthRouter = Router();

healthRouter.get('/health/live', (_request, response) => {
    response.set('Cache-Control', 'no-store').json({ status: 'ok' });
});

healthRouter.get('/health/ready', async (_request, response) => {
    response.set('Cache-Control', 'no-store');
    try {
        await checkDatabase();
        response.json({ status: 'ready' });
    } catch {
        response.status(503).json({ status: 'not_ready' });
    }
});
