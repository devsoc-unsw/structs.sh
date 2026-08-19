import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

/*
 * vi.hoisted makes these values available when Vitest
 * evaluates the mocked modules.
 */
const mockEnv = vi.hoisted(() => ({
  databaseUrl:
    'postgresql://unused:unused@localhost/unused',
  publicAppOrigin: 'https://structs.test',
  databasePoolMax: 10,
  snapshotDefaultTtlDays:
    undefined as number | undefined,
  port: 8001,
}));

const repositoryMocks = vi.hoisted(() => ({
  insertSnapshot: vi.fn(),
  findPublicSnapshot: vi.fn(),
}));

const mapperMocks = vi.hoisted(() => ({
  mapPublicSnapshotRow: vi.fn(),
}));

vi.mock('../../config/env', () => ({
  env: mockEnv,
}));

vi.mock('../snapshotRepository', () => ({
  insertSnapshot:
    repositoryMocks.insertSnapshot,
  findPublicSnapshot:
    repositoryMocks.findPublicSnapshot,
}));

vi.mock('../snapshotMapper', () => ({
  mapPublicSnapshotRow:
    mapperMocks.mapPublicSnapshotRow,
}));

import {
  SNAPSHOT_SCHEMA_VERSION,
  SUPPORTED_RENDERER_VERSION,
  type PublicSnapshotV1,
  type SnapshotV1,
} from '../snapshotContract';
import type {
  PublicSnapshotRow,
} from '../snapshotMapper';
import {
  createSnapshot,
  getPublicSnapshot,
  InconsistentSnapshotError,
  InvalidSnapshotError,
} from '../snapshotService';

const SHARE_ID =
  '550e8400-e29b-41d4-a716-446655440000';

const CREATED_AT =
  new Date('2026-08-19T03:10:00.000Z');

const staticSnapshot: SnapshotV1 = {
  schemaVersion: SNAPSHOT_SCHEMA_VERSION,
  rendererVersion: SUPPORTED_RENDERER_VERSION,
  structure: {
    type: 'linked-list',
    state: {
      values: [8, 13, 21],
    },
  },
};

const operationSnapshot: SnapshotV1 = {
  schemaVersion: SNAPSHOT_SCHEMA_VERSION,
  rendererVersion: SUPPORTED_RENDERER_VERSION,
  structure: {
    type: 'linked-list',
    state: {
      values: [8, 5, 13, 21],
    },
  },
  algorithm: {
    name: 'insert',
    arguments: {
      value: 5,
      index: 1,
    },
    inputState: {
      values: [8, 13, 21],
    },
  },
};

const publicRow: PublicSnapshotRow = {
  share_id: SHARE_ID,
  schema_version: 1,
  renderer_version:
    SUPPORTED_RENDERER_VERSION,
  title: null,
  structure_type: 'linked-list',
  structure_state: {
    values: [8, 13, 21],
  },
  algorithm_name: null,
  algorithm_arguments: null,
  algorithm_input_state: null,
  algorithm_state: null,
  playback_state: null,
  created_at: CREATED_AT,
  expires_at: null,
};

const publicSnapshot: PublicSnapshotV1 = {
  shareId: SHARE_ID,
  schemaVersion: SNAPSHOT_SCHEMA_VERSION,
  rendererVersion: SUPPORTED_RENDERER_VERSION,
  structure: {
    type: 'linked-list',
    state: {
      values: [8, 13, 21],
    },
  },
  createdAt: CREATED_AT.toISOString(),
  expiresAt: null,
};

