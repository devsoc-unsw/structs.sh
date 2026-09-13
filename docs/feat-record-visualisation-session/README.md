# Shareable preset-visualiser snapshots

## Goal

Let a user capture the current preset visualisation and share it with a URL. Snapshots store initial state, ordered operation history, and final structure state. Exact mid-algorithm playback remains future work.

This feature is for the visualisers opened from the homepage. It is not a debugger feature.

## Documents

- [Frontend API integration guide](./frontend-api-guide.md): implemented endpoints, payload types, browser usage, errors, and frontend handoff checklist.
- [Architecture](./architecture.md): scope, current-system findings, component boundaries, and PostgreSQL decision.
- [Snapshot contract](./snapshot-contract.md): versioned data and algorithm representation.
- [API contract](./api-contract.md): create/read endpoints and validation rules.
- [Request flows](./request-handle-flow.md): creation and restoration sequences.
- [PostgreSQL schema](./schema.sql): resulting tables, constraints, indexes, and public view after the history migration.
- [PostgreSQL operations](./postgresql-operations.md): configuration, migrations, retention, and production safeguards.
- [Implementation plan](./implementation-plan.md): POC tasks, later algorithm-state work, tests, and acceptance criteria.
- [Phase 1 implementation guide](./phase-1-implementation-guide.md): file-by-file instructions for the Linked List POC.
- [Next steps](./next-steps.md): current implementation status and the ordered execution plan from container verification through the Linked List POC.

## Current implementation status

The PostgreSQL foundation is present on the `feat-record-visual` branch:

- Compose defines a pinned PostgreSQL service with a persistent volume and readiness check;
- a one-shot migration service runs before the backend;
- the backend receives `DATABASE_URL` and `PUBLIC_APP_ORIGIN` from Compose;
- the backend validates its environment, uses one PostgreSQL pool, checks the database during startup, and closes the pool during shutdown;
- the initial `node-pg-migrate` migration defines the snapshot table, indexes, constraints, and public view;
- MongoDB-dependent legacy endpoints return explicit `503` responses while filesystem workspace routes remain available.

The backend now implements the history contract, replay consistency validation, PostgreSQL mapping/storage, and create/read API. All 125 unit/request tests and 17 PostgreSQL integration tests pass, as do type checking and lint. Fresh-database migrations have been exercised on isolated local PostgreSQL 18.4. Docker deployment verification remains pending; frontend completion is outside this update. See [Next steps](./next-steps.md) for precise status and the deployment plan.

## Agreed delivery boundary

### Linked List POC

- PostgreSQL is the snapshot source of truth.
- Local Phase 1 runs in PostgreSQL-only snapshot mode and does not require MongoDB.
- A snapshot is immutable and addressed by an opaque share ID.
- The share URL is `/s/:shareId`.
- Linked List values are stored and restored.
- History stores one initial state and an ordered list of stable operation names and named arguments.
- Final state must match replaying the entire history; playback UI is a separate frontend concern.
- Static snapshots use an empty operations array with matching initial and final states.
- Snapshot creation is anonymous in the POC, so `owner_subject` is `NULL`.

### Follow-up

- Capture the exact normalised timeline position.
- Restore the same logical algorithm step.
- Record playback speed, playing/paused metadata, and step mode.
- Add the remaining homepage presets behind the same versioned contract.

## Non-goals

- Capturing `/debugger` state, C memory, files, terminal state, or debugger recordings.
- Serialising SVG nodes or `@svgdotjs` runners.
- Migrating all existing MongoDB-backed server features as part of the snapshot POC.
- Producing a video file in the POC.
- Collaborative editing of a shared snapshot.

## Terminology

- **Structure state**: the semantic values in the data structure at capture time.
- **Input state**: the semantic data immediately before the stored operation ran.
- **Algorithm recipe**: stable operation name plus validated, named arguments.
- **Algorithm state**: logical variables/step information inside a running operation; phase 2.
- **Playback state**: timeline progress and controls; phase 2.
- **Snapshot**: an immutable, versioned record containing the items above.
