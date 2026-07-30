import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { env } from './config/env';
import { unavailableLegacyMongoRouter } from './routes/unavailableRoutes';
import { workspaceRouter } from './routes/workspaceRoutes';
import { snapshotRouter } from './snapshots/snapshotRoutes';

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.publicAppOrigin,
    })
  );

  app.use(express.json({ limit: '32kb' }));

  app.use(snapshotRouter);
  app.use(workspaceRouter);
  app.use(unavailableLegacyMongoRouter);

  app.use((_request: Request, response: Response) => {
    response.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: 'The requested resource was not found.',
      },
    });
  });

  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction
    ) => {
      // prevent eslint error
      void _next;
      console.error('Unhandled request error', error);

      response.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected server error occurred.',
        },
      });
    }
  );

  return app;
};