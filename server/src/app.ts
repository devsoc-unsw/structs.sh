import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { env } from './config/env';
import {
  unavailableLegacyMongoRouter,
} from './routes/unavailableRoutes';
import {
  workspaceRouter,
} from './routes/workspaceRoutes';
import {
  snapshotRouter,
} from './snapshots/snapshotRoutes';

interface BodyParserError extends Error {
  status?: unknown;
  type?: unknown;
}

const isBodyParserError = (
  error: unknown,
  status: number,
  type: string
): error is BodyParserError => {
  if (!(error instanceof Error)) {
    return false;
  }

  const bodyParserError =
    error as BodyParserError;

  return (
    bodyParserError.status === status &&
    bodyParserError.type === type
  );
};

export const JSON_BODY_LIMIT_BYTES = 1024 * 1024;

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.publicAppOrigin,
    })
  );

  app.use(
    express.json({
      limit: JSON_BODY_LIMIT_BYTES,
    })
  );

  app.use(snapshotRouter);
  app.use(workspaceRouter);
  app.use(unavailableLegacyMongoRouter);

  app.use(
    (
      _request: Request,
      response: Response
    ) => {
      response.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message:
            'The requested resource was not found.',
        },
      });
    }
  );

  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction
    ) => {
      void _next;

      if (
        isBodyParserError(
          error,
          400,
          'entity.parse.failed'
        )
      ) {
        response.status(400).json({
          error: {
            code: 'INVALID_JSON',
            message:
              'The request body must contain valid JSON.',
          },
        });

        return;
      }

      if (
        isBodyParserError(
          error,
          413,
          'entity.too.large'
        )
      ) {
        response.status(413).json({
          error: {
            code: 'PAYLOAD_TOO_LARGE',
            message:
              'The request body exceeds the allowed size.',
          },
        });

        return;
      }

      console.error(
        'Unhandled request error',
        error
      );

      response.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message:
            'An unexpected server error occurred.',
        },
      });
    }
  );

  return app;
};