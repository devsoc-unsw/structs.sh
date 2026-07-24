# Phase 1 implementation guide: Linked List snapshots

This guide starts after a PostgreSQL container has been added to Docker Compose. It describes implementation work; it does not change application code by itself.

The Phase 1 outcome is:

1. a user opens the homepage Linked List preset;
2. the user creates or changes the list and optionally runs one operation;
3. the user selects **Share**;
4. the server validates and stores an immutable snapshot in PostgreSQL;
5. the user receives `/s/:shareId`;
6. a clean browser opening that URL restores the values and, when present, the algorithm at its starting point.

Exact mid-animation progress remains Phase 2.

## Recommended delivery order

Implement and verify one boundary at a time:

1. Compose/database preflight;
2. migration;
3. PostgreSQL pool;
4. server contract and repository;
5. create/read API;
6. controller capture model;
7. Share UI;
8. shared-link restore route;
9. automated and manual round-trip tests.

Do not start with the Share button. Prove the API with `curl` before connecting the client.

## 1. Finish the Compose/database preflight

The current Compose file creates `db`, but does not yet run the application server or supply it with `DATABASE_URL`.

### 1.1 Pin PostgreSQL

Replace `postgres:latest` with a team-selected, supported major tag. A floating tag can change the database major version when an image is pulled again, making local and CI behaviour non-reproducible.

Do not put production credentials in Compose. Development defaults may be supplied through Compose interpolation, with real deployed values coming from the platform secret store.

### 1.2 Add a database health check

Use `pg_isready` with the configured database/user. The server should depend on `service_healthy`, not only container startup. “Container running” does not mean PostgreSQL is ready to accept connections.

Conceptual Compose shape:

```yaml
services:
  db:
    image: postgres:<pinned-major>
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 10

  server:
    build:
      context: server
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      PUBLIC_APP_ORIGIN: http://localhost:3000
      PORT: 8001
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "8001:8001"
```

The hostname is `db` from inside Compose. A host process uses `localhost`.

### 1.3 Align Node versions

The client requires Node 22, while `server/Dockerfile` currently uses Node 20. Align the server container and developer tooling on Node 22 before choosing current migration tooling. This avoids a situation where migrations run on a developer machine but not in the server image.

### 1.4 Decide how legacy MongoDB routes coexist

Phase 1 moves **snapshot persistence** to PostgreSQL. Existing authentication and `/api/save` routes still import Mongoose models.

Use one of these explicit transition approaches:

- recommended for a low-risk POC: retain legacy MongoDB temporarily through a `MONGODB_URI` secret while snapshots use PostgreSQL;
- PostgreSQL-only local snapshot mode: mount the snapshot router without MongoDB, and return a clear `503` from unavailable legacy routes;
- migrate legacy users/save-load separately before removing Mongoose.

Do not keep the hard-coded MongoDB URI in `server/src/index.ts`, and do not report the legacy endpoints as working if the server no longer connects to MongoDB.

### Preflight verification

Before continuing:

```sh
docker compose up -d db
docker compose ps
docker compose exec db pg_isready -U myuser -d mydb
docker compose exec db psql -U myuser -d mydb -c "select current_database(), current_user;"
```

Adjust the development user/database names to the values chosen by the team.

## 2. Add server dependencies and migrations

From `server/`, add:

```sh
npm install pg zod
npm install --save-dev @types/pg node-pg-migrate
```

`pg` provides the connection pool and parameterised query API. Zod provides runtime validation; TypeScript types alone cannot validate public JSON.

Add migration scripts to `server/package.json`:

```json
{
  "scripts": {
    "migrate": "node-pg-migrate -j ts",
    "migrate:up": "node-pg-migrate -j ts up",
    "migrate:down": "node-pg-migrate -j ts down"
  }
}
```

Create the first migration:

```sh
npm run migrate -- create create-visualisation-snapshots
```

Implement its `up` migration from [schema.sql](./schema.sql). It must create:

- `pgcrypto`, if absent;
- `visualisation_snapshots`;
- the owner/expiry indexes;
- `public_visualisation_snapshots`.

