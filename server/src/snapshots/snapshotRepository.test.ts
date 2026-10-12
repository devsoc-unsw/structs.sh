import { beforeEach, expect, it, vi } from 'vitest';
import { pool } from '../db/pool';
import { findPublicSnapshot, insertSnapshot } from './snapshotRepository';
import type { SnapshotV1 } from './snapshotContract';

vi.mock('../db/pool', () => ({ pool: { query: vi.fn() } }));
const query = vi.mocked(pool.query);
const snapshot: SnapshotV1 = {
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: [] } },
  history: { initialState: { values: [] }, operations: [] },
};
beforeEach(() => vi.resetAllMocks());

it.each([undefined, "Example's list"])(
  'inserts JSON and optional title %j as bound parameters',
  async (title) => {
    const created = { share_id: 'id', created_at: new Date(), expires_at: null };
    query.mockResolvedValue({ rows: [created] } as never);
    const expiresAt = new Date('2026-02-01T00:00:00Z');
    expect(await insertSnapshot({ ...snapshot, title }, { expiresAt })).toBe(created);
    expect(query).toHaveBeenCalledExactlyOnceWith({
      text: expect.stringContaining('INSERT INTO visualisation_snapshots'),
      values: [
        1,
        'preset-visualiser-v1',
        title ?? null,
        'linked-list',
        '{"values":[]}',
        '{"initialState":{"values":[]},"operations":[]}',
        expiresAt,
      ],
    });
  }
);

it('fails when an insert unexpectedly returns no row', async () => {
  query.mockResolvedValue({ rows: [] } as never);
  await expect(insertSnapshot(snapshot, { expiresAt: null })).rejects.toThrow(
    'Snapshot insert returned no database row.'
  );
});

it('reads only the public view and binds the share ID', async () => {
  const row = { share_id: 'public-id' };
  query.mockResolvedValue({ rows: [row] } as never);
  expect(await findPublicSnapshot('public-id')).toBe(row);
  expect(query).toHaveBeenCalledExactlyOnceWith({
    text: expect.stringContaining('FROM public_visualisation_snapshots\n  WHERE share_id = $1'),
    values: ['public-id'],
  });
});

it('returns null when the public view has no matching snapshot', async () => {
  query.mockResolvedValue({ rows: [] } as never);
  expect(await findPublicSnapshot('missing')).toBeNull();
});

it('propagates database errors from writes and reads', async () => {
  const error = new Error('connection lost');
  query.mockRejectedValue(error);
  await expect(insertSnapshot(snapshot, { expiresAt: null })).rejects.toBe(error);
  await expect(findPublicSnapshot('id')).rejects.toBe(error);
});
