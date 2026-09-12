import { describe, expect, it } from 'vitest';
import { snapshotV1Schema, publicSnapshotV1Schema } from '../snapshotContract';

const createSnapshot = (operations: unknown[] = []) => ({
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: [8, 13, 21] } },
  history: { initialState: { values: [8, 13, 21] }, operations },
});

const createPublicSnapshot = () => ({
  ...createSnapshot(),
  shareId: '550e8400-e29b-41d4-a716-446655440000',
  createdAt: '2026-08-16T03:10:00.000Z',
  expiresAt: null,
});

describe('snapshotV1Schema', () => {
  it('accepts a static history with an empty operations array', () => {
    expect(snapshotV1Schema.parse(createSnapshot()).history.operations).toEqual([]);
  });

  // These assertions concern shape; replay consistency is tested separately.
  it.each([
    { name: 'append', arguments: { value: 5 } },
    { name: 'prepend', arguments: { value: 5 } },
    { name: 'insert', arguments: { value: 5, index: 1 } },
    { name: 'search', arguments: { value: 5 } },
    { name: 'delete', arguments: { index: 1 } },
  ])('accepts $name without per-operation inputState', (operation) => {
    expect(snapshotV1Schema.parse(createSnapshot([operation])).history.operations).toEqual([operation]);
  });

  it('preserves a multi-operation history', () => {
    const operations = [
      { name: 'append', arguments: { value: 5 } },
      { name: 'delete', arguments: { index: 0 } },
    ];
    expect(snapshotV1Schema.parse(createSnapshot(operations)).history.operations).toEqual(operations);
  });

  it.each([
    { count: 150, accepted: true },
    { count: 151, accepted: false },
  ])('handles the operation limit at $count entries', ({ count, accepted }) => {
    const operations = Array.from({ length: count }, () => ({
      name: 'search', arguments: { value: 8 },
    }));
    expect(snapshotV1Schema.safeParse(createSnapshot(operations)).success).toBe(accepted);
  });

  it.each([
    { description: 'missing history', history: undefined },
    { description: 'missing initial state', history: { operations: [] } },
    { description: 'missing operations', history: { initialState: { values: [] } } },
    { description: 'null operations', history: { initialState: { values: [] }, operations: null } },
    { description: 'non-array operations', history: { initialState: { values: [] }, operations: {} } },
    { description: 'unknown history field', history: { initialState: { values: [] }, operations: [], extra: true } },
  ])('rejects $description', ({ history }) => {
    expect(snapshotV1Schema.safeParse({ ...createSnapshot(), history }).success).toBe(false);
  });

  it.each([
    { description: 'unknown name', operation: { name: 'rotate', arguments: {} } },
    { description: 'missing insert index', operation: { name: 'insert', arguments: { value: 5 } } },
    { description: 'extra append index', operation: { name: 'append', arguments: { value: 5, index: 1 } } },
    { description: 'negative index', operation: { name: 'delete', arguments: { index: -1 } } },
    { description: 'fractional index', operation: { name: 'delete', arguments: { index: 1.5 } } },
    { description: 'out-of-range value', operation: { name: 'append', arguments: { value: 100 } } },
    { description: 'old inputState', operation: { name: 'search', arguments: { value: 8 }, inputState: { values: [8] } } },
    { description: 'algorithm-local state', operation: { name: 'search', arguments: { value: 8 }, state: { currentIndex: 1 } } },
  ])('rejects $description at the operation path', ({ operation }) => {
    const result = snapshotV1Schema.safeParse(createSnapshot([operation]));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) =>
        issue.path[0] === 'history' && issue.path[1] === 'operations' && issue.path[2] === 0
      )).toBe(true);
    }
  });

  it.each([
    { values: [-1] },
    { values: [100] },
    { values: [1.5] },
    { values: Array(101).fill(1) },
  ])('rejects invalid initial and final values: $values', ({ values }) => {
    const snapshot = createSnapshot();
    expect(snapshotV1Schema.safeParse({
      ...snapshot,
      history: { ...snapshot.history, initialState: { values } },
    }).success).toBe(false);
    expect(snapshotV1Schema.safeParse({
      ...snapshot,
      structure: { ...snapshot.structure, state: { values } },
    }).success).toBe(false);
  });

  it('accepts boundary values and exactly 100 items', () => {
    const values = Array.from({ length: 100 }, (_, index) => index);
    expect(snapshotV1Schema.safeParse({
      ...createSnapshot(),
      structure: { type: 'linked-list', state: { values } },
      history: { initialState: { values }, operations: [] },
    }).success).toBe(true);
  });

  it.each([
    { description: 'old algorithm field', fields: { algorithm: { name: 'search', arguments: { value: 8 } } } },
    { description: 'playback', fields: { playback: { progress: 0 } } },
    { description: 'unknown field', fields: { unexpected: true } },
    { description: 'unsupported renderer', fields: { rendererVersion: 'preset-visualiser-v2' } },
    { description: 'unsupported schema', fields: { schemaVersion: 2 } },
    { description: 'blank title', fields: { title: '   ' } },
    { description: 'oversized title', fields: { title: 'x'.repeat(121) } },
  ])('rejects $description', ({ fields }) => {
    expect(snapshotV1Schema.safeParse({ ...createSnapshot(), ...fields }).success).toBe(false);
  });

  it('trims a valid title', () => {
    expect(snapshotV1Schema.parse({
      ...createSnapshot(), title: '  Example snapshot  ',
    }).title).toBe('Example snapshot');
  });
});

describe('publicSnapshotV1Schema', () => {
  it('accepts a public history snapshot', () => {
    expect(publicSnapshotV1Schema.parse(createPublicSnapshot())).toEqual(createPublicSnapshot());
  });

  it('accepts an expiry date', () => {
    expect(publicSnapshotV1Schema.safeParse({
      ...createPublicSnapshot(), expiresAt: '2026-09-16T03:10:00.000Z',
    }).success).toBe(true);
  });

  it.each([
    { shareId: 'not-a-uuid' },
    { createdAt: 'not-a-date' },
    { expiresAt: 'not-a-date' },
    { history: undefined },
  ])('rejects invalid public fields %j', (fields) => {
    expect(publicSnapshotV1Schema.safeParse({ ...createPublicSnapshot(), ...fields }).success).toBe(false);
  });
});
