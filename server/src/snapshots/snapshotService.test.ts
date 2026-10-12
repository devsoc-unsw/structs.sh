import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createSnapshot,
  getPublicSnapshot,
  InconsistentSnapshotError,
  InvalidSnapshotError,
} from './snapshotService';
import { insertSnapshot, findPublicSnapshot } from './snapshotRepository';
import type { SnapshotV1 } from './snapshotContract';

const config = vi.hoisted(() => ({
  publicAppOrigin: 'https://structs.example',
  snapshotDefaultTtlDays: undefined as number | undefined,
}));
vi.mock('../config/env', () => ({ env: config }));
vi.mock('./snapshotRepository', () => ({ insertSnapshot: vi.fn(), findPublicSnapshot: vi.fn() }));

const shareId = 'c6bf4c83-7f25-4ae3-8826-f6bff0021173';
const now = new Date('2026-01-01T12:00:00Z');
const snapshot = (): SnapshotV1 => ({
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: [1] } },
  history: {
    initialState: { values: [] },
    operations: [{ name: 'append', arguments: { value: 1 } }],
  },
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(now);
  config.snapshotDefaultTtlDays = undefined;
  vi.mocked(insertSnapshot).mockResolvedValue({
    share_id: shareId,
    created_at: now,
    expires_at: null,
  });
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('createSnapshot', () => {
  it('persists a parsed snapshot and returns public metadata with no default expiry', async () => {
    expect(await createSnapshot({ ...snapshot(), title: ' Example ' })).toEqual({
      shareId,
      shareUrl: `https://structs.example/s/${shareId}`,
      createdAt: now.toISOString(),
      expiresAt: null,
    });
    expect(insertSnapshot).toHaveBeenCalledExactlyOnceWith(
      { ...snapshot(), title: 'Example' },
      { expiresAt: null }
    );
  });

  it('computes expiry from the configured TTL and returns database timestamps', async () => {
    config.snapshotDefaultTtlDays = 2;
    const expiresAt = new Date('2026-01-03T12:00:00Z');
    const createdAt = new Date('2026-01-01T12:00:01Z');
    vi.mocked(insertSnapshot).mockResolvedValue({
      share_id: shareId,
      created_at: createdAt,
      expires_at: expiresAt,
    });
    expect(await createSnapshot(snapshot())).toMatchObject({
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
    expect(insertSnapshot).toHaveBeenCalledWith(snapshot(), { expiresAt });
  });

  it('reports nested validation paths and never writes an invalid request', async () => {
    const input = snapshot();
    input.history.operations = [{ name: 'append', arguments: { value: 100 } }];
    await expect(createSnapshot(input)).rejects.toMatchObject({
      name: 'InvalidSnapshotError',
      fields: [
        expect.objectContaining({
          path: 'history.operations.0.arguments.value',
          message: expect.any(String),
        }),
      ],
    });
    expect(insertSnapshot).not.toHaveBeenCalled();
  });

  it.each([null, {}, { ...snapshot(), schemaVersion: 2 }])(
    'rejects malformed payload %j',
    async (input) => {
      await expect(createSnapshot(input)).rejects.toBeInstanceOf(InvalidSnapshotError);
      expect(insertSnapshot).not.toHaveBeenCalled();
    }
  );

  it('rejects inconsistent history before persistence', async () => {
    const input = snapshot();
    input.structure.state.values = [2];
    await expect(createSnapshot(input)).rejects.toBeInstanceOf(InconsistentSnapshotError);
    expect(insertSnapshot).not.toHaveBeenCalled();
  });

  it('propagates database failures', async () => {
    const error = new Error('database unavailable');
    vi.mocked(insertSnapshot).mockRejectedValue(error);
    await expect(createSnapshot(snapshot())).rejects.toBe(error);
  });
});

describe('getPublicSnapshot', () => {
  it.each(['', 'not-a-uuid', `${shareId}/extra`])(
    'hides malformed IDs without querying: %j',
    async (id) => {
      expect(await getPublicSnapshot(id)).toBeNull();
      expect(findPublicSnapshot).not.toHaveBeenCalled();
    }
  );

  it('returns null for an unavailable public row', async () => {
    vi.mocked(findPublicSnapshot).mockResolvedValue(null);
    expect(await getPublicSnapshot(shareId)).toBeNull();
    expect(findPublicSnapshot).toHaveBeenCalledExactlyOnceWith(shareId);
  });

  it('validates and maps the public database row', async () => {
    vi.mocked(findPublicSnapshot).mockResolvedValue({
      share_id: shareId,
      schema_version: 1,
      renderer_version: 'preset-visualiser-v1',
      title: null,
      structure_type: 'linked-list',
      structure_state: snapshot().structure.state,
      operation_history: snapshot().history,
      created_at: now,
      expires_at: null,
    });
    expect(await getPublicSnapshot(shareId)).toEqual({
      ...snapshot(),
      shareId,
      createdAt: now.toISOString(),
      expiresAt: null,
    });
  });

  it('propagates lookup failures', async () => {
    const error = new Error('query failed');
    vi.mocked(findPublicSnapshot).mockRejectedValue(error);
    await expect(getPublicSnapshot(shareId)).rejects.toBe(error);
  });
});
