# PostgreSQL development and operations

This document defines the database expectations for the snapshot feature. This first version has no migration files. `node-pg-migrate` is retained for future schema changes.

## Configuration

The snapshot server reads configuration from the environment. Recommended names:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection URI supplied by the runtime secret store |
| `DATABASE_POOL_MAX` | No | Maximum server connection-pool size |
| `SNAPSHOT_DEFAULT_TTL_DAYS` | No | Default retention; absent means the product decision is no automatic expiry |
| `STATEMENTTIMEOUT` | No | Positive integer milliseconds, default 10000 |
| `CONNECTIONTIMEOUT` | No | Positive integer milliseconds, default 5000 |
| `QUERYTIMEOUT` | No | Positive integer milliseconds, default 15000 |
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

1. Keep [schema.sql](./schema.sql) as the initial schema reference. Initial provisioning is separate from later migrations.
2. Review both the forward migration and rollback/roll-forward recovery plan.
3. Prove the migration from an empty database and add that check to CI before API tests.
4. Apply production migrations with the migration role before deploying code that writes the new shape.
5. Keep reads backwards-compatible during rolling deployments.
6. Use the `node-pg-migrate` history table as the migration record.

`npm run migrate:up` and `npm run migrate:down` inspect `server/migrations/`
before loading the migration runner. A missing/empty directory (or only metadata
such as `tsconfig.json`) is a successful no-op: no database connection or
`pgmigrations` lookup/creation occurs. SQL, JS and TS migration files are supported.
When files exist, normal migration execution and error propagation apply.

`npm run typecheck:migrations` also skips when no TypeScript migrations exist.
If TypeScript files exist, it uses their `tsconfig.json` when supplied, otherwise
checks those files with explicit TypeScript options. `npm run migrate:create`
remains available when the first actual schema change is needed.

Skipping migration work is not schema provisioning. A new empty database still
needs `visualisation_snapshots`, its indexes, and `public_visualisation_snapshots`
before serving snapshot requests or running cleanup. The current backend startup
check verifies connectivity only, not whether these objects exist.

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

The implemented worker deletes expired rows only, with a default 24-hour grace
period and bounded batches. See [Snapshot lifecycle](./snapshot-life-cycle.md)
for settings and limits. Revoked-only cleanup below remains a future policy.

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
