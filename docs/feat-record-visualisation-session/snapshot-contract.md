# Versioned snapshot contract

## Design rules

1. Persist semantic application data, not DOM, SVG, or animation-runner objects.
2. Use stable kebab-case wire identifiers rather than UI labels or class names.
3. Keep the contract version independent from the renderer version.
4. Store named algorithm arguments so argument order can evolve safely.
5. Store both captured structure state and pre-operation input for operation snapshots.
6. Treat snapshots as immutable.

## Version 1 envelope

```ts
interface SnapshotV1 {
  schemaVersion: 1;
  rendererVersion: string;
  title?: string;
  structure: StructureV1;
  algorithm?: AlgorithmV1;
  playback?: PlaybackV1; // phase 2; rejected or omitted by the POC
}

type StructureV1 = LinkedListStructureV1;

interface LinkedListStructureV1 {
  type: 'linked-list';
  state: {
    values: number[];
  };
}

interface AlgorithmV1 {
  name: LinkedListOperationV1;
  arguments: Record<string, number>;
  inputState: {
    values: number[];
  };
  state?: Record<string, unknown>; // phase 2
}

type LinkedListOperationV1 =
  | 'append'
  | 'prepend'
  | 'insert'
  | 'search'
  | 'delete';

interface PlaybackV1 {
  progress: number; // inclusive range 0..1
  status: 'playing' | 'paused' | 'completed';
  speed: number;
  stepMode: boolean;
}
```

The TypeScript above is descriptive. The implementation should define a single runtime schema and infer its TypeScript type rather than maintaining unrelated validators and interfaces.

## Linked List algorithm arguments

| Algorithm | Named arguments | Additional validation |
|---|---|---|
| `append` | `{ "value": number }` | value is 0–99 |
| `prepend` | `{ "value": number }` | value is 0–99 |
| `insert` | `{ "value": number, "index": number }` | value is 0–99; index is a non-negative integer |
| `search` | `{ "value": number }` | value is 0–99 |
| `delete` | `{ "index": number }` | index is a non-negative integer |

The server validates the algorithm/argument combination. It must reject unknown keys, missing keys, non-integers, non-finite numbers, and extra nesting.

For the POC, each values array:

- contains at most 100 items;
- contains integers from 0 through 99;
- is represented as JSON numbers;
- preserves order and duplicate values.

The API also checks that replaying a mutating operation from `algorithm.inputState` is consistent with `structure.state`. This may be implemented in application validation rather than a PostgreSQL constraint. A `search` operation has identical input and captured structure values.

## Static Linked List example

```json
{
  "schemaVersion": 1,
  "rendererVersion": "preset-visualiser-v1",
  "structure": {
    "type": "linked-list",
    "state": {
      "values": [8, 13, 21]
    }
  }
}
```

## Operation example

```json
{
  "schemaVersion": 1,
  "rendererVersion": "preset-visualiser-v1",
  "title": "Insert at index 1",
  "structure": {
    "type": "linked-list",
    "state": {
      "values": [8, 5, 13, 21]
    }
  },
  "algorithm": {
    "name": "insert",
    "arguments": {
      "value": 5,
      "index": 1
    },
    "inputState": {
      "values": [8, 13, 21]
    }
  }
}
```

## Phase 2 playback example

```json
{
  "progress": 0.375,
  "status": "paused",
  "speed": 1,
  "stepMode": false
}
```

`progress` is the source of truth for seeking. The current timeline slider already works in percentages, so the restore adapter can convert it using `progress * 100`.

## Future structure variants

Version 1 initially allow-lists only `linked-list`. Later releases may add:

- `binary-search-tree` with a shape-preserving node representation or the existing pre-order replay representation;
- `avl-tree` with values plus any balance metadata required for validation;
- `sorting` with ordered values and a sort operation recipe.

Do not accept a new type merely because the database `structure_type` constraint lists it. Each type needs runtime validation, capture/restore adapters, deterministic replay tests, and an explicit compatibility decision.

## Migration policy

- Never reinterpret an existing `schemaVersion`.
- Add optional backwards-compatible fields without changing their meaning.
- Increment the version for renamed fields, changed semantics, or incompatible validation.
- Read old versions through version-specific decoders and convert them to the current internal model.
- Reject versions newer than the deployed client/API with `UNSUPPORTED_SCHEMA_VERSION`.