The `down` migration should drop the view before the table. Do not drop `pgcrypto`; another feature may already depend on it.

Run migrations through the server container so they use the same Node runtime and Compose-provided `DATABASE_URL`:

```sh
docker compose run --rm server npm run migrate:up
```

Then verify:

```sh
docker compose exec db psql -U myuser -d mydb -c "\d+ visualisation_snapshots"
docker compose exec db psql -U myuser -d mydb -c "\d+ public_visualisation_snapshots"
```

Commit the generated migration. Do not treat the documentation SQL file as the production migration history.

## 3. Create the server module boundary

Avoid adding more responsibilities to the existing large `routes.ts`. Create:

```text
server/src/
  app.ts
  config/
    env.ts
  db/
    pool.ts
  snapshots/
    snapshotContract.ts
    snapshotConsistency.ts
    snapshotRepository.ts
    snapshotService.ts
    snapshotRoutes.ts
    snapshotMapper.ts
```

### 3.1 Environment configuration

`config/env.ts` should read and validate:

- `DATABASE_URL` — required;
- `PUBLIC_APP_ORIGIN` — required and parseable as an absolute URL;
- `DATABASE_POOL_MAX` — optional positive integer;
- `SNAPSHOT_DEFAULT_TTL_DAYS` — optional positive integer;
- `PORT` — optional, default `8001`;
- `MONGODB_URI` — temporary and optional/required according to the transition choice above.

Validate once at startup and export a typed configuration object. A missing value should fail startup with the variable name, never the variable value.

### 3.2 PostgreSQL pool

`db/pool.ts` should create exactly one process-level `Pool`:

```ts
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: env.databasePoolMax,
});
```

Also:

- attach an `error` listener for idle-client errors;
- export a `checkDatabase()` function that performs `SELECT 1`;
- call `pool.end()` during graceful shutdown;
- never create a new pool inside a route or repository method.

### 3.3 Separate app construction from process startup

Move Express setup into `server/src/app.ts`:

```ts
export const createApp = () => {
  const app = express();
  app.use(cors(/* configured origin */));
  app.use(express.json({ limit: '32kb' }));
  app.use(snapshotRouter);
  app.use(legacyRouter);
  app.use(errorHandler);
  return app;
};
```

Keep `server/src/index.ts` responsible for:

1. validating configuration;
2. checking PostgreSQL;
3. connecting legacy MongoDB if retained;
4. starting the HTTP listener;
5. handling `SIGINT`/`SIGTERM`.

This separation allows API tests to import the Express app without opening a real listening port.

## 4. Implement the version 1 runtime contract

Create the canonical server validator in `snapshotContract.ts`.

### 4.1 Primitive schemas

Define:

- `value`: integer from 0 through 99;
- `values`: array of `value`, maximum length 100;
- `linkedListState`: strict object `{ values }`;
- `title`: trimmed string, 1–120 characters;
- `rendererVersion`: string, 1–100 characters.

Strict objects must reject unknown keys so arbitrary JSON cannot be silently persisted.

### 4.2 Algorithm discriminated union

Create one strict variant per operation:

```text
append   -> arguments { value }
prepend  -> arguments { value }
insert   -> arguments { value, index }
search   -> arguments { value }
delete   -> arguments { index }
```

`index` is a non-negative integer. Each variant also requires `inputState: { values }`.

Use a discriminated union on `name`. This ensures an `append` payload cannot contain an `index`, and an `insert` cannot omit it.

### 4.3 Snapshot envelope

The Phase 1 schema accepts:

```text
schemaVersion: exactly 1
rendererVersion: validated string
title: optional
structure:
  type: exactly "linked-list"
  state: linkedListState
algorithm: optional discriminated union
```

Reject `playback` and `algorithm.state` in Phase 1. Reserving database columns does not mean the API should accept unvalidated future data.

Infer the TypeScript type from the runtime schema rather than writing a second independent server interface.

## 5. Validate replay consistency

