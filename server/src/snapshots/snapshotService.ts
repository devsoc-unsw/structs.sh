import { z } from 'zod';
import { env } from '../config/env';
import {
  snapshotV1Schema,
  type PublicSnapshotV1,
} from './snapshotContract';
import {
  isSnapshotConsistent,
} from './snapshotConsistency';
import {
  mapPublicSnapshotRow,
} from './snapshotMapper';
import {
  findPublicSnapshot,
  insertSnapshot,
} from './snapshotRepository';

const MILLISECONDS_PER_DAY =
  24 * 60 * 60 * 1000;

const shareIdSchema = z.uuid();

export interface SnapshotValidationField {
  path: string;
  message: string;
}

export interface CreatedSnapshot {
  shareId: string;
  shareUrl: string;
  createdAt: string;
  expiresAt: string | null;
}

export class InvalidSnapshotError extends Error {
  readonly fields: SnapshotValidationField[];

  constructor(fields: SnapshotValidationField[]) {
    super('The snapshot could not be created.');
    this.name = 'InvalidSnapshotError';
    this.fields = fields;
  }
}

export class InconsistentSnapshotError
  extends Error {
  constructor() {
    super(
      'The captured state does not match the algorithm result.'
    );
    this.name = 'InconsistentSnapshotError';
  }
}

const calculateExpiresAt = (
  now: Date
): Date | null => {
  const ttlDays = env.snapshotDefaultTtlDays;

  if (ttlDays === undefined) {
    return null;
  }

  return new Date(
    now.getTime() +
      ttlDays * MILLISECONDS_PER_DAY
  );
};

const mapValidationFields = (
  error: z.ZodError
): SnapshotValidationField[] =>
  error.issues.map((issue) => ({
    path: issue.path.map(String).join('.'),
    message: issue.message,
  }));

export const createSnapshot = async (
  input: unknown
): Promise<CreatedSnapshot> => {
  const parsed = snapshotV1Schema.safeParse(input);

  if (!parsed.success) {
    throw new InvalidSnapshotError(
      mapValidationFields(parsed.error)
    );
  }

  const snapshot = parsed.data;

  if (!isSnapshotConsistent(snapshot)) {
    throw new InconsistentSnapshotError();
  }

  const expiresAt = calculateExpiresAt(
    new Date()
  );

  const created = await insertSnapshot(
    snapshot,
    {
      expiresAt,
    }
  );

  return {
    shareId: created.share_id,

    shareUrl: new URL(
      `/s/${created.share_id}`,
      env.publicAppOrigin
    ).toString(),

    createdAt:
      created.created_at.toISOString(),

    expiresAt:
      created.expires_at?.toISOString() ??
      null,
  };
};

export const getPublicSnapshot = async (
  shareId: string
): Promise<PublicSnapshotV1 | null> => {
  /*
   * Malformed, missing, expired and revoked IDs all appear
   * unavailable to the public API.
   */
  if (!shareIdSchema.safeParse(shareId).success) {
    return null;
  }

  const row = await findPublicSnapshot(shareId);

  if (row === null) {
    return null;
  }

  return mapPublicSnapshotRow(row);
};