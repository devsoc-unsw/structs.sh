import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import request from 'supertest';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

const serviceMocks = vi.hoisted(() => {
  class MockInvalidSnapshotError
    extends Error {
    readonly fields: Array<{
      path: string;
      message: string;
    }>;

    constructor(
      fields: Array<{
        path: string;
        message: string;
      }>
    ) {
      super(
        'The snapshot could not be created.'
      );

      this.name = 'InvalidSnapshotError';
      this.fields = fields;
    }
  }

  class MockInconsistentSnapshotError
    extends Error {
    constructor() {
      super(
        'The captured state does not match the algorithm result.'
      );

      this.name =
        'InconsistentSnapshotError';
    }
  }

  return {
    createSnapshot: vi.fn(),
    getPublicSnapshot: vi.fn(),
    InvalidSnapshotError:
      MockInvalidSnapshotError,
    InconsistentSnapshotError:
      MockInconsistentSnapshotError,
  };
});

vi.mock('../snapshotService', () => ({
  createSnapshot:
    serviceMocks.createSnapshot,

  getPublicSnapshot:
    serviceMocks.getPublicSnapshot,

  InvalidSnapshotError:
    serviceMocks.InvalidSnapshotError,

  InconsistentSnapshotError:
    serviceMocks.InconsistentSnapshotError,
}));

import { snapshotRouter } from '../snapshotRoutes';

const SHARE_ID =
  '550e8400-e29b-41d4-a716-446655440000';

const createTestApp = () => {
  const app = express();

  app.use(express.json());
  app.use(snapshotRouter);

  /*
   * This represents the application-level error
   * middleware used for unexpected errors.
   */
  app.use(
    (
      _error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction
    ) => {
      void _next;

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

beforeEach(() => {
  vi.resetAllMocks();
});

describe('POST /api/v1/snapshots', () => {
  it('creates a snapshot', async () => {
    const createdSnapshot = {
      shareId: SHARE_ID,
      shareUrl:
        `https://structs.test/s/${SHARE_ID}`,
      createdAt:
        '2026-08-19T03:10:00.000Z',
      expiresAt: null,
    };

    serviceMocks.createSnapshot
      .mockResolvedValue(createdSnapshot);

    const body = {
      schemaVersion: 1,
      rendererVersion:
        'preset-visualiser-v1',
      structure: {
        type: 'linked-list',
        state: {
          values: [8, 13, 21],
        },
      },
    };

    const response = await request(
      createTestApp()
    )
      .post('/api/v1/snapshots')
      .send(body);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      createdSnapshot
    );

    expect(response.headers.location).toBe(
      `/api/v1/snapshots/${SHARE_ID}`
    );

    expect(
      serviceMocks.createSnapshot
    ).toHaveBeenCalledOnce();

    expect(
      serviceMocks.createSnapshot
    ).toHaveBeenCalledWith(body);
  });

  it('returns 400 for invalid input', async () => {
    serviceMocks.createSnapshot
      .mockRejectedValue(
        new serviceMocks.InvalidSnapshotError([
          {
            path:
              'structure.state.values.0',
            message:
              'Expected a value between 0 and 99.',
          },
        ])
      );

    const response = await request(
      createTestApp()
    )
      .post('/api/v1/snapshots')
      .send({
        structure: {
          state: {
            values: [100],
          },
        },
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: {
        code: 'INVALID_SNAPSHOT',
        message:
          'The snapshot could not be created.',
        fields: [
          {
            path:
              'structure.state.values.0',
            message:
              'Expected a value between 0 and 99.',
          },
        ],
      },
    });
  });

  it('returns 400 for inconsistent input', async () => {
    serviceMocks.createSnapshot
      .mockRejectedValue(
        new serviceMocks
          .InconsistentSnapshotError()
      );

    const response = await request(
      createTestApp()
    )
      .post('/api/v1/snapshots')
      .send({
        schemaVersion: 1,
      });

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: {
        code: 'INVALID_SNAPSHOT',
        message:
          'The snapshot could not be created.',
      },
    });
  });

  it('passes unexpected errors to error middleware', async () => {
    serviceMocks.createSnapshot
      .mockRejectedValue(
        new Error('Database unavailable')
      );

    const response = await request(
      createTestApp()
    )
      .post('/api/v1/snapshots')
      .send({});

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message:
          'An unexpected server error occurred.',
      },
    });
  });
});

describe('GET /api/v1/snapshots/:shareId', () => {
  it('returns an existing snapshot', async () => {
    const snapshot = {
      shareId: SHARE_ID,
      schemaVersion: 1,
      rendererVersion:
        'preset-visualiser-v1',
      structure: {
        type: 'linked-list',
        state: {
          values: [8, 13, 21],
        },
      },
      createdAt:
        '2026-08-19T03:10:00.000Z',
      expiresAt: null,
    };

    serviceMocks.getPublicSnapshot
      .mockResolvedValue(snapshot);

    const response = await request(
      createTestApp()
    ).get(
      `/api/v1/snapshots/${SHARE_ID}`
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual(snapshot);

    expect(
      serviceMocks.getPublicSnapshot
    ).toHaveBeenCalledWith(SHARE_ID);
  });

  it('returns 404 for an unavailable snapshot', async () => {
    serviceMocks.getPublicSnapshot
      .mockResolvedValue(null);

    const response = await request(
      createTestApp()
    ).get(
      `/api/v1/snapshots/${SHARE_ID}`
    );

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: {
        code: 'SNAPSHOT_NOT_FOUND',
        message:
          'The requested snapshot is unavailable.',
      },
    });
  });

  it('returns 404 for a malformed share ID', async () => {
    serviceMocks.getPublicSnapshot
      .mockResolvedValue(null);

    const response = await request(
      createTestApp()
    ).get(
      '/api/v1/snapshots/not-a-uuid'
    );

    expect(response.status).toBe(404);

    expect(
      serviceMocks.getPublicSnapshot
    ).toHaveBeenCalledWith(
      'not-a-uuid'
    );
  });

  it('passes unexpected errors to error middleware', async () => {
    serviceMocks.getPublicSnapshot
      .mockRejectedValue(
        new Error('Database unavailable')
      );

    const response = await request(
      createTestApp()
    ).get(
      `/api/v1/snapshots/${SHARE_ID}`
    );

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message:
          'An unexpected server error occurred.',
      },
    });
  });
});