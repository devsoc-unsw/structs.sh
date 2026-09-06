# Snapshot API contract

## Base path

Snapshot endpoints use `/api/v1/snapshots`. They are separate from the legacy `/api/save` and `/api/getOwnedData` routes. Health endpoints use `/health`.

The examples use `https://structs.sh` as the public origin. The server should derive the actual origin from trusted configuration, not from an arbitrary request header.

## Create snapshot

`POST /api/v1/snapshots`

Request body: `SnapshotV1` from [snapshot-contract.md](./snapshot-contract.md).

Successful response:

```http
HTTP/1.1 201 Created
Location: /api/v1/snapshots/0196ec3c-bca2-7c2e-a8d2-f4295ca0f188
Content-Type: application/json
```

```json
{
  "shareId": "0196ec3c-bca2-7c2e-a8d2-f4295ca0f188",
  "shareUrl": "https://structs.sh/s/0196ec3c-bca2-7c2e-a8d2-f4295ca0f188",
  "createdAt": "2026-07-24T03:10:00.000Z",
  "expiresAt": null
}
```

Creation validation:

- body is valid JSON and no larger than the configured request limit;
- `schemaVersion` is supported;
- `rendererVersion` is recognised and at most 100 characters;
- title is absent or 1–120 characters after trimming;
- structure type is implemented by the snapshot feature;
- structure and input values meet the contract limits;
- algorithm is allow-listed for the structure;
- arguments exactly match that algorithm's named arguments;
- Phase 2 playback and algorithm-local state are rejected in the POC.

The API generates `shareId`; clients cannot choose it. Retrying a timed-out create may produce another immutable snapshot. An idempotency key can be added later if duplicate rows become a practical issue.

## Read public snapshot

`GET /api/v1/snapshots/:shareId`

Successful response:

```json
{
  "shareId": "0196ec3c-bca2-7c2e-a8d2-f4295ca0f188",
  "schemaVersion": 1,
  "rendererVersion": "preset-visualiser-v1",
  "title": "Appending 42",
  "structure": {
    "type": "linked-list",
    "state": {
      "values": [10, 20, 30, 42]
    }
  },
  "algorithm": {
    "name": "append",
    "arguments": {
      "value": 42
    },
    "inputState": {
      "values": [10, 20, 30]
    }
  },
  "createdAt": "2026-07-24T03:10:00.000Z",
  "expiresAt": null
}
```

Read behaviour:

- return `Cache-Control: no-store` on snapshot responses, including successful reads and unavailable/error responses, because expiry and revocation can change availability;
- do not return internal `id`, `owner_subject`, or revocation metadata;
- return `404` for malformed, missing, expired, and revoked IDs so callers cannot distinguish them.

## Optional owner operations

These are not required for anonymous POC sharing:

- `GET /api/v1/snapshots` lists the authenticated owner's snapshots;
- `DELETE /api/v1/snapshots/:shareId` sets `revoked_at`;
- retention cleanup permanently deletes expired rows asynchronously.

Revocation is a state change, while snapshot content remains immutable.

## Error shape

```json
{
  "error": {
    "code": "INVALID_SNAPSHOT",
    "message": "The snapshot could not be created."
  }
}
```

Field-level details may be returned for safe client-correctable validation errors:

```json
{
  "error": {
    "code": "INVALID_SNAPSHOT",
    "message": "The snapshot could not be created.",
    "fields": [
      {
        "path": "algorithm.arguments.index",
        "message": "Expected a non-negative integer."
      }
    ]
  }
}
```

Never return SQL, stack traces, environment values, or raw validation-library output.

## Response codes

| Condition | Status | Code |
|---|---:|---|
| Malformed JSON | 400 | `INVALID_JSON` |
| Malformed snapshot or inconsistent replay result | 400 | `INVALID_SNAPSHOT` |
| Unsupported numeric schema version | 422 | `UNSUPPORTED_SCHEMA_VERSION` |
| Unsupported string renderer, structure, or operation | 422 | `UNSUPPORTED_VISUALISATION` |
| Oversized snapshot request body | 413 | `SNAPSHOT_TOO_LARGE` |
| Malformed, missing, expired, or revoked share ID | 404 | `SNAPSHOT_NOT_FOUND` |
| Unexpected server or persistence error | 500 | `INTERNAL_ERROR` |

Missing or incorrectly typed identifiers remain schema validation errors.
Unsupported-identifier checks precede full validation, with schema version first.

The JSON body limit is 1 MiB (1,048,576 bytes). Unrelated endpoints retain
`413 PAYLOAD_TOO_LARGE`. Exceeding the 100-item values-array limit is a separate
schema violation and returns `400 INVALID_SNAPSHOT`.

## Health endpoints

- `GET /health/live` returns `200 {"status":"ok"}` without querying PostgreSQL.
- `GET /health/ready` executes `SELECT 1` through the application pool.
  Success returns `200 {"status":"ready"}`; failure returns
  `503 {"status":"not_ready"}` without exposing database details.
- Both endpoints return `Cache-Control: no-store`.
- Pool connection acquisition and query response waits each have a five-second
  timeout. A readiness request may incur both waits for a new connection.

These endpoints report process responsiveness and current database connectivity.
The existing startup database check remains in place.

## Database transaction

Creation is one parameterised `INSERT ... RETURNING share_id, created_at, expires_at`. Read is one parameterised query against `public_visualisation_snapshots`. No route should assemble SQL by concatenating `shareId` or stored JSON.
