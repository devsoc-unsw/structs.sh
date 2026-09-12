import { describe, expect, it } from 'vitest';
import { applyLinkedListOperation, isSnapshotConsistent } from '../snapshotConsistency';
import {
  snapshotV1Schema,
  type LinkedListAlgorithmV1,
  type SnapshotV1,
} from '../snapshotContract';

const createSnapshot = (
  initialValues: number[],
  operations: LinkedListAlgorithmV1[],
  finalValues: number[]
): SnapshotV1 => snapshotV1Schema.parse({
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: finalValues } },
  history: { initialState: { values: initialValues }, operations },
});

const operationCases: {
  description: string;
  input: number[];
  operation: LinkedListAlgorithmV1;
  expected: number[];
}[] = [
  { description: 'append', input: [1, 2], operation: { name: 'append', arguments: { value: 3 } }, expected: [1, 2, 3] },
  { description: 'prepend', input: [1, 2], operation: { name: 'prepend', arguments: { value: 0 } }, expected: [0, 1, 2] },
  { description: 'insert', input: [1, 3], operation: { name: 'insert', arguments: { value: 2, index: 1 } }, expected: [1, 2, 3] },
  { description: 'search', input: [1, 2, 3], operation: { name: 'search', arguments: { value: 2 } }, expected: [1, 2, 3] },
  { description: 'delete', input: [1, 2, 3], operation: { name: 'delete', arguments: { index: 1 } }, expected: [1, 3] },
  { description: 'insert past the end', input: [1, 2], operation: { name: 'insert', arguments: { value: 3, index: 100 } }, expected: [1, 2, 3] },
  { description: 'delete past the end', input: [1, 2], operation: { name: 'delete', arguments: { index: 100 } }, expected: [1, 2] },
  { description: 'delete from empty list', input: [], operation: { name: 'delete', arguments: { index: 0 } }, expected: [] },
];

describe('applyLinkedListOperation', () => {
  it.each(operationCases)('applies $description without mutating inputs', ({ input, operation, expected }) => {
    const originalInput = [...input];
    const originalOperation = structuredClone(operation);
    const result = applyLinkedListOperation(input, operation);
    expect(result).toEqual(expected);
    expect(result).not.toBe(input);
    expect(input).toEqual(originalInput);
    expect(operation).toEqual(originalOperation);
  });
});

describe('isSnapshotConsistent', () => {
  it.each([{ values: [] }, { values: [1, 2] }])('accepts static snapshots: $values', ({ values }) => {
    expect(isSnapshotConsistent(createSnapshot(values, [], values))).toBe(true);
  });

  it.each([
    { final: [2, 1] },
    { final: [1, 2, 2] },
    { final: [1, 99] },
  ])('rejects static state mismatch: $final', ({ final }) => {
    expect(isSnapshotConsistent(createSnapshot([1, 2], [], final))).toBe(false);
  });

  it.each(operationCases)('accepts a consistent $description history', ({ input, operation, expected }) => {
    expect(isSnapshotConsistent(createSnapshot(input, [operation], expected))).toBe(true);
  });

  it('replays all five operations without mutating the snapshot', () => {
    const snapshot = createSnapshot([8, 13], [
      { name: 'append', arguments: { value: 21 } },
      { name: 'prepend', arguments: { value: 5 } },
      { name: 'insert', arguments: { value: 8, index: 2 } },
      { name: 'search', arguments: { value: 13 } },
      { name: 'delete', arguments: { index: 3 } },
    ], [5, 8, 8, 21]);
    const original = structuredClone(snapshot);
    expect(isSnapshotConsistent(snapshot)).toBe(true);
    expect(snapshot).toEqual(original);
  });

  it('rejects a mismatching final state after replay', () => {
    expect(isSnapshotConsistent(createSnapshot([1, 2], [
      { name: 'append', arguments: { value: 3 } },
    ], [1, 2, 99]))).toBe(false);
  });

  it('preserves operation order', () => {
    const operations: LinkedListAlgorithmV1[] = [
      { name: 'prepend', arguments: { value: 9 } },
      { name: 'delete', arguments: { index: 0 } },
    ];
    expect(isSnapshotConsistent(createSnapshot([1, 2], operations, [1, 2]))).toBe(true);
    expect(isSnapshotConsistent(createSnapshot([1, 2], [...operations].reverse(), [1, 2]))).toBe(false);
  });

  it('keeps searches and out-of-range deletes as no-ops in a sequence', () => {
    expect(isSnapshotConsistent(createSnapshot([8], [
      { name: 'search', arguments: { value: 99 } },
      { name: 'delete', arguments: { index: 99 } },
      { name: 'append', arguments: { value: 13 } },
    ], [8, 13]))).toBe(true);
  });

  it('accepts exactly 100 values after an operation', () => {
    expect(isSnapshotConsistent(createSnapshot(Array(99).fill(1), [
      { name: 'append', arguments: { value: 1 } },
    ], Array(100).fill(1)))).toBe(true);
  });

  it('rejects intermediate overflow even when the final state fits', () => {
    const snapshot = createSnapshot(Array(100).fill(1), [
      { name: 'append', arguments: { value: 1 } },
      { name: 'delete', arguments: { index: 0 } },
    ], Array(100).fill(1));
    const original = structuredClone(snapshot);
    expect(isSnapshotConsistent(snapshot)).toBe(false);
    expect(snapshot).toEqual(original);
  });
});
