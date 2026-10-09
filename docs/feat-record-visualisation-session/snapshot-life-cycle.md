# Snapshot lifecycle

- A snapshot never expires when expires_at is NULL.
- A snapshot is expired when expires_at <= the current database time.
- Expired snapshots cannot be retrieved, updated, or exported.
- Editing a snapshot does not extend its expiration.
- The cleanup worker permanently deletes expired snapshots after a configurable grace period (24 hours by default). Revocation alone does not trigger deletion.
- Cleanup timing does not affect when a snapshot becomes inaccessible.

## Cleanup worker

The `snapshot-cleaner` container runs daily at 00:00 UTC. Each DELETE uses
database time, takes at most 500 rows, and commits separately. A run performs at
most 100 batches; remaining or locked rows are picked up by a later run.
`FOR UPDATE SKIP LOCKED` avoids waiting on rows another transaction is using.
Snapshots with `expires_at IS NULL` are never selected.

Configuration (environment variables):

- `SNAPSHOT_CLEANUP_GRACE_HOURS`: 0–87600, default 24; 0 deletes as soon as expired.
- `SNAPSHOT_CLEANUP_BATCH_SIZE`: 1–10000, default 500.
- `SNAPSHOT_CLEANUP_MAX_BATCHES`: 1–1000, default 100.
- `DATABASE_URL` and `PUBLIC_APP_ORIGIN`: required by shared backend configuration.

The worker logs deleted-row and batch counts plus `batchLimitReached`. A true
limit flag means the run used its allowance, not that more rows necessarily exist.
Failures close the database pool and exit nonzero. Committed batches are not
rolled back if a later batch fails. Monitor logs for errors and recurring backlog.

Tests from `server/`: `npm test`, `npm run typecheck:server`, and `npm run lint`.
For real SQL checks, set `TEST_DATABASE_URL` to a disposable PostgreSQL database
and run `npm run test:integration`. Tests use a session-local temporary table.

This first version intentionally has no migration files. Migration up/down and
type checking skip cleanly when no migration files exist, without reading or
creating migration history in PostgreSQL. Initial database tables must still be
provisioned separately; skipping migrations does not create the snapshot schema.
The cleanup tests validate SQL behaviour, not fresh-database provisioning.
