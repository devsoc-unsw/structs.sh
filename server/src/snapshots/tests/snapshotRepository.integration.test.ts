import type { QueryResultRow } from 'pg';
import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
} from 'vitest';
import {
  closeDatabase,
  pool,
} from '../../db/pool';
import {
  SNAPSHOT_SCHEMA_VERSION,
  SUPPORTED_RENDERER_VERSION,
  type SnapshotV1,
} from '../snapshotContract';
import {
  mapPublicSnapshotRow,
} from '../snapshotMapper';
import {
  findPublicSnapshot,
  insertSnapshot,
} from '../snapshotRepository';

const createdShareIds: string[] = [];

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
  title: 'Insert at index 1',
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

interface StoredSnapshotRow
  extends QueryResultRow {
  owner_subject: string | null;
  structure_state: unknown;
  algorithm_name: string | null;
  algorithm_arguments: unknown | null;
  algorithm_input_state: unknown | null;
}

const remember = (shareId: string): void => {
  createdShareIds.push(shareId);
};

afterEach(async () => {
  const shareIds = createdShareIds.splice(0);

  if (shareIds.length === 0) {
    return;
  }

  await pool.query(
    `
      DELETE FROM visualisation_snapshots
      WHERE share_id = ANY($1::uuid[])
    `,
    [shareIds]
  );
});

afterAll(async () => {
  await closeDatabase();
});

describe('snapshotRepository', () => {
  it('inserts a static anonymous snapshot', async () => {
    const created = await insertSnapshot(
      staticSnapshot,
      {
        expiresAt: null,
      }
    );

    remember(created.share_id);

    expect(created.share_id).toMatch(
      /^[0-9a-f-]{36}$/i
    );
    expect(created.created_at).toBeInstanceOf(Date);
    expect(created.expires_at).toBeNull();

    const result =
      await pool.query<StoredSnapshotRow>(
        `
          SELECT
            owner_subject,
            structure_state,
            algorithm_name,
            algorithm_arguments,
            algorithm_input_state
          FROM visualisation_snapshots
          WHERE share_id = $1
        `,
        [created.share_id]
      );

    expect(result.rows[0]).toEqual({
      owner_subject: null,
      structure_state: {
        values: [8, 13, 21],
      },
      algorithm_name: null,
      algorithm_arguments: null,
      algorithm_input_state: null,
    });
  });

  it('inserts and reads an operation snapshot', async () => {
    const created = await insertSnapshot(
      operationSnapshot,
      {
        expiresAt: null,
      }
    );

    remember(created.share_id);

    const row = await findPublicSnapshot(
      created.share_id
    );

    expect(row).not.toBeNull();

    if (row === null) {
      throw new Error(
        'Expected the inserted snapshot to exist.'
      );
    }

    const snapshot = mapPublicSnapshotRow(row);

    expect(snapshot).toMatchObject({
      shareId: created.share_id,
      schemaVersion: 1,
      rendererVersion:
        SUPPORTED_RENDERER_VERSION,
      title: 'Insert at index 1',
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
      expiresAt: null,
    });
  });

  it('returns null for a missing snapshot', async () => {
    const result = await findPublicSnapshot(
      '00000000-0000-4000-8000-000000000000'
    );

    expect(result).toBeNull();
  });

  it('does not return a revoked snapshot', async () => {
    const created = await insertSnapshot(
      staticSnapshot,
      {
        expiresAt: null,
      }
    );

    remember(created.share_id);

    await pool.query(
      `
        UPDATE visualisation_snapshots
        SET revoked_at = now()
        WHERE share_id = $1
      `,
      [created.share_id]
    );

    const result = await findPublicSnapshot(
      created.share_id
    );

    expect(result).toBeNull();
  });

  it('does not return an expired snapshot', async () => {
    const created = await insertSnapshot(
      staticSnapshot,
      {
        expiresAt: null,
      }
    );

    remember(created.share_id);

    /*
     * Keep expires_at later than created_at so the table
     * constraint remains valid, but place both in the past.
     */
    await pool.query(
      `
        UPDATE visualisation_snapshots
        SET
          created_at = now() - interval '2 days',
          expires_at = now() - interval '1 day'
        WHERE share_id = $1
      `,
      [created.share_id]
    );

    const result = await findPublicSnapshot(
      created.share_id
    );

    expect(result).toBeNull();
  });

  it('stores SQL-shaped input as ordinary data', async () => {
    const title =
      'Robert\'); DROP TABLE visualisation_snapshots;--';

    const created = await insertSnapshot(
      {
        ...staticSnapshot,
        title,
      },
      {
        expiresAt: null,
      }
    );

    remember(created.share_id);

    const row = await findPublicSnapshot(
      created.share_id
    );

    expect(row?.title).toBe(title);

    const tableCheck = await pool.query(
      `
        SELECT to_regclass(
          'public.visualisation_snapshots'
        ) AS table_name
      `
    );

    expect(
      tableCheck.rows[0]?.table_name
    ).toBe('visualisation_snapshots');
  });

  it('stores and returns an expiry date', async () => {
    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    );

    const created = await insertSnapshot(
      staticSnapshot,
      {
        expiresAt,
      }
    );

    remember(created.share_id);

    expect(
      created.expires_at?.toISOString()
    ).toBe(expiresAt.toISOString());

    const row = await findPublicSnapshot(
      created.share_id
    );

    expect(
      row?.expires_at?.toISOString()
    ).toBe(expiresAt.toISOString());
  });
});