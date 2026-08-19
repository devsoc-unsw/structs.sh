import {
  Router,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from 'express';
import {
  createSnapshot,
  getPublicSnapshot,
  InconsistentSnapshotError,
  InvalidSnapshotError,
} from './snapshotService';

type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => Promise<void>;

const asyncHandler = (
  handler: AsyncRequestHandler
): RequestHandler =>
  (request, response, next) => {
    void handler(
      request,
      response,
      next
    ).catch(next);
  };

export const snapshotRouter = Router();

snapshotRouter.post(
  '/api/v1/snapshots',
  asyncHandler(async (request, response) => {
    const created = await createSnapshot(
      request.body
    );

    response
      .location(
        `/api/v1/snapshots/${created.shareId}`
      )
      .status(201)
      .json(created);
  })
);

snapshotRouter.get(
  '/api/v1/snapshots/:shareId',
  asyncHandler(async (request, response) => {
    const snapshot = await getPublicSnapshot(
      request.params.shareId
    );

    if (snapshot === null) {
      response.status(404).json({
        error: {
          code: 'SNAPSHOT_NOT_FOUND',
          message:
            'The requested snapshot is unavailable.',
        },
      });

      return;
    }

    response
      .status(200)
      .json(snapshot);
  })
);

/*
 * Translate only expected errors from snapshot service.
 * Unexpected errors continue to the 500 handler at app level.
 */
snapshotRouter.use(
  (
    error: unknown,
    _request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (error instanceof InvalidSnapshotError) {
      response.status(400).json({
        error: {
          code: 'INVALID_SNAPSHOT',
          message: error.message,
          fields: error.fields,
        },
      });

      return;
    }

    if (
      error instanceof InconsistentSnapshotError
    ) {
      response.status(400).json({
        error: {
          code: 'INVALID_SNAPSHOT',
          message:
            'The snapshot could not be created.',
        },
      });

      return;
    }

    next(error);
  }
);