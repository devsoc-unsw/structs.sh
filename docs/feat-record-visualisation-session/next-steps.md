# Backend history: status and next steps

## Scope

Backend only. Existing frontend work is left in place. No frontend implementation, container restructuring, production migration, or Docker database modification is included in this update.

## Where we are

The backend history implementation is present:

| Boundary | Current behaviour |
|---|---|
| Contract | Required `history: { initialState, operations }`, still schema version 1 |
| Validation | Strict operation arguments, 150-operation limit, 100-value state limit |
| Consistency | Replay every operation, validate intermediate states, compare final values |
| Repository | Store final state and history in separate JSONB columns |
| Mapper | Return `history` from `operation_history`, validating the public response shape |
| Service/routes | Validate before INSERT; expose POST and GET with existing error responses |
| Migration | Backfill old rows, remove legacy columns, recreate the public view |

The contract, consistency checker, repository, mapper, and migration were already implemented before this completion pass. This pass updates history-related error wording, fixes lint formatting, updates route fixtures, adds request-workflow/migration coverage, and brings the current contract/schema documentation into alignment.

## Verification status

Backend verification completed on 2026-09-13:

- Both migrations applied successfully to a fresh, isolated local PostgreSQL 18.4 database.
- A second migration run correctly reported no pending migrations.
- The repository and migration integration run completed with 17 passing tests.
- All 125 unit/request tests pass, including complete history POST/GET workflows, limits, and validation failures.
- `npm run tsc` and `npm run lint` pass. Migration type-only imports explicitly select ESM resolution so the migration integration tests can be type-checked with the CommonJS server.

The temporary database instance has been stopped. These results do not verify the Docker image or your existing database.

## Next actions — when ready

1. Hand [the frontend API guide](./frontend-api-guide.md) to frontend builders. Backend checks are complete; rerun `npm run tsc`, `npm run lint`, and `npm test` after further backend changes.
2. Back up any database containing snapshots you need to keep. Review the migration's guards before applying it: non-null algorithm/playback state blocks upgrade, and histories with multiple operations block rollback.
3. Apply the migration to the intended Docker database and rebuild only the backend services. Keep the same Compose project name as the existing stack; do not use `down -v` or switch project names to simulate isolation because this stack has a fixed database container name and published port.

   From the repository root, with the intended Compose environment selected:

   ```sh
   docker compose up -d db
   docker compose build migrate server
   docker compose run --rm migrate
   docker compose up -d --no-deps server
   ```

   Run the server command only after migration succeeds. For a shared deployment, pause writes during the schema/backend transition because the old backend refers to removed columns.

4. Inspect schema and migration tracking using the **configured** database user, not a hard-coded `myuser`:

   ```sh
   docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT name, run_on FROM pgmigrations ORDER BY run_on;"'
   docker compose exec db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "\d public.visualisation_snapshots"'
   ```

   Confirm `operation_history` exists and the old algorithm/playback columns are absent. Environment values must match the role/database used to initialise the existing volume; changing environment variables does not rename an existing role.

5. POST the multi-operation example in [snapshot-contract.md](./snapshot-contract.md) to `http://localhost:8001/api/v1/snapshots`. Expect 201. GET the returned `Location`; expect the same history, in the same order, and final values `[8, 5, 13]`.
6. To repeat database verification, run `npm run test:integration` against a migrated, disposable database using its `DATABASE_URL` and a valid `PUBLIC_APP_ORIGIN`. It includes repository tests plus rollback-only migration tests in isolated schemas. Do not point tests at production.

Frontend capture, sharing, and replay are outside this backend completion scope.
