# Shareable preset-visualiser snapshots

## Goal

Let a user capture the current preset visualisation and share it with a URL. The recipient should see the same data structure, its data, and the selected algorithm. Exact mid-algorithm playback state is included in the design and scheduled after the Linked List POC.

This feature is for the visualisers opened from the homepage. It is not a debugger feature.

## Documents

- [Architecture](./architecture.md): scope, current-system findings, component boundaries, and PostgreSQL decision.
- [Snapshot contract](./snapshot-contract.md): versioned data and algorithm representation.
- [API contract](./api-contract.md): create/read endpoints and validation rules.
- [Request flows](./request-handle-flow.md): creation and restoration sequences.
- [PostgreSQL schema](./schema.sql): proposed tables, constraints, indexes, and public view.
- [PostgreSQL operations](./postgresql-operations.md): configuration, migrations, retention, and production safeguards.
- [Implementation plan](./implementation-plan.md): POC tasks, later algorithm-state work, tests, and acceptance criteria.
- [Phase 1 implementation guide](./phase-1-implementation-guide.md): file-by-file instructions for the Linked List POC.

## Agreed delivery boundary

### Linked List POC

- PostgreSQL is the snapshot source of truth.
- A snapshot is immutable and addressed by an opaque share ID.
- The share URL is `/s/:shareId`.
- Linked List values are stored and restored.
- An associated operation stores its stable name, named arguments, and pre-operation input.
- An operation snapshot restores at the beginning of that operation and opens paused.
- Static snapshots without an operation are supported.

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