Database shape validation is not enough. The API must verify that applying the stored operation to `algorithm.inputState` produces `structure.state`.

Implement a pure function in `snapshotConsistency.ts`:

```ts
applyLinkedListOperation(
  input: readonly number[],
  algorithm: LinkedListAlgorithmV1
): number[]
```

It must not import React, SVG, or `GraphicalLinkedList`.

Match current semantic behaviour:

| Operation | Pure result |
|---|---|
| `append(value)` | append value |
| `prepend(value)` | prepend value |
| `insert(value, index)` | insert at `min(index, input.length)` |
| `search(value)` | unchanged input |
| `delete(index)` | remove index when in range; otherwise unchanged |

After runtime validation:

1. clone the input;
2. apply the pure operation;
3. compare the resulting array with `structure.state.values`;
4. return `422 UNSUPPORTED_VISUALISATION` or `400 INVALID_SNAPSHOT` when inconsistent.

Add unit tests for this pure function before writing SQL.

## 6. Implement the repository

`snapshotRepository.ts` owns SQL and database row types. No Express request/response objects belong here.

Expose two functions:

```ts
insertSnapshot(snapshot, options): Promise<CreatedSnapshotRow>
findPublicSnapshot(shareId): Promise<PublicSnapshotRow | null>
```

### 6.1 Insert

Use one parameterised query:

```sql
INSERT INTO visualisation_snapshots (
  schema_version,
  renderer_version,
  title,
  structure_type,
  structure_state,
  algorithm_name,
  algorithm_arguments,
  algorithm_input_state,
  expires_at
)
VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7::jsonb, $8::jsonb, $9)
RETURNING share_id, created_at, expires_at;
```

For a static snapshot, pass SQL `NULL` for all algorithm columns. Do not pass the string `"null"`.

Use `JSON.stringify` for JSON parameters unless the selected PostgreSQL abstraction documents automatic JSON conversion. Never interpolate JSON or IDs into SQL strings.

### 6.2 Read

Query the public view with an explicit column list:

```sql
SELECT
  share_id,
  schema_version,
  renderer_version,
  title,
  structure_type,
  structure_state,
  algorithm_name,
  algorithm_arguments,
  algorithm_input_state,
  algorithm_state,
  playback_state,
  created_at,
  expires_at
FROM public_visualisation_snapshots
WHERE share_id = $1;
```

The repository returns `null` for no row. It does not decide HTTP status codes.

### 6.3 Row mapping

`snapshotMapper.ts` converts snake-case database rows to the public camel-case envelope from [api-contract.md](./api-contract.md).

Never include:

- internal `id`;
- `owner_subject`;
- `revoked_at`.

Validate the mapped public response before returning it. This catches corrupt or unexpectedly old rows at the server boundary.

## 7. Implement the service

`snapshotService.ts` coordinates contract validation, consistency, retention, repository calls, and share-URL construction.

### Create flow

1. runtime-validate `req.body`;
2. run replay-consistency validation;
3. calculate `expires_at` from configured retention, or `null`;
4. insert through the repository;
5. build the public link with:

   ```ts
   new URL(`/s/${shareId}`, env.publicAppOrigin).toString()
   ```

6. return `shareId`, `shareUrl`, `createdAt`, and `expiresAt`.

Do not derive the public origin from the request `Host` header.

### Read flow

1. validate `shareId` as a UUID before querying;
2. query the public view;
3. return the mapped snapshot or a not-found result;
4. treat malformed, expired, revoked, and unknown IDs uniformly as `404`.

## 8. Add versioned API routes

`snapshotRoutes.ts` defines:

```text
POST /api/v1/snapshots
GET  /api/v1/snapshots/:shareId
```

Because the server uses Express 4, ensure rejected promises reach the error middleware. Use an `asyncHandler` wrapper or explicit `try/catch`; do not rely on Express automatically handling an async rejection.

Return the error shape from [api-contract.md](./api-contract.md).

Minimum response behaviour:

