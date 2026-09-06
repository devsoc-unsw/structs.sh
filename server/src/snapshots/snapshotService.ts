import { z } from 'zod';
import { env } from '../config/env';
import {
    SNAPSHOT_SCHEMA_VERSION,
    snapshotV1Schema,
    SUPPORTED_RENDERER_VERSION,
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

export class UnsupportedSchemaVersionError extends Error {
    constructor() {
        super('The snapshot schema version is not supported.');
        this.name = 'UnsupportedSchemaVersionError';
    }
}

export class UnsupportedVisualisationError extends Error {
    constructor() {
        super('The requested visualisation is not supported.');
        this.name = 'UnsupportedVisualisationError';
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

export const createSnapshotValidation = ( input: unknown ): void => {
    // schema version
    if ( typeof input !== 'object' || input === null || Array.isArray(input) ) {
        return;
    }

    if (
        'schemaVersion' in input
		&& typeof input.schemaVersion === 'number'
		&& input.schemaVersion !== SNAPSHOT_SCHEMA_VERSION
    ) {
        throw new UnsupportedSchemaVersionError();
    }

    if (
        'rendererVersion' in input
		&& typeof input.rendererVersion === 'string'
		&& input.rendererVersion !== SUPPORTED_RENDERER_VERSION
    ) {
        throw new UnsupportedVisualisationError();
    }

    if (
        'structure' in input && typeof input.structure === 'object' &&
        input.structure !== null && !Array.isArray(input.structure) &&
        'type' in input.structure && typeof input.structure.type === 'string' &&
        input.structure.type !== 'linked-list'
    ) {
        throw new UnsupportedVisualisationError();
    }

    if (
        'algorithm' in input && typeof input.algorithm === 'object' &&
        input.algorithm !== null && !Array.isArray(input.algorithm) &&
        'name' in input.algorithm && typeof input.algorithm.name === 'string' &&
        !['append', 'prepend', 'insert', 'search', 'delete'].includes(input.algorithm.name)
    ) {
        throw new UnsupportedVisualisationError();
    }
};

export const createSnapshot = async (
    input: unknown
): Promise<CreatedSnapshot> => {
    createSnapshotValidation(input);
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
