import type { QueryResultRow } from 'pg';
import { pool } from '../db/pool';
import type { SnapshotV1 } from './snapshotContract';
import type {
  PublicSnapshotRow,
} from './snapshotMapper';

export interface InsertSnapshotOptions {
  expiresAt: Date | null;
}

export interface CreatedSnapshotRow
  extends QueryResultRow {
  share_id: string;
  created_at: Date;
  expires_at: Date | null;
}

type PublicSnapshotQueryRow =
  PublicSnapshotRow & QueryResultRow;

const INSERT_SNAPSHOT_SQL = `
  INSERT INTO visualisation_snapshots (
    schema_version,
    renderer_version,
    title,
    structure_type,
    structure_state,
    algorithm_name,
    algorithm_arguments,
    algorithm_input_state,
    expires_at
  )
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $5::jsonb,
    $6,
    $7::jsonb,
    $8::jsonb,
    $9
  )
  RETURNING
    share_id,
    created_at,
    expires_at
`;

const FIND_PUBLIC_SNAPSHOT_SQL = `
  SELECT
    share_id,
    schema_version,
    renderer_version,
    title,
    structure_type,
    structure_state,
    algorithm_name,
    algorithm_arguments,
    algorithm_input_state,
    algorithm_state,
    playback_state,
    created_at,
    expires_at
  FROM public_visualisation_snapshots
  WHERE share_id = $1
`;

export const insertSnapshot = async (
  snapshot: SnapshotV1,
  options: InsertSnapshotOptions
): Promise<CreatedSnapshotRow> => {
  const algorithm = snapshot.algorithm;

  const parameters = [
    snapshot.schemaVersion,
    snapshot.rendererVersion,
    snapshot.title ?? null,
    snapshot.structure.type,
    JSON.stringify(snapshot.structure.state),
    algorithm?.name ?? null,
    algorithm
      ? JSON.stringify(algorithm.arguments)
      : null,
    algorithm
      ? JSON.stringify(algorithm.inputState)
      : null,
    options.expiresAt,
  ];

  const result = await pool.query<CreatedSnapshotRow>({
    text: INSERT_SNAPSHOT_SQL,
    values: parameters,
  });

  const createdRow = result.rows[0];

  if (!createdRow) {
    throw new Error(
      'Snapshot insert returned no database row.'
    );
  }

  return createdRow;
};

export const findPublicSnapshot = async (
  shareId: string
): Promise<PublicSnapshotRow | null> => {
  const result =
    await pool.query<PublicSnapshotQueryRow>({
      text: FIND_PUBLIC_SNAPSHOT_SQL,
      values: [shareId],
    });

  return result.rows[0] ?? null;
};