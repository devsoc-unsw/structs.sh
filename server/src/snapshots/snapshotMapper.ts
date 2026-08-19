import {
  publicSnapshotV1Schema,
  type PublicSnapshotV1,
} from './snapshotContract';

/**
 * Raw row returned by public_visualisation_snapshots.
 *
 * Database strings remain broad because the database is an external
 * boundary. Zod validates supported versions, structure types, and
 * algorithm names after mapping.
 */
export interface PublicSnapshotRow {
  share_id: string;
  schema_version: number;
  renderer_version: string;
  title: string | null;
  structure_type: string;
  structure_state: unknown;
  algorithm_name: string | null;
  algorithm_arguments: unknown | null;
  algorithm_input_state: unknown | null;
  algorithm_state: unknown | null;
  playback_state: unknown | null;
  created_at: Date;
  expires_at: Date | null;
}

/**
 *
 * @param value - input string
 * @param columnName - the column the input `value` from
 * @returns the extract date from input
 */
const toIsoString = (
  value: unknown,
  columnName: string
): string => {
  if (
    !(value instanceof Date) ||
    Number.isNaN(value.getTime())
  ) {
    throw new TypeError(
      `Invalid PostgreSQL timestamp in ${columnName}.`
    );
  }

  return value.toISOString();
};

export const mapPublicSnapshotRow = (
  row: PublicSnapshotRow
): PublicSnapshotV1 => {
  const hasAlgorithmData = [
    row.algorithm_name,
    row.algorithm_arguments,
    row.algorithm_input_state,
    row.algorithm_state
  ].some((value) => value != null);

  const algorithm = hasAlgorithmData
    ? {
      name: row.algorithm_name,
      arguments: row.algorithm_arguments,
      inputState: row.algorithm_input_state,
      ...(row.algorithm_state === null
        ? {}
        : { state: row.algorithm_state }),
    }
    : undefined;

  const mappedSnapshot: unknown = {
    shareId: row.share_id,
    schemaVersion: row.schema_version,
    rendererVersion: row.renderer_version,
    structure: {
      type: row.structure_type,
      state: row.structure_state,
    },
    ...(row.title === null
      ? {}
      : { title: row.title }),
    ...(algorithm === undefined
      ? {}
      : { algorithm }),

    // Phase 1 rejects playback state.
    ...(row.playback_state === null
      ? {}
      : { playback: row.playback_state }),

    createdAt: toIsoString(row.created_at, 'created_at'),

    expiresAt: row.expires_at === null
      ? null
      : toIsoString(row.expires_at, 'expires_at'),
  };

  // the unknown type `mappedSnapshot` generated based on data
  // fetched from postgresql will be checked here by zod,
  // and return a valid `PublicSnapshotV1` type if the data is valid.
  return publicSnapshotV1Schema.parse(mappedSnapshot);
};