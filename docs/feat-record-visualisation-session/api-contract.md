# Snapshot API contract

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

- body is valid JSON and no larger than the configured request limit;
- `schemaVersion` is supported;
- `rendererVersion` is recognised and at most 100 characters;
- title is absent or 1–120 characters after trimming;
- structure type is implemented by the snapshot feature;
- structure and input values meet the contract limits;
- algorithm is allow-listed for the structure;
- arguments exactly match that algorithm's named arguments;
- optional phase-2 state matches its versioned schema.

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

- return `Cache-Control: public, max-age=300, immutable` only when snapshots have no expiry/revocation requirement that conflicts with caching;
- otherwise use a short cache lifetime and revalidate;
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

## Database transaction

Creation is one parameterised `INSERT ... RETURNING share_id, created_at, expires_at`. Read is one parameterised query against `public_visualisation_snapshots`. No route should assemble SQL by concatenating `shareId` or stored JSON.
