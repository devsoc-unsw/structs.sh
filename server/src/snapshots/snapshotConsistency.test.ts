import { describe, expect, it } from 'vitest';
import { applyLinkedListOperation, isSnapshotConsistent } from './snapshotConsistency';
import type { LinkedListAlgorithmV1, SnapshotV1 } from './snapshotContract';

const cases: [string, number[], LinkedListAlgorithmV1, number[]][] = [
  ['append to empty', [], { name: 'append', arguments: { value: 0 } }, [0]],
  ['append', [1], { name: 'append', arguments: { value: 99 } }, [1, 99]],
  ['prepend', [1], { name: 'prepend', arguments: { value: 0 } }, [0, 1]],
  ['insert at start', [1, 2], { name: 'insert', arguments: { index: 0, value: 3 } }, [3, 1, 2]],
  ['insert in middle', [1, 2], { name: 'insert', arguments: { index: 1, value: 3 } }, [1, 3, 2]],
  ['insert at end', [1, 2], { name: 'insert', arguments: { index: 2, value: 3 } }, [1, 2, 3]],
  ['clamp insertion', [], { name: 'insert', arguments: { index: 100, value: 3 } }, [3]],
  ['delete first', [1, 2], { name: 'delete', arguments: { index: 0 } }, [2]],
  ['delete last', [1, 2], { name: 'delete', arguments: { index: 1 } }, [1]],
  ['delete at length', [1, 2], { name: 'delete', arguments: { index: 2 } }, [1, 2]],
  ['delete beyond length', [], { name: 'delete', arguments: { index: 99 } }, []],
  ['search hit', [1, 1], { name: 'search', arguments: { value: 1 } }, [1, 1]],
  ['search miss', [1], { name: 'search', arguments: { value: 2 } }, [1]],
];

it.each(cases)('%s without mutating the input', (_name, values, operation, expected) => {
  const input = Object.freeze([...values]);
  const result = applyLinkedListOperation(input, operation);
  expect(result).toEqual(expected);
  expect(result).not.toBe(input);
});

const snapshot = (
  initial: number[],
  operations: LinkedListAlgorithmV1[],
  final: number[]
): SnapshotV1 => ({
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: final } },
  history: { initialState: { values: initial }, operations },
});

describe('isSnapshotConsistent', () => {
  it('replays mixed operations in order without mutating the snapshot', () => {
    const input = snapshot(
      [1],
      [
        { name: 'append', arguments: { value: 2 } },
        { name: 'prepend', arguments: { value: 0 } },
        { name: 'insert', arguments: { index: 99, value: 3 } },
        { name: 'search', arguments: { value: 4 } },
        { name: 'delete', arguments: { index: 1 } },
      ],
      [0, 2, 3]
    );
    const before = structuredClone(input);
    expect(isSnapshotConsistent(input)).toBe(true);
    expect(input).toEqual(before);
  });

  it.each([{ final: [1] }, { final: [2, 1] }, { final: [1, 2, 3] }])(
    'rejects a different final state $final',
    ({ final }) => {
      expect(isSnapshotConsistent(snapshot([1, 2], [], final))).toBe(false);
    }
  );

  it('accepts an empty history only when initial and final states match', () => {
    expect(isSnapshotConsistent(snapshot([], [], []))).toBe(true);
    expect(isSnapshotConsistent(snapshot([1, 1], [], [1, 1]))).toBe(true);
  });

  it('rejects an intermediate overflow even if a later deletion restores the final size', () => {
    const values = Array(100).fill(1);
    expect(
      isSnapshotConsistent(
        snapshot(
          values,
          [
            { name: 'append', arguments: { value: 2 } },
            { name: 'delete', arguments: { index: 100 } },
          ],
          values
        )
      )
    ).toBe(false);
  });

  it('accepts growth up to exactly 100 values', () => {
    expect(
      isSnapshotConsistent(
        snapshot(
          Array(99).fill(1),
          [{ name: 'append', arguments: { value: 1 } }],
          Array(100).fill(1)
        )
      )
    ).toBe(true);
  });
});
