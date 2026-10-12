import { describe, expect, it } from 'vitest';
import { snapshotV1Schema, publicSnapshotV1Schema, type SnapshotV1 } from './snapshotContract';
import { mapPublicSnapshotRow, type PublicSnapshotRow } from './snapshotMapper';

const snapshot = (): SnapshotV1 => ({
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: [0, 99] } },
  history: {
    initialState: { values: [] },
    operations: [
      { name: 'append', arguments: { value: 99 } },
      { name: 'prepend', arguments: { value: 0 } },
      { name: 'insert', arguments: { value: 1, index: 100 } },
      { name: 'search', arguments: { value: 99 } },
      { name: 'delete', arguments: { index: 2 } },
    ],
  },
});

const row = (): PublicSnapshotRow => ({
  share_id: 'c6bf4c83-7f25-4ae3-8826-f6bff0021173',
  schema_version: 1,
  renderer_version: 'preset-visualiser-v1',
  title: null,
  structure_type: 'linked-list',
  structure_state: snapshot().structure.state,
  operation_history: snapshot().history,
  created_at: new Date('2026-01-01T00:00:00.000Z'),
  expires_at: null,
});

describe('snapshot contract', () => {
  it('accepts all supported operations, boundary values and an optional trimmed title', () => {
    expect(snapshotV1Schema.parse(snapshot())).toEqual(snapshot());
    expect(snapshotV1Schema.parse({ ...snapshot(), title: '  Example  ' }).title).toBe('Example');
  });

  it.each([0, 100])('accepts %i values', (length) => {
    const input = snapshot();
    input.structure.state.values = Array(length).fill(99);
    input.history.initialState.values = Array(length).fill(0);
    expect(snapshotV1Schema.safeParse(input).success).toBe(true);
  });

  it('accepts exactly 150 operations and rejects the next one', () => {
    const input = snapshot();
    input.history.operations = Array.from({ length: 150 }, () => ({
      name: 'search',
      arguments: { value: 0 },
    }));
    expect(snapshotV1Schema.safeParse(input).success).toBe(true);
    input.history.operations.push({ name: 'delete', arguments: { index: 0 } });
    expect(snapshotV1Schema.safeParse(input).success).toBe(false);
  });

  it.each(['', '   ', 'a'.repeat(121)])('rejects invalid title %j', (title) => {
    expect(snapshotV1Schema.safeParse({ ...snapshot(), title }).success).toBe(false);
  });

  it('accepts a title at the maximum length after trimming', () => {
    expect(
      snapshotV1Schema.parse({ ...snapshot(), title: ` ${'a'.repeat(120)} ` }).title
    ).toHaveLength(120);
  });

  it.each([-1, 100, 1.5, '1', null, Infinity, NaN])(
    'rejects invalid list value %j at either state boundary',
    (value) => {
      const input = snapshot();
      expect(
        snapshotV1Schema.safeParse({
          ...input,
          structure: { type: 'linked-list', state: { values: [value] } },
        }).success
      ).toBe(false);
      expect(
        snapshotV1Schema.safeParse({
          ...input,
          history: { ...input.history, initialState: { values: [value] } },
        }).success
      ).toBe(false);
    }
  );

  it.each(['structure', 'history'] as const)('rejects 101 values in %s', (location) => {
    const input = snapshot();
    if (location === 'structure') input.structure.state.values = Array(101).fill(0);
    else input.history.initialState.values = Array(101).fill(0);
    expect(snapshotV1Schema.safeParse(input).success).toBe(false);
  });

  it.each([
    { name: 'reverse', arguments: {} },
    { name: 'append', arguments: {} },
    { name: 'append', arguments: { value: 100 } },
    { name: 'prepend', arguments: { value: -1 } },
    { name: 'search', arguments: { value: '1' } },
    { name: 'insert', arguments: { value: 1, index: -1 } },
    { name: 'delete', arguments: { index: 0.5 } },
    { name: 'delete', arguments: { index: 0, value: 1 } },
    { name: 'append', arguments: { value: 1 }, extra: true },
  ])('rejects invalid operation %j', (operation) => {
    const input = snapshot();
    expect(
      snapshotV1Schema.safeParse({
        ...input,
        history: { ...input.history, operations: [operation] },
      }).success
    ).toBe(false);
  });

  it.each([
    { schemaVersion: 2 },
    { rendererVersion: 'future-renderer' },
    { extra: true },
    { structure: { type: 'tree', state: { values: [] } } },
    { structure: { type: 'linked-list', state: { values: [], extra: true } } },
    { history: { initialState: { values: [] }, operations: [], extra: true } },
  ])('rejects unsupported versions, structures and unknown fields: %j', (patch) => {
    expect(snapshotV1Schema.safeParse({ ...snapshot(), ...patch }).success).toBe(false);
  });
});

describe('mapPublicSnapshotRow', () => {
  it('maps database names and dates without leaking columns or a null title', () => {
    expect(
      mapPublicSnapshotRow({ ...row(), private_column: 'hidden' } as PublicSnapshotRow)
    ).toEqual({
      ...snapshot(),
      shareId: row().share_id,
      createdAt: '2026-01-01T00:00:00.000Z',
      expiresAt: null,
    });
  });

  it('maps an expiring, titled snapshot', () => {
    expect(
      mapPublicSnapshotRow({
        ...row(),
        title: ' Example ',
        expires_at: new Date('2026-02-01T00:00:00Z'),
      })
    ).toMatchObject({
      title: 'Example',
      expiresAt: '2026-02-01T00:00:00.000Z',
    });
  });

  it.each(['created_at', 'expires_at'] as const)('rejects invalid %s timestamps', (column) => {
    for (const value of [new Date('invalid'), '2026-01-01T00:00:00Z', undefined]) {
      expect(() =>
        mapPublicSnapshotRow({ ...row(), [column]: value } as PublicSnapshotRow)
      ).toThrow(`Invalid PostgreSQL timestamp in ${column}.`);
    }
  });

  it.each([{ share_id: 'invalid' }, { schema_version: 2 }, { structure_state: { values: [100] } }])(
    'rejects corrupt persisted data %j',
    (patch) => {
      expect(() => mapPublicSnapshotRow({ ...row(), ...patch })).toThrow();
    }
  );

  it.each([
    { shareId: 'invalid' },
    { createdAt: 'yesterday' },
    { expiresAt: '2026-01-01' },
    { extra: true },
  ])('validates public metadata %j', (patch) => {
    expect(
      publicSnapshotV1Schema.safeParse({ ...mapPublicSnapshotRow(row()), ...patch }).success
    ).toBe(false);
  });
});