| Case | Status |
|---|---:|
| Created | 201 |
| Public snapshot found | 200 |
| Invalid request JSON/shape | 400 |
| Unsupported version or structure/operation | 422 |
| Request body too large | 413 |
| Snapshot unavailable | 404 |
| Unexpected database failure | 500 |

Add `Location: /api/v1/snapshots/:shareId` on creation.

## 9. Prove the API before client integration

### Create a static snapshot

```sh
curl --fail-with-body \
  -X POST http://localhost:8001/api/v1/snapshots \
  -H 'Content-Type: application/json' \
  -d '{
    "schemaVersion": 1,
    "rendererVersion": "preset-visualiser-v1",
    "structure": {
      "type": "linked-list",
      "state": { "values": [8, 13, 21] }
    }
  }'
```

### Create an operation snapshot

```sh
curl --fail-with-body \
  -X POST http://localhost:8001/api/v1/snapshots \
  -H 'Content-Type: application/json' \
  -d '{
    "schemaVersion": 1,
    "rendererVersion": "preset-visualiser-v1",
    "structure": {
      "type": "linked-list",
      "state": { "values": [8, 5, 13, 21] }
    },
    "algorithm": {
      "name": "insert",
      "arguments": { "value": 5, "index": 1 },
      "inputState": { "values": [8, 13, 21] }
    }
  }'
```

Copy `shareId` from the response:

```sh
curl --fail-with-body \
  http://localhost:8001/api/v1/snapshots/<share-id>
```

Also prove rejection:

- value `100`;
- array with more than 100 values;
- unknown operation;
- missing insert index;
- append result inconsistent with input;
- invalid UUID;
- unknown UUID.

Inspect PostgreSQL once to confirm the public API is not merely echoing memory:

```sh
docker compose exec db psql -U myuser -d mydb \
  -c "select share_id, structure_type, created_at from visualisation_snapshots order by created_at desc limit 5;"
```

## 10. Add the client snapshot model

Create:

```text
client/src/features/snapshots/
  snapshotTypes.ts
  snapshotDecoder.ts
  snapshotApi.ts
  snapshotTopicMap.ts
  restoreLinkedListSnapshot.ts
  ShareSnapshot.tsx
  SnapshotPage.tsx
```

The client and server are separate package/build contexts, so importing a root-level shared TypeScript file would require build-system changes. For the POC:

- install Zod in `client/` as well with `npm install zod`;
- keep the documented JSON contract canonical;
- implement strict runtime validation on both API boundaries;
- share valid/invalid JSON fixtures in tests;
- consider a real shared package after the POC.

### 10.1 Topic mapping

Do not persist the UI title.

```text
"Linked Lists" <-> "linked-list"
```

Keep this conversion in `snapshotTopicMap.ts`, not scattered through components.

### 10.2 API client

`snapshotApi.ts` exposes:

```ts
createSnapshot(snapshotDraft): Promise<CreateSnapshotResponse>
getSnapshot(shareId): Promise<SnapshotV1>
```

Use the existing Axios dependency. Decode successful responses at runtime before returning them.

Replace the hard-coded server origin in `client/src/utils/constants.ts` with a Vite environment value and a local fallback:

```ts
export const SERVER_URL =
  import.meta.env.VITE_SERVER_URL ?? 'http://localhost:8001';
```

Document `VITE_SERVER_URL` in an example environment file.

## 11. Capture the algorithm recipe in the controller

The most reliable capture point is `VisualiserController.doOperation`, not the React form. Every preset operation already passes through this method.

### 11.1 Add an internal captured-operation type

For Phase 1 it contains:

```ts
interface CapturedLinkedListOperation {
  name: 'append' | 'prepend' | 'insert' | 'search' | 'delete';
  arguments: Record<string, number>;
  inputValues: number[];
}
```

Keep it private and expose copies through a getter or `buildSnapshotDraft()`.

### 11.2 Refactor `doOperation`

After input validation succeeds but before invoking the structure method:

