import { z } from 'zod';
import { pool, closeDatabase } from '../db/pool';

const optionsSchema = z.object({
  batchSize: z.coerce.number().int().min(1).max(10_000).default(500),
  maxBatches: z.coerce.number().int().min(1).max(1_000).default(100),
  graceHours: z.coerce.number().int().min(0).max(87_600).default(24),
});

type CleanupOptions = z.infer<typeof optionsSchema>;

export const readCleanupOptions = (source: NodeJS.ProcessEnv = process.env): CleanupOptions =>
  optionsSchema.parse({
    batchSize: source.SNAPSHOT_CLEANUP_BATCH_SIZE || undefined,
    maxBatches: source.SNAPSHOT_CLEANUP_MAX_BATCHES || undefined,
    graceHours: source.SNAPSHOT_CLEANUP_GRACE_HOURS || undefined,
  });

// Each statement is its own short transaction. Locks prevent competing workers
// from deleting the same candidates; SKIP LOCKED avoids waiting on busy rows.
const DELETE_EXPIRED_BATCH = `
  WITH expired AS (
    SELECT id
    FROM visualisation_snapshots
    WHERE expires_at <= statement_timestamp() - ($1::int * interval '1 hour')
    ORDER BY expires_at, id
    LIMIT $2
    FOR UPDATE SKIP LOCKED
  )
  DELETE FROM visualisation_snapshots AS snapshots
  USING expired
  WHERE snapshots.id = expired.id
`;

export const cleanupExpiredSnapshots = async (input: CleanupOptions = readCleanupOptions()) => {
  const options = optionsSchema.parse(input);
  const client = await pool.connect();
  let deleted = 0;
  let batches = 0;
  try {
    while (batches < options.maxBatches) {
      const result = await client.query(DELETE_EXPIRED_BATCH, [options.graceHours, options.batchSize]);
      const count = result.rowCount ?? 0;
      deleted += count;
      batches += 1;
      if (count < options.batchSize) {
        return { deleted, batches, batchLimitReached: false };
      }
    }
    return { deleted, batches, batchLimitReached: true };
  } finally {
    client.release();
  }
};

export const runCleanup = async () => {
  try {
    return await cleanupExpiredSnapshots();
  } finally {
    await closeDatabase();
  }
};

// Importing the worker in a test must not execute a destructive job.
if (require.main === module) {
  void runCleanup().then((result) => {
    console.log(JSON.stringify({ event: 'snapshot_cleanup_complete', ...result, timestamp: new Date().toISOString() }));
  }).catch((error: unknown) => {
    console.error('Snapshot cleanup failed:', error instanceof Error ? error.message : 'Unknown error');
    process.exitCode = 1;
  });
}
