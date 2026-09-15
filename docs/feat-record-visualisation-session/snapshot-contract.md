# Snapshot contract: complete operation history

## Current contract

The backend accepts one history-based contract, still named `SnapshotV1` with `schemaVersion: 1`. This deliberately replaces the previous single-operation V1 during development; there is no V2 endpoint or legacy request decoder.

The runtime source of truth is `server/src/snapshots/snapshotContract.ts`. Backend TypeScript types are inferred from its Zod schemas.

```ts
interface SnapshotV1 {
  schemaVersion: 1;
  rendererVersion: 'preset-visualiser-v1';
  title?: string;
  structure: {
    type: 'linked-list';
    state: { values: number[] }; // final state after all operations
  };
  history: {
    initialState: { values: number[] }; // state before the first operation
    operations: LinkedListOperation[];
  };
}

type LinkedListOperation =
  | { name: 'append' | 'prepend' | 'search'; arguments: { value: number } }
  | { name: 'insert'; arguments: { value: number; index: number } }
  | { name: 'delete'; arguments: { index: number } };
```

This example describes the shape; do not duplicate it as an independent backend validator.

## Validation and replay

- Every object is strict: unexpected fields are rejected.
- Values are integers from 0 through 99; order and duplicates matter.
- Initial, intermediate, and final states contain at most 100 values.
- History is required and contains 0–150 operations in execution order.
- Arguments must exactly match the operation; indices are non-negative integers.
- Title is optional, trimmed, and 1–120 characters when provided.
- Only `linked-list`, schema version `1`, and renderer `preset-visualiser-v1` are accepted.
- Legacy `algorithm`, per-operation `inputState`, algorithm-local `state`, and `playback` fields are not accepted.

`snapshotConsistency.ts` starts from `history.initialState`, applies every operation, validates each resulting state, then compares the final values with `structure.state.values`. A temporarily oversized list is rejected even if a later deletion would shrink it.

| Operation | Result |
|---|---|
| append | Add value at the end |
| prepend | Add value at the beginning |
| insert | Insert at the index; an index past the end appends |
| search | Leave values unchanged |
| delete | Remove the indexed value; an out-of-range index changes nothing |

No-op searches and deletions remain in history. Operations are not deduplicated. Each operation's input is the previous operation's result, so separate per-operation input states are unnecessary.

## Multi-operation example

```json
{
  "schemaVersion": 1,
  "rendererVersion": "preset-visualiser-v1",
  "title": "Append, insert, then search",
  "structure": {
    "type": "linked-list",
    "state": { "values": [8, 5, 13] }
  },
  "history": {
    "initialState": { "values": [8] },
    "operations": [
      { "name": "append", "arguments": { "value": 13 } },
      { "name": "insert", "arguments": { "value": 5, "index": 1 } },
      { "name": "search", "arguments": { "value": 13 } }
    ]
  }
}
```

For a static snapshot, send `operations: []` and make `history.initialState` equal to `structure.state`.

## Storage and compatibility

Store the entire `history` object in one required JSONB column: `operation_history`. Store final state separately in `structure_state`. Public reads map these back to `history` and `structure.state`.

The migration converts existing static rows to empty histories and existing single-operation rows to one-entry histories. It removes the old algorithm/playback columns. Reserved state that cannot be preserved blocks migration; rollback refuses multi-operation rows to avoid data loss.

The database checks the outer history shape and operation count. The API performs detailed argument, value, and replay validation. Direct SQL writes must not bypass those application rules.

After this development replacement, future incompatible public contracts should use a new schema version. Additional renderers, structures, or playback fields require an explicit contract update; they are not implicitly supported.