1. copy `this.data` into `inputValues`;
2. parse string form arguments into the exact numeric values already passed to the operation;
3. obtain argument names from `this.dataStructure.documentation[command].args`;
4. build named arguments with `Object.fromEntries`;
5. invoke the data-structure operation;
6. only after successful invocation, store the captured recipe;
7. construct/play the timeline as today.

Do not parse the arguments once for capture and differently for execution. Refactor the current conversion into one local `parsedArgs` value and use it for both.

Only record allow-listed Linked List operations in Phase 1. Other preset types may still run normally, but their Share action should be disabled or return a clear “not supported yet” message.

### 11.3 Clear stale recipes

Clear the captured operation when any of these occurs:

- `applyTopicTitle`;
- `loadData`;
- `resetDataStructure`;
- `generateDataStructure`.

Be careful with call ordering: `loadData` calls reset before loading values, so it should end with no retained operation.

### 11.4 Build a snapshot draft

Add a method that returns a fresh object:

```ts
controller.buildSnapshotDraft(title?)
```

For Linked List:

```text
schemaVersion = 1
rendererVersion = "preset-visualiser-v1"
structure.type = "linked-list"
structure.state.values = copy of controller.data
algorithm = captured recipe, if one exists
```

Never return internal arrays by reference.

## 12. Replace inline URL encoding with Share

The current `CreateLink.tsx` encodes values directly in the route. Replace or supersede it with `ShareSnapshot.tsx`.

On click:

1. call `controller.buildSnapshotDraft()`;
2. reject unsupported topics before making a request;
3. disable the button and show progress;
4. call `createSnapshot`;
5. copy the returned `shareUrl`;
6. also display the URL in a selectable field;
7. show an accessible success message;
8. re-enable the action on completion.

Clipboard access can fail outside secure contexts or due to browser permissions. Treat clipboard failure separately: the snapshot was still created, so display the URL instead of reporting total failure.

The existing Create/Save/Load/Link section is behind `inDev`. During development the Share control may remain gated, but POC acceptance requires a deliberate route to enable it. Prefer keeping legacy Save/Load gated while placing Share outside that block once the API is ready.

Prevent duplicate rapid submissions with a local `creating` state.

## 13. Implement the shared-link page

### 13.1 Route

Add to `client/src/App.tsx`:

```tsx
<Route path="/s/:shareId" element={<SnapshotPage />} />
```

The static `/s` prefix avoids overloading the existing two-digit data route.

### 13.2 Fetch and error states

`SnapshotPage.tsx`:

1. reads `shareId` with `useParams`;
2. fetches through `getSnapshot`;
3. shows the existing full-page loader while pending;
4. renders a clear unavailable state for `404`;
5. renders a compatibility error for unsupported schema/renderer versions;
6. renders the preset `Visualiser` only after the snapshot is decoded.

### 13.3 Pass a bootstrap object

Extend `Visualiser` and `VisualiserInterface` with an optional snapshot bootstrap rather than making `SnapshotPage` manipulate the module-level controller directly.

Conceptual type:

```ts
type VisualiserBootstrap =
  | { kind: 'values'; values: number[] }
  | { kind: 'snapshot'; snapshot: SnapshotV1 };
```

The normal `/visualiser/:topic/:data?` route uses `values`. The shared route uses `snapshot`.

### 13.4 Restore static state

For no algorithm:

1. `applyTopicTitle('Linked Lists')`;
2. `loadData(structure.state.values)`;
3. leave the code/timeline empty.

### 13.5 Restore an algorithm

Create `restoreLinkedListSnapshot.ts` so restore order is testable:

1. map `linked-list` to `Linked Lists`;
2. load `algorithm.inputState.values`;
3. convert named arguments to the controller's positional string arguments using an explicit operation map:

   ```text
   append  -> [value]
   prepend -> [value]
   insert  -> [value, index]
   search  -> [value]
   delete  -> [index]
   ```

4. call `controller.doOperation(name, updateSlider, ...args)`;
5. call `controller.seekPercent(0)`;
6. call `controller.pause()`;
7. compare `controller.data` with `structure.state.values`;
8. return an incompatibility error on mismatch.

