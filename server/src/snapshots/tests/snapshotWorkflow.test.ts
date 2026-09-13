import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Exercise the real app, contract, consistency, service, repository and mapper.
// Only the environment and PostgreSQL transport are replaced.
const database = vi.hoisted(() => ({ query: vi.fn() }));

vi.mock('../../db/pool', () => ({ pool: database }));
vi.mock('../../config/env', () => ({
  env: {
    publicAppOrigin: 'https://structs.test',
    snapshotDefaultTtlDays: undefined,
  },
}));

import { createApp } from '../../app';
import type { SnapshotV1 } from '../snapshotContract';
import { insertSnapshot } from '../snapshotRepository';

const shareId = '550e8400-e29b-41d4-a716-446655440000';
const createdAt = new Date('2026-09-13T00:00:00.000Z');

const makeSnapshot = (): SnapshotV1 => ({
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: [3, 8, 5] } },
  history: {
    initialState: { values: [8] },
    operations: [
      { name: 'append', arguments: { value: 13 } },
      { name: 'prepend', arguments: { value: 3 } },
      { name: 'insert', arguments: { index: 2, value: 5 } },
      { name: 'search', arguments: { value: 8 } },
      { name: 'delete', arguments: { index: 3 } },
    ],
  },
});

beforeEach(() => vi.resetAllMocks());

describe('snapshot history request workflow', () => {
  it.each([false, true])('round-trips history (static: %s) through the SQL boundary', async (isStatic) => {
    const snapshot = makeSnapshot();
    if (isStatic) {
      snapshot.history = {
        initialState: structuredClone(snapshot.structure.state),
        operations: [],
      };
    }
    database.query.mockResolvedValueOnce({ rows: [{
      share_id: shareId, created_at: createdAt, expires_at: null,
    }] });
    const app = createApp();
    const created = await request(app).post('/api/v1/snapshots').send(snapshot);
    expect(created.status).toBe(201);
    expect(created.headers.location).toBe(`/api/v1/snapshots/${shareId}`);
    expect(created.body).toEqual({
      shareId,
      shareUrl: `https://structs.test/s/${shareId}`,
      createdAt: createdAt.toISOString(),
      expiresAt: null,
    });

    const [insert] = database.query.mock.calls[0];
    expect(insert.text).toContain('operation_history');
    expect(insert.text).not.toMatch(/algorithm_|playback_state/);
    expect(insert.values).toEqual([
      1, 'preset-visualiser-v1', null, 'linked-list',
      JSON.stringify(snapshot.structure.state),
      expect.any(String), null,
    ]);
    // JSON object key order is not significant; operation array order is.
    expect(JSON.parse(insert.values[5])).toEqual(snapshot.history);
    database.query.mockResolvedValueOnce({ rows: [{
      share_id: shareId,
      schema_version: insert.values[0],
      renderer_version: insert.values[1],
      title: insert.values[2],
      structure_type: insert.values[3],
      structure_state: JSON.parse(insert.values[4]),
      operation_history: JSON.parse(insert.values[5]),
      created_at: createdAt,
      expires_at: null,
    }] });
    const read = await request(app).get(created.headers.location);
    expect(read.status).toBe(200);
    expect(read.body).toEqual({
      ...snapshot, shareId, createdAt: createdAt.toISOString(), expiresAt: null,
    });
    expect(database.query).toHaveBeenCalledTimes(2);
    expect(database.query.mock.calls[1][0]).toEqual({
      text: expect.stringContaining('FROM public_visualisation_snapshots'),
      values: [shareId],
    });
  });

  it.each([
    ['missing history', (s: SnapshotV1) => {
      const { history, ...legacy } = s;
      void history;
      return legacy;
    }],
    ['legacy algorithm', (s: SnapshotV1) => ({
      ...s, algorithm: { name: 'append', arguments: { value: 5 } },
    })],
    ['incorrect final state', (s: SnapshotV1) => ({
      ...s, structure: { type: 'linked-list', state: { values: [99] } },
    })],
    ['too many operations', (s: SnapshotV1) => ({
      ...s, history: { ...s.history, operations: Array.from({ length: 151 },
        () => ({ name: 'search', arguments: { value: 8 } })) },
    })],
    ['intermediate overflow', (s: SnapshotV1) => ({
      ...s,
      structure: { type: 'linked-list', state: { values: Array(100).fill(8) } },
      history: {
        initialState: { values: Array(100).fill(8) },
        operations: [
          { name: 'append', arguments: { value: 8 } },
          { name: 'delete', arguments: { index: 100 } },
        ],
      },
    })],
  ])('rejects %s without querying PostgreSQL', async (_label, change) => {
    const response = await request(createApp())
      .post('/api/v1/snapshots').send(change(makeSnapshot()));
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_SNAPSHOT');
    expect(database.query).not.toHaveBeenCalled();
  });

  it('identifies invalid operation arguments by their history index', async () => {
    const snapshot = makeSnapshot();
    snapshot.history.operations[2] = { name: 'insert', arguments: { index: -1, value: 5 } };
    const response = await request(createApp()).post('/api/v1/snapshots').send(snapshot);
    expect(response.status).toBe(400);
    expect(response.body.error.fields).toContainEqual(expect.objectContaining({
      path: 'history.operations.2.arguments.index',
    }));
    expect(database.query).not.toHaveBeenCalled();
  });

  it('accepts 150 no-op operations without dropping or deduplicating them', async () => {
    const snapshot = makeSnapshot();
    snapshot.history = {
      initialState: structuredClone(snapshot.structure.state),
      operations: Array.from({ length: 150 }, () => ({
        name: 'search', arguments: { value: 99 },
      })),
    };
    database.query.mockResolvedValueOnce({ rows: [{
      share_id: shareId, created_at: createdAt, expires_at: null,
    }] });
    const response = await request(createApp()).post('/api/v1/snapshots').send(snapshot);
    expect(response.status).toBe(201);
    expect(JSON.parse(database.query.mock.calls[0][0].values[5])).toEqual(snapshot.history);
  });

  it('fails explicitly if INSERT returns no row', async () => {
    database.query.mockResolvedValueOnce({ rows: [] });
    await expect(insertSnapshot(makeSnapshot(), { expiresAt: null }))
      .rejects.toThrow('Snapshot insert returned no database row.');
  });
});
