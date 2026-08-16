import { describe, expect, it } from 'vitest';
import {
  applyLinkedListOperation,
  isSnapshotConsistent,
} from './snapshotConsistency';
import {
  SNAPSHOT_SCHEMA_VERSION,
  SUPPORTED_RENDERER_VERSION,
  type LinkedListAlgorithmV1,
  type SnapshotV1,
} from './snapshotContract';

interface OperationCase {
  description: string;
  input: number[];
  algorithm: LinkedListAlgorithmV1;
  expected: number[];
}

const operationCases: OperationCase[] = [
  {
    description: 'append',
    input: [1, 2],
    algorithm: {
      name: 'append',
      arguments: { value: 3 },
      inputState: { values: [1, 2] },
    },
    expected: [1, 2, 3],
  },
  {
    description: 'prepend',
    input: [1, 2],
    algorithm: {
      name: 'prepend',
      arguments: { value: 0 },
      inputState: { values: [1, 2] },
    },
    expected: [0, 1, 2],
  },
  {
    description: 'insert',
    input: [1, 3],
    algorithm: {
      name: 'insert',
      arguments: { value: 2, index: 1 },
      inputState: { values: [1, 3] },
    },
    expected: [1, 2, 3],
  },
  {
    description: 'search',
    input: [1, 2, 3],
    algorithm: {
      name: 'search',
      arguments: { value: 2 },
      inputState: { values: [1, 2, 3] },
    },
    expected: [1, 2, 3],
  },
  {
    description: 'delete',
    input: [1, 2, 3],
    algorithm: {
      name: 'delete',
      arguments: { index: 1 },
      inputState: { values: [1, 2, 3] },
    },
    expected: [1, 3],
  },
];

const createSnapshot = (
  values: number[],
  algorithm?: LinkedListAlgorithmV1
): SnapshotV1 => ({
  schemaVersion: SNAPSHOT_SCHEMA_VERSION,
  rendererVersion: SUPPORTED_RENDERER_VERSION,
  structure: {
    type: 'linked-list',
    state: {
      values,
    },
  },
  algorithm,
});

describe('applyLinkedListOperation', () => {
  it.each(operationCases)(
    'applies $description',
    ({ input, algorithm, expected }) => {
      expect(
        applyLinkedListOperation(input, algorithm)
      ).toEqual(expected);
    }
  );

  it('inserts past the end at the end of the list', () => {
    const algorithm: LinkedListAlgorithmV1 = {
      name: 'insert',
      arguments: {
        value: 3,
        index: 100,
      },
      inputState: {
        values: [1, 2],
      },
    };

    expect(
      applyLinkedListOperation([1, 2], algorithm)
    ).toEqual([1, 2, 3]);
  });

  it('leaves the list unchanged when deleting past the end', () => {
    const algorithm: LinkedListAlgorithmV1 = {
      name: 'delete',
      arguments: {
        index: 100,
      },
      inputState: {
        values: [1, 2],
      },
    };

    expect(
      applyLinkedListOperation([1, 2], algorithm)
    ).toEqual([1, 2]);
  });

  it('does not mutate the input array', () => {
    const input = [1, 2];

    const algorithm: LinkedListAlgorithmV1 = {
      name: 'append',
      arguments: {
        value: 3,
      },
      inputState: {
        values: [1, 2],
      },
    };

    const result = applyLinkedListOperation(
      input,
      algorithm
    );

    expect(input).toEqual([1, 2]);
    expect(result).toEqual([1, 2, 3]);
    expect(result).not.toBe(input);
  });
});

describe('isSnapshotConsistent', () => {
  it('accepts a static snapshot', () => {
    expect(
      isSnapshotConsistent(createSnapshot([1, 2]))
    ).toBe(true);
  });

  it('accepts a consistent operation snapshot', () => {
    const algorithm: LinkedListAlgorithmV1 = {
      name: 'append',
      arguments: {
        value: 3,
      },
      inputState: {
        values: [1, 2],
      },
    };

    expect(
      isSnapshotConsistent(
        createSnapshot([1, 2, 3], algorithm)
      )
    ).toBe(true);
  });

  it('rejects an inconsistent operation snapshot', () => {
    const algorithm: LinkedListAlgorithmV1 = {
      name: 'append',
      arguments: {
        value: 3,
      },
      inputState: {
        values: [1, 2],
      },
    };

    expect(
      isSnapshotConsistent(
        createSnapshot([1, 2, 99], algorithm)
      )
    ).toBe(false);
  });
});