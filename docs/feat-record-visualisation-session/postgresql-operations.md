# PostgreSQL development and operations

This document defines the database expectations for the snapshot feature. The project has selected `node-pg-migrate`; the initial ordered migration is in `server/migrations/`.

## Configuration

The snapshot server reads configuration from the environment. Recommended names:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection URI supplied by the runtime secret store |
| `DATABASE_POOL_MAX` | No | Maximum server connection-pool size |
| `SNAPSHOT_DEFAULT_TTL_DAYS` | No | Default retention; absent means the product decision is no automatic expiry |
| `PUBLIC_APP_ORIGIN` | Yes | Trusted origin used to build returned share URLs |

Do not:

- hard-code a connection string;
- commit real credentials or a populated `.env`;
- build a share URL from an untrusted `Host` header;
- grant the application role ownership or superuser privileges.

Local development may use a checked-in example environment file containing placeholders only. The actual development value stays in an ignored environment file or local secret manager.

## Database roles

Use separate roles where the hosting environment permits:

- **migration role**: may create/alter schema objects and apply migrations;
- **application role**: may select, insert, and revoke snapshot rows, but may not alter the schema;
- **cleanup job role**: may delete expired/revoked rows after the retention grace period.

The public browser never connects to PostgreSQL directly.

## Migration workflow

1. Keep [schema.sql](./schema.sql) as design documentation; apply the ordered migration in `server/migrations/` instead.
2. Review both the forward migration and rollback/roll-forward recovery plan.
3. Prove the migration from an empty database and add that check to CI before API tests.
4. Apply production migrations with the migration role before deploying code that writes the new shape.
5. Keep reads backwards-compatible during rolling deployments.
6. Use the `node-pg-migrate` history table as the migration record.

The first migration enables `pgcrypto`, creates `visualisation_snapshots`, creates its indexes, and creates `public_visualisation_snapshots`.

For later contract versions, prefer additive nullable columns or new JSON versions. Do not rewrite all immutable snapshot rows during a request.

## Application access

- Use one process-level connection pool rather than opening a connection per request.
- Use parameterised queries for all values, including UUIDs and JSON.
- Set a statement timeout appropriate to small point reads/inserts.
- Bound request JSON before it reaches PostgreSQL.
- Use `INSERT ... RETURNING` for snapshot creation.
- Read public snapshots through an explicit column list or the public view.
- Close the pool during graceful shutdown.

The API should fail readiness checks when it cannot reach PostgreSQL, while liveness checks should only indicate whether the server process needs restarting.

## Retention and cleanup

Snapshot content is immutable, but rows can become unavailable through `expires_at` or `revoked_at`.

A scheduled cleanup job may permanently delete rows when:

- `expires_at` is older than the configured grace period; or
- `revoked_at` is older than the configured grace period.

Delete in bounded batches to avoid long transactions and table bloat. Monitor dead tuples and let managed autovacuum operate; tune only after measuring.

The product must choose and publish the default retention period before launch. Until then, `expires_at` remains nullable and clients must display the value returned by the API rather than assuming permanence.

## Backup and recovery

- Include the snapshot database in automated backups.
- Define recovery-point and recovery-time objectives before promising durable long-lived links.
- Test restoring a backup into a non-production database.
- Verify restored snapshots through the public API, not only by counting rows.
- Treat database restoration as internal recovery; it must not change existing `share_id` values.

## Observability

Monitor:

- connection-pool saturation and wait time;
- insert/read latency and error rate;
- row count and total table/index size;
- expired rows awaiting cleanup;
- migration failures;
- unsupported schema-version reads.

Logs may include `share_id`, schema version, structure type, result, and latency. They should not contain full values arrays, database credentials, or connection URIs.

## PostgreSQL readiness checklist

- [x] PostgreSQL service exists in the local Compose environment.
- [x] Local credentials and the backend connection URL are injected through configuration.
- [ ] Least-privilege roles are created.
- [x] Migration history is enabled through `node-pg-migrate`.
- [ ] Schema migration is tested from an empty database.
- [ ] API round-trip tests run against PostgreSQL.
- [ ] Backup and restore are tested.
- [ ] Cleanup and retention decisions are recorded.
- [ ] Dashboards/alerts cover connection and query failures.
