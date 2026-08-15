# Linked List POC implementation plan

This document describes the complete feature delivery. The PostgreSQL foundation is now implemented in the branch, while the snapshot API and client workflow remain to be completed. The current, ordered work queue is maintained in [next-steps.md](./next-steps.md).

## Current integration points

| Area | Existing location | Required responsibility |
|---|---|---|
| Homepage preset list | `client/src/visualiser-src/common/typedefs.ts` | Keep snapshot type identifiers mapped separately from UI labels |
| Preset route | `client/src/App.tsx`, `client/src/VisualiserPage.tsx` | Add a dedicated `/s/:shareId` restore route |
| Controller | `client/src/visualiser-src/controller/VisualiserController.ts` | Expose capture-safe state and retain operation recipe |
| Operation invocation | `client/src/components/Visualiser/VisualiserInterface/OperationDetails.tsx` | Copy pre-operation values and named arguments before `doOperation` |
| Existing link UI | `client/src/components/Visualiser/VisualiserInterface/CreateLink.tsx` | Replace inline value encoding with API-backed share creation |
| Existing data restore | `GraphicalLinkedList.load` through `controller.loadData` | Restore Linked List input/state |
| Server routes | `server/src/snapshots/snapshotRoutes.ts` | Implement the versioned snapshot endpoints; the router is currently a placeholder |
| Server startup | `server/src/index.ts` | Already validates PostgreSQL connectivity and performs graceful pool shutdown |

The existing `Save`, `Load`, and `CreateLink` controls are development-gated by `inDev`. Product rollout must deliberately choose whether the new Share control remains gated.

## Phase 0: persistence foundation

Implementation status:

- **Implemented in code:** local PostgreSQL service, pinned image, database health check, persistent volume, Compose-provided connection string, ordered migration, process-level pool, startup database check, and graceful pool shutdown.
- **Still to verify:** migration and backend startup from a completely empty database, persistence across restarts, and failure behaviour when PostgreSQL is unavailable.
- **Still to implement:** backend liveness/readiness endpoints, production image hardening, CI integration coverage, least-privilege deployment roles, and a retention decision.

The repository and parameterised insert/read queries belong to Phase 1 because the snapshot repository files are currently empty.

## Phase 1: Linked List POC

The file-by-file delivery instructions are in
[phase-1-implementation-guide.md](./phase-1-implementation-guide.md).

### Capture model

1. Define one runtime-validated `SnapshotV1` contract shared by client and server where practical.
2. Map the UI topic `Linked Lists` to wire type `linked-list`.
3. Before an operation is invoked, copy `controller.data`.
4. Convert positional form inputs into named arguments using the operation documentation.
5. Retain:
   - pre-operation input;
   - operation name;
   - named arguments;
   - current semantic structure values.
6. Clear the retained recipe on reset, load, generate, or topic change unless that action itself is modelled as an algorithm.

Array copies are required. Holding the original array or node references would allow later operations to alter the captured input.

### Share creation

1. Present a Share action in the preset visualiser.
2. Build `SnapshotV1`.
3. `POST /api/v1/snapshots`.
4. Copy the returned `/s/:shareId` URL.
5. Show accessible success/failure feedback.
6. Do not place the snapshot JSON in the URL or local storage as the source of truth.

### Restore

1. Resolve `/s/:shareId`.
2. Fetch and validate the public snapshot.
3. Map `linked-list` back to `Linked Lists`.
4. For a static snapshot, call `loadData(structure.state.values)`.
5. For an algorithm snapshot:
   - load `algorithm.inputState.values`;
   - invoke the stored operation with its arguments;
   - seek to 0 and pause.
6. Compare the replayed semantic result with `structure.state`; report an incompatible snapshot if they differ.

The POC promise is reproducible structure/input and algorithm selection, not the sender's exact animation frame.

## Phase 2: exact running-algorithm state

1. Add controller capture accessors for normalised timeline progress, playback status, speed, and step mode.
2. Add a `playback` payload following the versioned contract.
3. Determine whether any operation requires logical algorithm-local state beyond deterministic replay and a cursor. Use `algorithm.state` only for those cases.
4. Rebuild the timeline, seek to the stored progress, and pause before first paint where possible.
5. Add renderer-version compatibility handling.
6. Test snapshots at 0%, between timestamps, exactly on timestamps, and 100%.

Do not serialise `Timeline`, `Runner`, SVG elements, closures, or DOM selectors as the persistence format.

## Phase 3: remaining homepage presets

Add one structure at a time:

1. define its semantic state contract;
2. define allow-listed operations and argument schemas;
3. implement capture and restore adapters;
4. prove deterministic replay;
5. add compatibility and round-trip tests;
6. enable the type in runtime validation.

The existing numeric-array `data` getter is useful but must not automatically be assumed sufficient. In particular, tree snapshots need a documented shape/replay guarantee, and sort snapshots need explicit behaviour while an ordering animation is running.

## Test plan

### Contract and API

- valid static and operation Linked List snapshots create successfully;
- invalid values, oversized arrays, unknown fields, algorithms, and arguments are rejected;
- `shareId` is server-generated and unique;
- public reads omit internal/owner fields;
- expired and revoked snapshots return `404`;
- SQL inputs are parameterised;
- unsupported versions return the documented error.

### Client round trips

- empty list;
- single-node list;
- duplicate values;
- maximum POC list size;
- each of `append`, `prepend`, `insert`, `search`, and `delete`;
- an invalid/no-op index according to current visualiser behaviour;
- static snapshot after generate/load/reset;
- reload in a new browser session with no sender local storage;
- clear error for unavailable or unsupported snapshots.

### Phase 2 playback

- paused and playing captures both open paused at the shared instant;
- progress round-trips within an agreed tolerance;
- step-forward/backward still works after restore;
- speed changes do not change the restored logical instant;
- replayed semantic result equals captured `structure.state`.

## POC acceptance criteria

- A user can share a Linked List preset using a URL short enough for normal copying.
- Opening the URL in a clean browser restores the same list values.
- If an algorithm was captured, the URL restores its pre-operation input, operation, and arguments at the operation start.
- The snapshot persists in PostgreSQL and remains independent of the sender's browser.
- The API and database reject malformed or unsupported snapshot data.
- No `/debugger` state or code path participates in capture or restore.
- Existing source files are unchanged until implementation work begins.

## Rollout and observability

- Add structured logs for create/read outcome, schema version, structure type, latency, and error code; do not log full snapshot values by default.
- Track create success rate, restore success rate, not-found rate, payload size, and version incompatibility.
- Gate creation separately from reading so shared links continue to work during a rollback.
- Back up PostgreSQL and test restoration before promising long retention.
