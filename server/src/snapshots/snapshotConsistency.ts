import type {
  LinkedListAlgorithmV1,
  SnapshotV1,
} from './snapshotContract';

export const applyLinkedListOperation = (
  input: readonly number[],
  algorithm: LinkedListAlgorithmV1
): number[] => {
  const result = [...input];

  switch (algorithm.name) {
  case 'append':
    result.push(algorithm.arguments.value);
    return result;

  case 'prepend':
    result.unshift(algorithm.arguments.value);
    return result;

  case 'insert': {
    const index = Math.min(
      algorithm.arguments.index,
      result.length
    );

    result.splice(
      index,
      0,
      algorithm.arguments.value
    );

    return result;
  }

  case 'search':
    return result;

  case 'delete':
    if (algorithm.arguments.index < result.length) {
      result.splice(algorithm.arguments.index, 1);
    }

    return result;
  }
};

const arraysEqual = (
  first: readonly number[],
  second: readonly number[]
): boolean =>
  first.length === second.length &&
  first.every((value, index) => value === second[index]);

export const isSnapshotConsistent = (
  snapshot: SnapshotV1
): boolean => {
  if (!snapshot.algorithm) {
    return true;
  }

  const calculatedState = applyLinkedListOperation(
    snapshot.algorithm.inputState.values,
    snapshot.algorithm
  );

  return arraysEqual(
    calculatedState,
    snapshot.structure.state.values
  );
};