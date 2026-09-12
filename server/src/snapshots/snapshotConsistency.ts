import {
    linkedListStateSchema,
    type LinkedListAlgorithmV1,
    type SnapshotV1,
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
    let curValues = [...snapshot.history.initialState.values];

    for (const op of snapshot.history.operations) {
        curValues = applyLinkedListOperation(
            curValues,
            op
        );

        const result = linkedListStateSchema.safeParse({ values: curValues });

        if (!result.success) {
            return false;
        }
    }

    return arraysEqual(
        curValues,
        snapshot.structure.state.values
    );
};