beforeEach(() => {
  vi.resetAllMocks();

  mockEnv.publicAppOrigin =
    'https://structs.test';

  mockEnv.snapshotDefaultTtlDays =
    undefined;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createSnapshot', () => {
  it('creates a valid static snapshot', async () => {
    repositoryMocks.insertSnapshot
      .mockResolvedValue({
        share_id: SHARE_ID,
        created_at: CREATED_AT,
        expires_at: null,
      });

    const result = await createSnapshot(
      staticSnapshot
    );

    expect(
      repositoryMocks.insertSnapshot
    ).toHaveBeenCalledWith(
      staticSnapshot,
      {
        expiresAt: null,
      }
    );

    expect(result).toEqual({
      shareId: SHARE_ID,
      shareUrl:
        `https://structs.test/s/${SHARE_ID}`,
      createdAt: CREATED_AT.toISOString(),
      expiresAt: null,
    });
  });

  it('creates a consistent operation snapshot', async () => {
    repositoryMocks.insertSnapshot
      .mockResolvedValue({
        share_id: SHARE_ID,
        created_at: CREATED_AT,
        expires_at: null,
      });

    await createSnapshot(operationSnapshot);

    expect(
      repositoryMocks.insertSnapshot
    ).toHaveBeenCalledWith(
      operationSnapshot,
      {
        expiresAt: null,
      }
    );
  });

  it('rejects invalid input before querying PostgreSQL', async () => {
    const invalidInput = {
      ...staticSnapshot,
      structure: {
        type: 'linked-list',
        state: {
          values: [100],
        },
      },
    };

    await expect(
      createSnapshot(invalidInput)
    ).rejects.toBeInstanceOf(
      InvalidSnapshotError
    );

    expect(
      repositoryMocks.insertSnapshot
    ).not.toHaveBeenCalled();
  });

  it('returns field details for invalid input', async () => {
    const invalidInput = {
      ...staticSnapshot,
      structure: {
        type: 'linked-list',
        state: {
          values: [100],
        },
      },
    };

    try {
      await createSnapshot(invalidInput);

      throw new Error(
        'Expected createSnapshot to fail.'
      );
    } catch (error) {
      expect(error).toBeInstanceOf(
        InvalidSnapshotError
      );

      if (
        error instanceof InvalidSnapshotError
      ) {
        expect(error.fields).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              path:
                'structure.state.values.0',
            }),
          ])
        );
      }
    }
  });

  it('rejects an inconsistent operation', async () => {
    const inconsistentSnapshot = {
      ...staticSnapshot,
      structure: {
        type: 'linked-list',
        state: {
          values: [1, 2, 99],
        },
      },
      algorithm: {
        name: 'append',
        arguments: {
          value: 3,
        },
        inputState: {
          values: [1, 2],
        },
      },
    };

    await expect(
      createSnapshot(inconsistentSnapshot)
    ).rejects.toBeInstanceOf(
      InconsistentSnapshotError
    );

    expect(
      repositoryMocks.insertSnapshot
    ).not.toHaveBeenCalled();
  });

  it('calculates expiration from configured TTL', async () => {
    vi.useFakeTimers();

    const now =
      new Date('2026-08-19T00:00:00.000Z');

    vi.setSystemTime(now);

    mockEnv.snapshotDefaultTtlDays = 30;

    const expectedExpiry = new Date(
      now.getTime() +
        30 * 24 * 60 * 60 * 1000
    );

    repositoryMocks.insertSnapshot
      .mockResolvedValue({
        share_id: SHARE_ID,
        created_at: now,
        expires_at: expectedExpiry,
      });

    const result = await createSnapshot(
      staticSnapshot
    );

    expect(
      repositoryMocks.insertSnapshot
    ).toHaveBeenCalledWith(
      staticSnapshot,
      {
        expiresAt: expectedExpiry,
      }
    );

    expect(result.expiresAt).toBe(
      expectedExpiry.toISOString()
    );
  });

  it('uses the trusted configured origin', async () => {
    mockEnv.publicAppOrigin =
      'https://example.test';

    repositoryMocks.insertSnapshot
      .mockResolvedValue({
        share_id: SHARE_ID,
        created_at: CREATED_AT,
        expires_at: null,
      });

    const result = await createSnapshot(
      staticSnapshot
    );

    expect(result.shareUrl).toBe(
      `https://example.test/s/${SHARE_ID}`
    );
  });

  it('does not hide repository errors', async () => {
    const databaseError =
      new Error('Database unavailable');

    repositoryMocks.insertSnapshot
      .mockRejectedValue(databaseError);

    await expect(
      createSnapshot(staticSnapshot)
    ).rejects.toBe(databaseError);
  });
});

describe('getPublicSnapshot', () => {
  it('returns null for a malformed UUID', async () => {
    const result = await getPublicSnapshot(
      'not-a-uuid'
    );

    expect(result).toBeNull();

    expect(
      repositoryMocks.findPublicSnapshot
    ).not.toHaveBeenCalled();
  });

  it('returns null for an unknown UUID', async () => {
    repositoryMocks.findPublicSnapshot
      .mockResolvedValue(null);

    const result = await getPublicSnapshot(
      SHARE_ID
    );

    expect(result).toBeNull();

    expect(
      repositoryMocks.findPublicSnapshot
    ).toHaveBeenCalledWith(SHARE_ID);
  });

  it('maps and returns an existing snapshot', async () => {
    repositoryMocks.findPublicSnapshot
      .mockResolvedValue(publicRow);

    mapperMocks.mapPublicSnapshotRow
      .mockReturnValue(publicSnapshot);

    const result = await getPublicSnapshot(
      SHARE_ID
    );

    expect(
      mapperMocks.mapPublicSnapshotRow
    ).toHaveBeenCalledWith(publicRow);

    expect(result).toEqual(publicSnapshot);
  });

  it('does not hide repository errors', async () => {
    const databaseError =
      new Error('Database unavailable');

    repositoryMocks.findPublicSnapshot
      .mockRejectedValue(databaseError);

    await expect(
      getPublicSnapshot(SHARE_ID)
    ).rejects.toBe(databaseError);
  });

  it('does not hide mapper errors', async () => {
    const mappingError =
      new Error('Corrupt database row');

    repositoryMocks.findPublicSnapshot
      .mockResolvedValue(publicRow);

    mapperMocks.mapPublicSnapshotRow
      .mockImplementation(() => {
        throw mappingError;
      });

    await expect(
      getPublicSnapshot(SHARE_ID)
    ).rejects.toBe(mappingError);
  });
});