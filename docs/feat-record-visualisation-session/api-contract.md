# Snapshot API contract

Frontend builders: start with [the integration guide](./frontend-api-guide.md) for copyable requests, types, fetch usage, and error handling. This document describes implemented behaviour unless explicitly marked as future work.

## Base path

All new endpoints use `/api/v1/snapshots`. They are separate from the legacy `/api/save` and `/api/getOwnedData` routes.

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

- body is valid JSON and at most 1 MiB (`JSON_BODY_LIMIT_BYTES` in `server/src/app.ts`);
- `schemaVersion` is exactly `1`;
- `rendererVersion` is exactly `preset-visualiser-v1`;
- title is absent or 1–120 characters after trimming;
- structure type is implemented by the snapshot feature;
- initial and final values meet the contract limits;
- required `history` contains `initialState` and at most 150 ordered `operations`;
- each operation is allow-listed with exactly matching named arguments;
- replay validates every intermediate state and produces the submitted final state;
- legacy `algorithm`, per-operation `inputState`, and playback fields are rejected.

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
  "history": {
    "initialState": {
      "values": [10, 20, 30]
    },
    "operations": [
      { "name": "append", "arguments": { "value": 42 } },
      { "name": "search", "arguments": { "value": 20 } }
    ]
  },
  "createdAt": "2026-07-24T03:10:00.000Z",
  "expiresAt": null
}
```

Read behaviour:

- the current snapshot routes do not set an explicit `Cache-Control` policy; do not assume a permanent cache lifetime;
- do not return internal `id`, `owner_subject`, or revocation metadata;
- return `404` for malformed, missing, expired, and revoked IDs so callers cannot distinguish them.

## Optional owner operations

These are future ideas, **not implemented endpoints**:

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
        "path": "history.operations.0.arguments.index",
        "message": "Expected a non-negative integer."
      }
    ]
  }
}
```

Never return SQL, stack traces, environment values, or raw validation-library output.

## Database transaction

Creation is one parameterised `INSERT ... RETURNING share_id, created_at, expires_at`. Read is one parameterised query against `public_visualisation_snapshots`. No route should assemble SQL by concatenating `shareId` or stored JSON.
