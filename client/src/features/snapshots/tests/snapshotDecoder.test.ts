import { describe, expect, it } from 'vitest';
import {
  decodeCreateSnapshotResponse,
  decodePublicSnapshot,
  snapshotV1Schema,
} from '../snapshotDecoder';
import type { PublicSnapshotV1 } from '../snapshotTypes';

const created = {
  shareId: 'c6bf4c83-7f25-4ae3-8826-f6bff0021173',
  shareUrl: 'https://structs.example/s/c6bf4c83-7f25-4ae3-8826-f6bff0021173',
  createdAt: '2026-01-01T00:00:00.000Z',
  expiresAt: null,
};
const snapshot = (): PublicSnapshotV1 => ({
  shareId: created.shareId,
  createdAt: created.createdAt,
  expiresAt: null,
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: [0, 99] } },
  history: {
    initialState: { values: [] },
    operations: [
      { name: 'append', arguments: { value: 99 } },
      { name: 'prepend', arguments: { value: 0 } },
      { name: 'insert', arguments: { value: 1, index: 99 } },
      { name: 'search', arguments: { value: 99 } },
      { name: 'delete', arguments: { index: 2 } },
    ],
  },
});

describe('decodeCreateSnapshotResponse', () => {
  it.each([null, '2026-02-01T00:00:00.000Z'])('accepts expiry %j', (expiresAt) => {
    expect(decodeCreateSnapshotResponse({ ...created, expiresAt })).toEqual({
      ...created,
      expiresAt,
    });
  });

  it.each([
    { shareId: 'invalid' },
    { shareUrl: '/relative' },
    { createdAt: 'yesterday' },
    { expiresAt: '2026-02-01' },
    { expiresAt: undefined },
    { extra: true },
  ])('rejects invalid or unexpected response fields %j', (patch) => {
    expect(() => decodeCreateSnapshotResponse({ ...created, ...patch })).toThrow();
  });
});

describe('decodePublicSnapshot', () => {
  it('decodes all supported operations and trims the title', () => {
    expect(decodePublicSnapshot({ ...snapshot(), title: ' Example ' })).toEqual({
      ...snapshot(),
      title: 'Example',
    });
  });

  it.each([0, 100])('accepts %i list values', (count) => {
    const input = snapshot();
    input.structure.state.values = Array(count).fill(0);
    input.history.initialState.values = Array(count).fill(99);
    expect(decodePublicSnapshot(input)).toEqual(input);
  });

  it('enforces the 150-operation boundary', () => {
    const input = snapshot();
    input.history.operations = Array.from({ length: 150 }, () => ({
      name: 'search',
      arguments: { value: 0 },
    }));
    expect(decodePublicSnapshot(input)).toEqual(input);
    input.history.operations.push({ name: 'delete', arguments: { index: 0 } });
    expect(() => decodePublicSnapshot(input)).toThrow();
  });

  it.each([-1, 100, 0.5, '1', null, NaN, Infinity])(
    'rejects invalid value %j in current and initial states',
    (value) => {
      const input = snapshot();
      expect(() =>
        decodePublicSnapshot({
          ...input,
          structure: { type: 'linked-list', state: { values: [value] } },
        })
      ).toThrow();
      expect(() =>
        decodePublicSnapshot({
          ...input,
          history: { ...input.history, initialState: { values: [value] } },
        })
      ).toThrow();
    }
  );

  it.each(['structure', 'history'] as const)('rejects oversized %s state', (location) => {
    const input = snapshot();
    if (location === 'structure') input.structure.state.values = Array(101).fill(0);
    else input.history.initialState.values = Array(101).fill(0);
    expect(() => decodePublicSnapshot(input)).toThrow();
  });

  it.each([
    { name: 'unknown', arguments: {} },
    { name: 'append', arguments: {} },
    { name: 'append', arguments: { value: 100 } },
    { name: 'prepend', arguments: { value: -1 } },
    { name: 'search', arguments: { value: '1' } },
    { name: 'insert', arguments: { index: -1, value: 1 } },
    { name: 'delete', arguments: { index: 0.5 } },
    { name: 'delete', arguments: { index: 0, value: 1 } },
    { name: 'search', arguments: { value: 0 }, extra: true },
  ])('rejects malformed operation %j', (operation) => {
    const input = snapshot();
    expect(() =>
      decodePublicSnapshot({ ...input, history: { ...input.history, operations: [operation] } })
    ).toThrow();
  });

  it.each([
    { schemaVersion: 2 },
    { rendererVersion: 'unsupported' },
    { shareId: 'invalid' },
    { createdAt: 'invalid' },
    { expiresAt: undefined },
    { extra: true },
    { structure: { type: 'tree', state: { values: [] } } },
    { structure: { type: 'linked-list', state: { values: [], extra: true } } },
    { history: { initialState: { values: [] }, operations: [], extra: true } },
    { title: '' },
    { title: '   ' },
    { title: 'x'.repeat(121) },
  ])('rejects unsupported or malformed payload %j', (patch) => {
    expect(() => decodePublicSnapshot({ ...snapshot(), ...patch })).toThrow();
  });

  it('accepts a maximum-length title and an ISO expiry', () => {
    const input = { ...snapshot(), title: 'x'.repeat(120), expiresAt: '2026-02-01T00:00:00.000Z' };
    expect(decodePublicSnapshot(input)).toEqual(input);
  });

  it('keeps public metadata out of the create-request schema', () => {
    const { shareId, createdAt, expiresAt, ...draft } = snapshot();
    expect(snapshotV1Schema.parse(draft)).toEqual(draft);
    for (const metadata of [{ shareId }, { createdAt }, { expiresAt }]) {
      expect(() => snapshotV1Schema.parse({ ...draft, ...metadata })).toThrow();
    }
  });
});
