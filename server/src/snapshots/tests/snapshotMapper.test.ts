import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import { mapPublicSnapshotRow, type PublicSnapshotRow } from '../snapshotMapper';

const SHARE_ID = '550e8400-e29b-41d4-a716-446655440000';
const createStaticRow = (overrides: Partial<PublicSnapshotRow> = {}): PublicSnapshotRow => ({
  share_id: SHARE_ID,
  schema_version: 1,
  renderer_version: 'preset-visualiser-v1',
  title: null,
  structure_type: 'linked-list',
  structure_state: { values: [8, 13, 21] },
  operation_history: { initialState: { values: [8, 13, 21] }, operations: [] },
  created_at: new Date('2026-08-19T03:10:00.000Z'),
  expires_at: null,
  ...overrides,
});

describe('mapPublicSnapshotRow', () => {
  it('maps a static snapshot with required empty history', () => {
    expect(mapPublicSnapshotRow(createStaticRow())).toEqual({
      shareId: SHARE_ID,
      schemaVersion: 1,
      rendererVersion: 'preset-visualiser-v1',
      structure: { type: 'linked-list', state: { values: [8, 13, 21] } },
      history: { initialState: { values: [8, 13, 21] }, operations: [] },
      createdAt: '2026-08-19T03:10:00.000Z',
      expiresAt: null,
    });
  });

  it('maps all operations in order and preserves title and final state', () => {
    const history = {
      initialState: { values: [8, 13, 21] },
      operations: [
        { name: 'insert', arguments: { value: 5, index: 1 } },
        { name: 'search', arguments: { value: 13 } },
        { name: 'delete', arguments: { index: 0 } },
      ],
    };
    const row = createStaticRow({
      title: 'Insert, search, delete',
      structure_state: { values: [5, 13, 21] },
      operation_history: history,
    });
    const original = structuredClone(row);
    expect(mapPublicSnapshotRow(row)).toEqual({
      shareId: SHARE_ID,
      schemaVersion: 1,
      rendererVersion: 'preset-visualiser-v1',
      title: 'Insert, search, delete',
      structure: { type: 'linked-list', state: { values: [5, 13, 21] } },
      history,
      createdAt: '2026-08-19T03:10:00.000Z',
      expiresAt: null,
    });
    expect(row).toEqual(original);
  });

  it('maps an expiry date', () => {
    expect(mapPublicSnapshotRow(createStaticRow({
      expires_at: new Date('2026-09-19T03:10:00.000Z'),
    })).expiresAt).toBe('2026-09-19T03:10:00.000Z');
  });

  it.each([
    { renderer_version: 'preset-visualiser-v2' },
    { schema_version: 2 },
    { structure_type: 'binary-search-tree' },
    { structure_state: { values: [100] } },
    { share_id: 'invalid-id' },
  ])('rejects corrupt public fields %j', (overrides) => {
    expect(() => mapPublicSnapshotRow(createStaticRow(overrides))).toThrow(ZodError);
  });

  it.each([
    { description: 'null history', history: null },
    { description: 'missing history', history: undefined },
    { description: 'serialized JSON instead of an object', history: '{"initialState":{"values":[]},"operations":[]}' },
    { description: 'missing operations', history: { initialState: { values: [] } } },
    { description: 'missing initial state', history: { operations: [] } },
    { description: 'invalid initial values', history: { initialState: { values: [100] }, operations: [] } },
    { description: 'missing insert index', history: { initialState: { values: [] }, operations: [{ name: 'insert', arguments: { value: 5 } }] } },
    { description: 'legacy inputState', history: { initialState: { values: [] }, operations: [{ name: 'append', arguments: { value: 5 }, inputState: { values: [] } }] } },
    { description: 'reserved algorithm state', history: { initialState: { values: [] }, operations: [{ name: 'search', arguments: { value: 5 }, state: {} }] } },
    { description: 'reserved playback state', history: { initialState: { values: [] }, operations: [], playback: {} } },
    { description: 'too many operations', history: { initialState: { values: [] }, operations: Array.from({ length: 151 }, () => ({ name: 'search', arguments: { value: 5 } })) } },
  ])('rejects $description', ({ history }) => {
    expect(() => mapPublicSnapshotRow(createStaticRow({ operation_history: history }))).toThrow(ZodError);
  });

  it.each(['created_at', 'expires_at'] as const)('rejects invalid PostgreSQL dates in %s', (column) => {
    expect(() => mapPublicSnapshotRow(createStaticRow({
      [column]: new Date('invalid'),
    }))).toThrow('Invalid PostgreSQL timestamp in ' + column + '.');
  });

  it('does not expose internal or obsolete row fields', () => {
    const row = {
      ...createStaticRow(),
      id: 'internal-id',
      owner_subject: 'internal-owner',
      revoked_at: new Date(),
      algorithm_name: 'search',
      playback_state: {},
    };
    const result = mapPublicSnapshotRow(row);
    for (const field of ['id', 'owner_subject', 'revoked_at', 'operation_history', 'algorithm', 'algorithm_name', 'playback']) {
      expect(result).not.toHaveProperty(field);
    }
  });
});
