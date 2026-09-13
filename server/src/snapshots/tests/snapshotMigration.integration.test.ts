import { randomUUID } from 'node:crypto';
import type { MigrationBuilder } from 'node-pg-migrate' with { 'resolution-mode': 'import' };
import type { PoolClient } from 'pg';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { pool, closeDatabase } from '../../db/pool';
import { up as createSnapshots } from '../../../migrations/1784952600402_create-visualisation-snapshots';
import { up, down } from '../../../migrations/1789022937013_add-snapshot-operation-history';

let client: PoolClient;

// Execute the migrations' real SQL in a rollback-only, isolated schema.
// The migration CLI is separately responsible for migration bookkeeping.
const runMigration = async (migration: (pgm: MigrationBuilder) => Promise<void>) => {
  const statements: string[] = [];
  await migration({ sql: (sql: string) => statements.push(sql) } as unknown as MigrationBuilder);
  await client.query(statements.join('\n'));
};

beforeEach(async () => {
  client = await pool.connect();
  await client.query('BEGIN');
  const schema = `snapshot_migration_test_${randomUUID().replaceAll('-', '')}`;
  await client.query(`CREATE SCHEMA "${schema}"`);
  await client.query(`SET LOCAL search_path TO "${schema}", public`);
  await runMigration(createSnapshots);
});

afterEach(async () => {
  if (client) {
    await client.query('ROLLBACK');
    client.release();
  }
});

afterAll(closeDatabase);

describe('operation history migration', () => {
  it('backfills static and single-operation rows and supports a lossless rollback', async () => {
    await client.query(`
      INSERT INTO visualisation_snapshots
        (renderer_version, structure_type, structure_state,
         algorithm_name, algorithm_arguments, algorithm_input_state)
      VALUES
        ('preset-visualiser-v1', 'linked-list', '{"values":[8]}', NULL, NULL, NULL),
        ('preset-visualiser-v1', 'linked-list', '{"values":[8,13]}',
         'append', '{"value":13}', '{"values":[8]}');
    `);
    const before = await client.query('SELECT * FROM visualisation_snapshots ORDER BY share_id');
    await runMigration(up);
    const migrated = await client.query('SELECT * FROM public_visualisation_snapshots ORDER BY share_id');
    expect(migrated.rows).toHaveLength(2);
    for (let index = 0; index < before.rows.length; index += 1) {
      const original = before.rows[index];
      expect(migrated.rows[index].operation_history).toEqual({
        initialState: original.algorithm_input_state ?? original.structure_state,
        operations: original.algorithm_name === null ? [] : [{
          name: original.algorithm_name, arguments: original.algorithm_arguments,
        }],
      });
      expect(migrated.rows[index]).not.toHaveProperty('algorithm_name');
    }
    await runMigration(down);
    const restored = await client.query('SELECT * FROM visualisation_snapshots ORDER BY share_id');
    expect(restored.rows).toEqual(before.rows);
    await runMigration(up);
  });

  it.each(['algorithm_state', 'playback_state'])('refuses to discard %s during upgrade', async (column) => {
    await client.query(`
      INSERT INTO visualisation_snapshots
        (renderer_version, structure_type, structure_state, algorithm_name,
         algorithm_arguments, algorithm_input_state, ${column})
      VALUES ('preset-visualiser-v1', 'linked-list', '{"values":[8]}',
              'search', '{"value":8}', '{"values":[8]}', '{}');
    `);
    await expect(runMigration(up)).rejects.toThrow('Cannot migrate snapshots');
  });

  it('refuses a rollback that would lose multiple operations', async () => {
    await runMigration(up);
    await client.query(`
      INSERT INTO visualisation_snapshots
        (renderer_version, structure_type, structure_state, operation_history)
      VALUES ('preset-visualiser-v1', 'linked-list', '{"values":[8]}', $1::jsonb);
    `, [JSON.stringify({
      initialState: { values: [8] },
      operations: [
        { name: 'search', arguments: { value: 8 } },
        { name: 'search', arguments: { value: 99 } },
      ],
    })]);
    await expect(runMigration(down)).rejects.toThrow('multi-operation histories would lose data');
  });

  it.each([
    null,
    {},
    { initialState: { values: [] } },
    { initialState: { values: [] }, operations: {} },
    { initialState: { values: [] }, operations: [], extra: true },
    { initialState: { values: [] }, operations: Array(151).fill({}) },
  ])('rejects malformed history at the SQL boundary: %j', async (history) => {
    await runMigration(up);
    await expect(client.query(`
      INSERT INTO visualisation_snapshots
        (renderer_version, structure_type, structure_state, operation_history)
      VALUES ('preset-visualiser-v1', 'linked-list', '{"values":[]}', $1::jsonb)
    `, [history === null ? null : JSON.stringify(history)]))
      .rejects.toMatchObject({ code: history === null ? '23502' : '23514' });
  });
});
