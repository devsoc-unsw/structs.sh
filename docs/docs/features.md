# Features

Reference documentation for the snapshot API, JSON models, and PostgreSQL storage used by the preset visualiser. Use these pages to build frontend integrations or maintain the backend.

## API overview

| Endpoint | Description | Response |
| --- | --- | --- |
| [`POST /api/v1/snapshots`](#create-snapshot) | Store an immutable Linked List snapshot with its complete operation history | `201` · `CreatedSnapshot` |
| [`GET /api/v1/snapshots/{shareId}`](#read-snapshot) | Retrieve a public snapshot for display or replay | `200` · `PublicSnapshotV1` |

Local API origin: `http://localhost:8001`. Use the configured deployment origin outside local development. Both endpoints are anonymous; no token or cookie is required. Anyone with a share URL can read its snapshot.

## Model overview

- [Snapshot models](#snapshot-models): fields, types, defaults, operation arguments, and validation constraints.
- [PostgreSQL](#postgresql-schema): storage columns, JSONB mapping, indexes, and public view.
- [Errors](#error-responses): status codes and the error envelope.

## Integration overview

- [Frontend usage](#frontend-integration): capture, create, share, fetch, and replay.
- [Configuration and lifecycle](#configuration-and-lifecycle): environment variables, optional migrations, expiry, and scheduled cleanup.

!!! note "Current scope"

    Only Linked Lists, schema version `1`, and renderer `preset-visualiser-v1` are supported. There is no snapshot list, edit, delete, owner-management, or playback-position endpoint. The share page `/s/{shareId}` belongs to the frontend, not the API.

This reference covers the snapshot feature, not debugger or filesystem-workspace APIs. It uses the parameter tables, model sections, examples, and source panels of the [FastAPI reference](https://fastapi.tiangolo.com/reference/), adapted to this Express/TypeScript backend. It is a documentation site, not an interactive Swagger console.


## Create snapshot

```http
POST /api/v1/snapshots
Content-Type: application/json
```

Validate and store an immutable snapshot, then return its public share link. Creation is anonymous; each successful request creates a new share ID.

### Parameters

| Parameter | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `body` | JSON body | [`SnapshotV1`](#snapshotv1) | Yes | Final structure state and complete operation history |
| `Content-Type` | Header | `application/json` | Yes | JSON request encoding |

No query parameters are required. The JSON body limit is **1 MiB**. Do not send generated fields such as `shareId`, `createdAt`, or `expiresAt`.

### Example

#### JSON

```json
{
  "schemaVersion": 1,
  "rendererVersion": "preset-visualiser-v1",
  "title": "Append then insert",
  "structure": {
    "type": "linked-list",
    "state": { "values": [8, 5, 13] }
  },
  "history": {
    "initialState": { "values": [8] },
    "operations": [
      { "name": "append", "arguments": { "value": 13 } },
      { "name": "insert", "arguments": { "value": 5, "index": 1 } }
    ]
  }
}
```

#### curl

```sh
curl -i http://localhost:8001/api/v1/snapshots \
  -H 'Content-Type: application/json' \
  --data '{"schemaVersion":1,"rendererVersion":"preset-visualiser-v1","title":"Append then insert","structure":{"type":"linked-list","state":{"values":[8,5,13]}},"history":{"initialState":{"values":[8]},"operations":[{"name":"append","arguments":{"value":13}},{"name":"insert","arguments":{"value":5,"index":1}}]}}'
```

### Response

**`201 Created`** · [`CreatedSnapshot`](#createdsnapshot)

```http
Location: /api/v1/snapshots/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

```json
{
  "shareId": "550e8400-e29b-41d4-a716-446655440000",
  "shareUrl": "http://localhost:3000/s/550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-10-09T04:00:00.000Z",
  "expiresAt": null
}
```

The origin of `shareUrl` comes from `PUBLIC_APP_ORIGIN`, not a request header. Expiry is calculated from the optional server-side TTL. The client cannot choose either timestamp or the share ID.

### Validation

The server validates the [JSON models](#snapshot-models), replays operations from `history.initialState`, checks every intermediate list, and requires the result to equal `structure.state`. Validation runs before the database INSERT.

| Status | Error code | Meaning |
| --- | --- | --- |
| `400` | `INVALID_JSON` | Malformed JSON |
| `400` | `INVALID_SNAPSHOT` | Invalid fields or inconsistent replay result |
| `413` | `PAYLOAD_TOO_LARGE` | JSON body exceeds 1 MiB |
| `500` | `INTERNAL_ERROR` | Unexpected server/database failure |

See [error responses](#error-responses) for the envelope and optional field details.

!!! warning "Retries create new snapshots"

    There is no idempotency key. A timed-out POST may already have succeeded. Disable duplicate submissions and ask the user before retrying an uncertain create.

??? info "Source — snapshotService.ts"

    ```typescript
    {% include-markdown "../../server/src/snapshots/snapshotService.ts" comments=false %}
    ```


## Read snapshot

```http
GET /api/v1/snapshots/{shareId}
```

Return a public snapshot for final-state display or operation replay. No authentication or request body is required.

### Parameters

| Parameter | Location | Type | Required | Description |
| --- | --- | --- | --- | --- |
| `shareId` | Path | UUID string | Yes | ID returned by [Create snapshot](#create-snapshot) |

Malformed, missing, expired, and revoked IDs all return the same `404` response. A malformed UUID is rejected before querying the database.

### Example

```sh
curl -i http://localhost:8001/api/v1/snapshots/550e8400-e29b-41d4-a716-446655440000
```

Replace the example ID with a real ID from POST.

### Response

**`200 OK`** · [`PublicSnapshotV1`](#publicsnapshotv1)

```json
{
  "shareId": "550e8400-e29b-41d4-a716-446655440000",
  "schemaVersion": 1,
  "rendererVersion": "preset-visualiser-v1",
  "title": "Append then insert",
  "structure": {
    "type": "linked-list",
    "state": { "values": [8, 5, 13] }
  },
  "history": {
    "initialState": { "values": [8] },
    "operations": [
      { "name": "append", "arguments": { "value": 13 } },
      { "name": "insert", "arguments": { "value": 5, "index": 1 } }
    ]
  },
  "createdAt": "2026-10-09T04:00:00.000Z",
  "expiresAt": null
}
```

An absent title is omitted, not returned as `null`. `expiresAt` is always present. Internal row IDs, ownership, revocation metadata, and `shareUrl` are not returned.

### Availability

| Status | Error code | Meaning |
| --- | --- | --- |
| `404` | `SNAPSHOT_NOT_FOUND` | Invalid or unavailable share ID |
| `500` | `INTERNAL_ERROR` | Unexpected read or stored-data validation failure |

Expired rows become unavailable immediately, regardless of when the cleanup worker deletes them. `expiresAt: null` means no automatic expiry, not a promise of permanent availability. The route sets no explicit `Cache-Control` policy.

!!! tip "Replay from the initial state"

    Display `structure.state` to show the final list. For replay, load `history.initialState` and apply operations in array order. Do not replay from the final state or record replayed operations as new history.

??? info "Source — snapshotRoutes.ts"

    ```typescript
    {% include-markdown "../../server/src/snapshots/snapshotRoutes.ts" comments=false %}
    ```


## Snapshot models

The wire contract is defined by Zod in `server/src/snapshots/snapshotContract.ts`. These tables describe its fields; the source panel below includes the current implementation at documentation build time.

All input objects reject unknown keys. Numeric fields must be JSON numbers, not strings. Schema version and renderer version are separate compatibility identifiers.

### SnapshotV1

Request model for [Create snapshot](#create-snapshot).

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `schemaVersion` | literal `1` | Yes | — | History-based V1 contract |
| `rendererVersion` | literal `"preset-visualiser-v1"` | Yes | — | Supported renderer |
| `title` | string | No | Omitted | Trimmed; 1–120 characters when supplied |
| `structure` | [`LinkedListStructureV1`](#linkedliststructurev1) | Yes | — | Final semantic list state |
| `history` | [`LinkedListHistoryV1`](#linkedlisthistoryv1) | Yes | — | Initial state and ordered operations |

`null` is not a substitute for an omitted title. Legacy `algorithm`, per-operation `inputState`, playback state, SVG objects, and extra metadata are not accepted. There is no separate V2 endpoint or legacy request decoder.

### LinkedListStructureV1

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | literal `"linked-list"` | Yes | Only supported structure |
| `state` | [`LinkedListStateV1`](#linkedliststatev1) | Yes | State after executing all operations |

### LinkedListStateV1

| Field | Type | Required | Constraints |
| --- | --- | --- | --- |
| `values` | array of integers | Yes | 0–100 items; each integer 0–99 |

Empty lists and duplicate values are valid. Order is significant. Initial, intermediate, and final lists must all respect the size/value limits.

### LinkedListHistoryV1

| Field | Type | Required | Constraints |
| --- | --- | --- | --- |
| `initialState` | [`LinkedListStateV1`](#linkedliststatev1) | Yes | State before the first operation |
| `operations` | array of [`LinkedListAlgorithmV1`](#linkedlistalgorithmv1) | Yes | 0–150 entries, in execution order |

`LinkedListHistoryV1` is the documentation name for the object validated by `linkedListHistorySchema`; the backend infers it within `SnapshotV1`.

### LinkedListAlgorithmV1

A discriminated union: `name` determines the exact required `arguments` object. Indices are non-negative integers; values are integers 0–99.

| `name` | `arguments` | Result |
| --- | --- | --- |
| `append` | `{ "value": number }` | Add value at the end |
| `prepend` | `{ "value": number }` | Add value at the beginning |
| `insert` | `{ "value": number, "index": number }` | Insert at index; an index beyond the end appends |
| `search` | `{ "value": number }` | List remains unchanged |
| `delete` | `{ "index": number }` | Remove indexed value; an out-of-range index changes nothing |

Search and out-of-range deletion entries stay in history. Operations are not deduplicated. Each operation starts from the previous operation's result, so it does not need an `inputState` field.

### CreatedSnapshot

Response model for POST, defined in `snapshotService.ts`.

| Field | Type | Nullable | Description |
| --- | --- | --- | --- |
| `shareId` | UUID string | No | Server-generated public identifier |
| `shareUrl` | absolute URL string | No | Frontend `/s/{shareId}` URL |
| `createdAt` | ISO UTC datetime string | No | Creation time |
| `expiresAt` | ISO UTC datetime string | Yes | Expiry time, or `null` |

All four fields are always returned. Dates are JSON strings, not JavaScript `Date` objects.

### PublicSnapshotV1

GET response containing all [`SnapshotV1`](#snapshotv1) fields plus:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `shareId` | UUID string | Yes | Public identifier |
| `createdAt` | ISO UTC datetime string | Yes | Creation time |
| `expiresAt` | ISO UTC datetime string or `null` | Yes | Expiry time |

`shareUrl` is not included. Strip response-only fields before submitting the data as a new snapshot.

### Static snapshot example

```json
{
  "schemaVersion": 1,
  "rendererVersion": "preset-visualiser-v1",
  "structure": { "type": "linked-list", "state": { "values": [8, 13] } },
  "history": { "initialState": { "values": [8, 13] }, "operations": [] }
}
```

With no operations, initial and final state must match exactly.

### Consistency rules

The service replays the entire history and compares final values, preserving order and duplicates. An intermediate list of 101 values is invalid even if a later delete returns it to 100. Schema failures include field paths; replay inconsistency returns `INVALID_SNAPSHOT` without field details. See [Errors](#error-responses).

??? info "Source — snapshotContract.ts"

    ```typescript
    {% include-markdown "../../server/src/snapshots/snapshotContract.ts" comments=false %}
    ```

??? info "Source — snapshotConsistency.ts"

    ```typescript
    {% include-markdown "../../server/src/snapshots/snapshotConsistency.ts" comments=false %}
    ```


## Error responses

Snapshot errors use a consistent JSON envelope. Choose UI behaviour from the HTTP status and `error.code`; human-readable messages can change.

### ApiError

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `error.code` | string | Yes | Machine-readable category |
| `error.message` | string | Yes | User-facing explanation |
| `error.fields` | array of [`ValidationField`](#validationfield) | No | Schema-validation details |

`ApiError` and `ValidationField` are documentation names for the response shape, not imported backend classes.

### ValidationField

| Field | Type | Description |
| --- | --- | --- |
| `path` | string | Dot-separated field path; array indices start at zero; root errors may use `""` |
| `message` | string | Explanation of the invalid field |

### Status codes

| HTTP | Code | Message | Handling |
| --- | --- | --- | --- |
| `400` | `INVALID_JSON` | The request body must contain valid JSON. | Fix JSON serialization |
| `400` | `INVALID_SNAPSHOT` | The snapshot could not be created. | Inspect optional field details; verify replay consistency |
| `413` | `PAYLOAD_TOO_LARGE` | The request body exceeds the allowed size. | Reduce the body below the 1 MiB limit |
| `404` | `SNAPSHOT_NOT_FOUND` | The requested snapshot is unavailable. | Show a single unavailable-link state |
| `404` | `NOT_FOUND` | The requested resource was not found. | Check path and method |
| `500` | `INTERNAL_ERROR` | An unexpected server error occurred. | Show a generic failure; allow deliberate retry |

Malformed, missing, expired, and revoked share IDs are intentionally indistinguishable.

### Examples

#### Invalid field

```json
{
  "error": {
    "code": "INVALID_SNAPSHOT",
    "message": "The snapshot could not be created.",
    "fields": [
      {
        "path": "history.operations.0.arguments.index",
        "message": "Too small: expected number to be >=0"
      }
    ]
  }
}
```

#### Inconsistent history

```json
{
  "error": {
    "code": "INVALID_SNAPSHOT",
    "message": "The snapshot could not be created."
  }
}
```

#### Unavailable snapshot

```json
{
  "error": {
    "code": "SNAPSHOT_NOT_FOUND",
    "message": "The requested snapshot is unavailable."
  }
}
```

Network failures, CORS failures, and non-JSON reverse-proxy errors may not have this envelope. Handle them separately. Never assume `fields` exists, and never parse field-message wording as a stable code.


## PostgreSQL schema

Snapshots are stored in `visualisation_snapshots`. Public reads use `public_visualisation_snapshots`, which selects only public fields and filters unavailable rows.

### visualisation_snapshots

| Column | PostgreSQL type | Nullable | Default | Purpose |
| --- | --- | --- | --- | --- |
| `id` | `uuid` | No | `gen_random_uuid()` | Internal primary key; never exposed |
| `share_id` | `uuid` | No | `gen_random_uuid()` | Unique public identifier |
| `schema_version` | `smallint` | No | `1` | Positive schema version |
| `renderer_version` | `text` | No | — | 1–100 characters; API restricts to supported renderer |
| `title` | `text` | Yes | `NULL` | 1–120 characters if present |
| `structure_type` | `text` | No | — | API currently accepts only `linked-list` |
| `structure_state` | `jsonb` | No | — | Final state object |
| `operation_history` | `jsonb` | No | — | Initial state and ordered operations |
| `owner_subject` | `text` | Yes | `NULL` | Reserved ownership metadata; anonymous creation leaves it null |
| `created_at` | `timestamptz` | No | `now()` | Creation time |
| `expires_at` | `timestamptz` | Yes | `NULL` | Must be later than creation when set |
| `revoked_at` | `timestamptz` | Yes | `NULL` | Marks a snapshot unavailable |

The SQL reference allows additional structure identifiers for future use. That does **not** mean the API supports them: [runtime validation](#snapshot-models) is narrower.

### JSONB mapping

| API field | Database column | Stored example |
| --- | --- | --- |
| `structure.state` | `structure_state` | `{"values":[8,13]}` |
| `history` | `operation_history` | `{"initialState":{"values":[8]},"operations":[{"name":"append","arguments":{"value":13}}]}` |

The database checks the outer history shape, required keys, and maximum operation count. The API enforces operation arguments, value ranges, intermediate-state limits, and final-state consistency. Do not bypass API validation with unvalidated direct writes.

### Indexes

- Primary-key index on `id` and unique index on `share_id`.
- `visualisation_snapshots_owner_created_idx`: owner and descending creation time, for rows with an owner.
- `visualisation_snapshots_expires_idx`: expiry time, for rows with an expiry.

### public_visualisation_snapshots

The view exposes `share_id`, version fields, title, structure fields, `operation_history`, `created_at`, and `expires_at`. It excludes internal IDs, owner metadata, and revocation metadata.

```sql
WHERE revoked_at IS NULL
  AND (expires_at IS NULL OR expires_at > now())
```

The repository uses parameterised INSERT/SELECT statements. JSONB is decoded and validated again when mapped to [`PublicSnapshotV1`](#publicsnapshotv1).

### Initial schema

The complete initial SQL reference is included below.

!!! warning "Initial provisioning is separate from migrations"

    Version 1 intentionally has no migration files. An empty migration directory is a successful no-op, not database creation. Provision the table and view before serving API requests. The SQL below targets a new empty database; do not apply it blindly to an existing database.

??? info "Source — initial SQL schema"

    ```sql
    -- Initial version-1 schema reference; no migration history is required.
    -- For a new empty database only; this is not an upgrade script for existing DBs.

    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE visualisation_snapshots (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        share_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),

        schema_version smallint NOT NULL DEFAULT 1
            CHECK (schema_version > 0),
        renderer_version text NOT NULL
            CHECK (char_length(renderer_version) BETWEEN 1 AND 100),

        title text
            CHECK (title IS NULL OR char_length(title) BETWEEN 1 AND 120),
        structure_type text NOT NULL
            CHECK (structure_type IN (
                'linked-list',
                'binary-search-tree',
                'avl-tree',
                'sorting'
            )),
        structure_state jsonb NOT NULL
            CHECK (jsonb_typeof(structure_state) = 'object'),

        operation_history jsonb NOT NULL,

        -- Opaque identifier from the application's auth boundary. It is optional
        -- for anonymous creation and is never returned by the public read API.
        owner_subject text,

        created_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz,
        revoked_at timestamptz,

        CONSTRAINT visualisation_snapshots_history_shape_check CHECK (
            (
                jsonb_typeof(operation_history) = 'object'
                AND jsonb_typeof(operation_history -> 'initialState') = 'object'
                AND jsonb_typeof(operation_history -> 'initialState' -> 'values') = 'array'
                AND jsonb_typeof(operation_history -> 'operations') = 'array'
                AND operation_history - 'initialState' - 'operations' = '{}'::jsonb
            ) IS TRUE
        ),
        CONSTRAINT visualisation_snapshots_history_length_check CHECK (
            CASE WHEN jsonb_typeof(operation_history -> 'operations') = 'array'
                THEN jsonb_array_length(operation_history -> 'operations') <= 150
                ELSE FALSE
            END
        ),
        CHECK (expires_at IS NULL OR expires_at > created_at)
    );

    -- Supports owner-facing listing without slowing down public reads.
    CREATE INDEX visualisation_snapshots_owner_created_idx
        ON visualisation_snapshots (owner_subject, created_at DESC)
        WHERE owner_subject IS NOT NULL;

    -- Supports scheduled cleanup of expired rows.
    CREATE INDEX visualisation_snapshots_expires_idx
        ON visualisation_snapshots (expires_at)
        WHERE expires_at IS NOT NULL;

    -- Public reads should use this shape so internal IDs and owner metadata cannot
    -- be selected accidentally by the route.
    CREATE VIEW public_visualisation_snapshots AS
    SELECT
        share_id,
        schema_version,
        renderer_version,
        title,
        structure_type,
        structure_state,
        operation_history,
        created_at,
        expires_at
    FROM visualisation_snapshots
    WHERE revoked_at IS NULL
      AND (expires_at IS NULL OR expires_at > now());

    COMMENT ON TABLE visualisation_snapshots IS
        'Immutable replay recipes for homepage preset visualisers; excludes debugger state.';
    COMMENT ON COLUMN visualisation_snapshots.structure_state IS
        'Semantic structure state at capture time, using the versioned snapshot contract.';
    COMMENT ON COLUMN visualisation_snapshots.operation_history IS
        'Initial semantic state and up to 150 ordered operations; detailed validation and replay consistency are enforced by the API.';
    ```


## Frontend integration

Use the snapshot API to create an immutable replay recipe, display its share link, and restore it on the frontend `/s/{shareId}` route.

### Capture and replay

1. Copy the list into `history.initialState` when a new history begins.
2. Append each successfully executed operation and its named arguments to `history.operations`.
3. Set `structure.state` to the final semantic list, not an intermediate animation frame.
4. POST only the [`SnapshotV1`](#snapshotv1) fields.
5. Display or copy the returned `shareUrl`.
6. On a shared page, GET the snapshot. Show the final state directly, or load the initial state and replay operations in order.

Start a new history when loading or generating a new list. Keep no-op operations. Do not silently truncate history at 150 entries, and do not append replayed operations back into the captured recipe.

### Browser requests

Keep the API origin configurable. In local Compose it is `http://localhost:8001`; the frontend normally runs at `http://localhost:3000`.

```typescript
const API_ORIGIN = 'http://localhost:8001';

async function requestJson(path: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(`${API_ORIGIN}${path}`, init);
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new Error(`API returned non-JSON content (${response.status}).`);
  }
  if (!response.ok) {
    throw Object.assign(new Error(`API request failed (${response.status}).`), {
      status: response.status,
      body,
    });
  }
  return body;
}

// draft is a validated SnapshotV1 object. Decoders must validate at runtime.
const created = decodeCreateSnapshotResponse(await requestJson('/api/v1/snapshots', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(draft),
}));

const snapshot = decodePublicSnapshot(await requestJson(
  `/api/v1/snapshots/${encodeURIComponent(created.shareId)}`
));
```

`draft`, `decodeCreateSnapshotResponse`, and `decodePublicSnapshot` are supplied by the frontend. Implement the decoders against [the response models](#snapshot-models); a TypeScript `as` assertion does not validate a network response. Catch both network failures and [structured API errors](#error-responses).

### CORS and links

The backend allows the origin configured by `PUBLIC_APP_ORIGIN`. Set it to the actual browser origin. CORS is not authentication, and share links are public to anyone who knows them.

Use `shareId` and `shareUrl` from the response body. The API's `Location` header is not explicitly exposed to cross-origin JavaScript. `shareUrl` points to the frontend, not a JSON API endpoint.

### UI states

| State | Behaviour |
| --- | --- |
| Saving | Disable duplicate submission |
| Created | Display/copy the returned share URL |
| Loading | Wait for GET and runtime decoding |
| `INVALID_SNAPSHOT` | Display safe validation details; `fields` is optional |
| `SNAPSHOT_NOT_FOUND` | Show one unavailable-link state |
| Unsupported/invalid response | Do not render unvalidated data |
| Network or server failure | Offer a deliberate retry; uncertain POST retries may create duplicates |

To create another snapshot from GET data, remove `shareId`, `createdAt`, and `expiresAt` before POST. Stored snapshots cannot be edited through this API.


## Configuration and lifecycle

The API and cleanup worker share PostgreSQL configuration. The browser never connects directly to the database.

### Environment variables

| Variable | Required | Default | Meaning |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | — | PostgreSQL connection URI |
| `PUBLIC_APP_ORIGIN` | Yes | — | HTTP(S) origin for share links and browser CORS; also required by the worker's shared configuration |
| `PORT` | No | `8001` | Server port, integer 1–65535 |
| `DATABASE_POOL_MAX` | No | `10` | Positive pool-size integer |
| `SNAPSHOT_DEFAULT_TTL_DAYS` | No | Unset | Positive integer days; unset means no automatic expiry |
| `STATEMENTTIMEOUT` | No | `10000` | PostgreSQL statement timeout in milliseconds |
| `CONNECTIONTIMEOUT` | No | `5000` | Connection timeout in milliseconds |
| `QUERYTIMEOUT` | No | `15000` | Client query timeout in milliseconds |

Timeouts accept string-valued environment variables, require positive integers, and are capped at 2147483647 ms. Empty timeout values use defaults. The public origin cannot contain credentials, a non-root path, query, or fragment.

Inject secrets through deployment configuration, not source control. Do not derive share URLs from untrusted request headers. Use least-privilege database roles; do not expose the database directly to browsers.

### Optional migrations

Version 1 has no migration files. From `server/`:

```sh
npm run migrate:up
npm run migrate:down
npm run typecheck:migrations
```

Missing or empty `migrations/` directories skip successfully without connecting to PostgreSQL or accessing migration history. Metadata-only directories also skip. When SQL, JS, or TS migration files exist, the runner executes normally and preserves failures.

Type checking skips if no TypeScript migrations exist. Otherwise it uses the migration `tsconfig.json` if present, or explicit compiler options. `npm run migrate:create` is available for future schema changes.

!!! warning "No migrations does not mean no schema"

    Provision the [initial database schema](#postgresql-schema) separately. Backend startup currently checks database connectivity, not table/view existence. Review and test future upgrades before deploying code that requires them.

### Expiration and revocation

- `expires_at IS NULL`: no automatic expiry.
- `expires_at <= now()`: unavailable to public reads immediately.
- Non-null `revoked_at`: unavailable regardless of expiry.
- Snapshot content is immutable; there is no edit endpoint or expiry extension endpoint.
- Cleanup deletes expired rows after a grace period. It does not delete rows solely because they are revoked.

### Scheduled cleanup

`snapshot-cleaner` runs at **00:00 UTC every day**. It uses database time, commits each bounded DELETE separately, and skips locked rows. These settings are configurable:

| Variable | Default | Range | Meaning |
| --- | --- | --- | --- |
| `SNAPSHOT_CLEANUP_GRACE_HOURS` | `24` | 0–87600 | Delay between expiry and deletion; zero permits immediate deletion |
| `SNAPSHOT_CLEANUP_BATCH_SIZE` | `500` | 1–10000 | Maximum rows per DELETE |
| `SNAPSHOT_CLEANUP_MAX_BATCHES` | `100` | 1–1000 | Maximum DELETE batches per scheduled run |

Non-expiring rows are never selected. Remaining or locked rows wait for a later run. Logs include `deleted`, `batches`, and `batchLimitReached`; the last flag means the work allowance was exhausted, not proof that more rows remain. Failures close the pool and exit nonzero; earlier committed batches remain deleted.

### Container verification

From the repository root:

```sh
docker compose up -d --wait db
docker compose build migrate server snapshot-cleaner
docker compose up -d migrate server
docker compose logs --tail=100 migrate server
```

An empty migration run should exit with code 0. Verify [POST](#create-snapshot) and [GET](#read-snapshot) before enabling scheduled cleanup.

```sh
docker compose run --rm --no-deps snapshot-cleaner \
  sh -c 'TEST_DATABASE_URL="$DATABASE_URL" npm run test:integration'
docker compose up -d snapshot-cleaner
docker compose exec snapshot-cleaner crontab -l
docker compose logs --tail=50 snapshot-cleaner
```

Build the cleaner image **before** testing it. The cleanup integration tests use a session-local temporary table and do not delete stored snapshots. Starting the cleaner enables actual daily deletion; cron startup alone does not prove the scheduled job completed. Check for `snapshot_cleanup_complete` after a scheduled run.

### Verification and recovery

From `server/`, run `npm test`, `npm run tsc`, and `npm run lint`. For local SQL tests, point `TEST_DATABASE_URL` at a disposable PostgreSQL database and run `npm run test:integration`.

Before production deployment, configure least-privilege roles, backups, and restore procedures. Monitor connection/query failures, cleanup errors, and repeated batch-limit reports. Do not log credentials, connection URIs, or complete snapshot payloads. Restoring a database must preserve existing share IDs.

<!-- Features-only enhancement: retain the theme and heading links, folding
     only nested table-of-contents entries. Without JavaScript the TOC stays usable. -->
<style>
.features-toc-branch { position: relative; }
.features-toc-branch > .md-nav__link { padding-right: 1.25rem; }
.features-toc-branch > nav[hidden] { display: none; }
.features-toc-toggle {
  position: absolute;
  top: 0;
  right: 0;
  width: 1.1rem;
  height: 1.1rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
}
.features-toc-toggle::before { content: "›"; display: inline-block; }
.features-toc-toggle[aria-expanded="true"]::before { transform: rotate(90deg); }
.features-toc-toggle:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
.features-toc-link.md-nav__link--active:not(.features-toc-current) { color: inherit; }
.features-toc-link.features-toc-current { color: var(--md-primary-fg-color); }
</style>

<script>
(() => {
  const foldFeaturesToc = () => {
    const branches = new Map();
    const links = [...document.querySelectorAll('.md-nav--secondary a.md-nav__link[href^="#"]')];
    let index = 0;
    document.querySelectorAll('.md-nav--secondary .md-nav__item').forEach((item) => {
      const link = item.querySelector(':scope > a.md-nav__link');
      const children = item.querySelector(':scope > nav');
      if (!link || !children || item.classList.contains('features-toc-branch')) return;

      const title = link.textContent.trim();
      children.id = `features-toc-group-${index++}`;
      children.hidden = true;
      item.classList.add('features-toc-branch');

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'features-toc-toggle';
      toggle.setAttribute('aria-controls', children.id);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', `Expand ${title}`);
      const setExpanded = (expanded) => {
        children.hidden = !expanded;
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', `${expanded ? 'Collapse' : 'Expand'} ${title}`);
      };
      branches.set(item, setExpanded);
      toggle.addEventListener('click', () => setExpanded(children.hidden));
      item.insertBefore(toggle, link);
    });

    const targetOf = (link) => document.getElementById(decodeURIComponent(link.hash.slice(1)));
    const headings = [...new Set(links.map(targetOf).filter(Boolean))];
    let activeHeading;
    const activate = (heading, expandSelf = false) => {
      const changed = activeHeading !== heading;
      activeHeading = heading;
      links.forEach((link) => {
        const current = Boolean(heading) && targetOf(link) === heading;
        link.classList.toggle('features-toc-current', current);
        if (current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
        if (!current || (!changed && !expandSelf)) return;

        // Reveal the active heading's ancestors, but allow manual folding
        // until the reader moves to a different section.
        let item = link.parentElement;
        if (expandSelf) branches.get(item)?.(true);
        while ((item = item.parentElement?.closest('.md-nav__item'))) {
          branches.get(item)?.(true);
        }
      });
    };
    links.forEach((link) => {
      link.classList.add('features-toc-link');
      link.addEventListener('click', () => activate(targetOf(link), true));
    });

    const syncHash = () => {
      const link = links.find((entry) => entry.hash === window.location.hash);
      if (link) activate(targetOf(link), true);
    };
    const syncScroll = () => {
      const header = document.querySelector('.md-header');
      const top = Math.max(0, header?.getBoundingClientRect().bottom ?? 0) + 24;
      let current;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > top) break;
        current = heading;
      }
      activate(current);
    };
    let scheduled = false;
    const scheduleScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        syncScroll();
      });
    };
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', scheduleScroll);
    syncScroll();
    syncHash();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', foldFeaturesToc, { once: true });
  } else {
    foldFeaturesToc();
  }
})();
</script>