Do not rely on JavaScript object-key order when producing positional arguments.

Running then immediately seeking/pausing should occur in the same React effect before the user interacts. The POC opens at operation start; Phase 2 will seek to saved progress.

Guard the effect against React development-mode double execution. Use a stable snapshot identity/ref or make restoration idempotent so the operation is not applied twice.

## 14. Automated tests

The repository currently has no server test script. Add a test runner deliberately rather than leaving only manual checks.

### 14.1 Server unit tests

Test:

- every valid algorithm variant;
- unknown/missing/extra arguments;
- values outside 0–99;
- more than 100 values;
- insert past the end;
- delete past the end;
- consistency mismatch;
- public row mapper omits private columns.

### 14.2 Server API/integration tests

Against a separate test PostgreSQL database:

- apply migrations from empty state;
- create static snapshot and read it;
- create each algorithm snapshot and read it;
- malformed UUID returns `404`;
- expired/revoked row returns `404`;
- unknown fields are rejected;
- two identical creates receive different share IDs;
- a database error uses the public `500` shape without leaking SQL.

Exporting `createApp()` allows an HTTP test library to exercise routes without binding port 8001.

### 14.3 Client tests

Test pure functions first:

- topic mapping both directions;
- operation named-to-positional argument order;
- valid response decoding;
- invalid response rejection;
- restore semantic-result comparison.

Component tests should cover:

- Share disabled/progress/success/failure states;
- clipboard denied but URL displayed;
- SnapshotPage loading/not-found/unsupported/success states;
- restore effect does not execute twice.

### 14.4 Existing builds

Run:

```sh
cd server
npm run tsc
npm run lint
npm test

cd ../client
npm run tsc
npm run lint
npm run build
npm test
```

Add `test` scripts as part of the test-runner setup.

## 15. End-to-end acceptance walkthrough

1. Start `db`, `server`, and `client`.
2. Apply all migrations.
3. Open `/visualiser/linked-lists`.
4. Create or load `[8, 13, 21]`.
5. Run `insert(value=5, index=1)`.
6. Select Share.
7. Confirm the copied URL contains only `/s/<uuid>`, not the values.
8. Open the URL in a private browser window.
9. Confirm the list begins from `[8, 13, 21]`, the insert code/animation is selected, and playback is paused at 0%.
10. Fast-forward and confirm `[8, 5, 13, 21]`.
11. Refresh and repeat to prove persistence.
12. Stop/restart the containers without removing the database volume.
13. Reopen the same URL and confirm it still works.
14. Confirm `/debugger` was never loaded or called.

Also repeat with a static snapshot and each Linked List operation.

## 16. Suggested pull-request sequence

Keep changes reviewable:

1. **PostgreSQL foundation** — Compose health/server config, Node alignment, pool, migration.
2. **Snapshot API** — contract, consistency, repository, service, routes, API tests.
3. **Snapshot capture/share** — controller recipe and Share UI.
4. **Snapshot restore** — `/s/:shareId`, bootstrap flow, client tests.
5. **POC hardening** — rate limits, observability, retention decision, accessibility and E2E.

Each pull request should leave existing preset visualisers usable and should not modify debugger code.

## Phase 1 completion checklist

- [ ] PostgreSQL image is pinned.
- [ ] `db` health check passes.
- [ ] Server receives `DATABASE_URL` and `PUBLIC_APP_ORIGIN`.
- [ ] Hard-coded database credentials are removed from source.
- [ ] Migration applies from an empty database.
- [ ] Server uses one PostgreSQL pool.
- [ ] POST and GET endpoints pass contract/integration tests.
- [ ] Linked List operation capture uses copied pre-operation input.
- [ ] Share stores state in PostgreSQL and returns an opaque URL.
- [ ] `/s/:shareId` restores static and algorithm snapshots.
- [ ] Algorithm snapshots open paused at 0%.
- [ ] Invalid/expired/unsupported snapshots have clear UI states.
- [ ] Server/client type checks, lint, builds, and tests pass.
- [ ] No debugger files or routes are involved.
