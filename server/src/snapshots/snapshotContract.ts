import { z } from 'zod';

export const SNAPSHOT_SCHEMA_VERSION = 1 as const;

export const SUPPORTED_RENDERER_VERSION =
  'preset-visualiser-v1' as const;

export const rendererVersionSchema = z.literal(
  SUPPORTED_RENDERER_VERSION
);

export type RendererVersion = z.infer<
  typeof rendererVersionSchema
>;

const linkedListValueSchema = z
  .number()
  .int()
  .min(0)
  .max(99);

const linkedListValuesSchema = z
  .array(linkedListValueSchema)
  .max(100);

export const linkedListStateSchema = z.strictObject({
  values: linkedListValuesSchema,
});

const nonNegativeIndexSchema = z
  .number()
  .int()
  .nonnegative();

const appendAlgorithmSchema = z.strictObject({
  name: z.literal('append'),
  arguments: z.strictObject({
    value: linkedListValueSchema,
  }),
  inputState: linkedListStateSchema,
});

const prependAlgorithmSchema = z.strictObject({
  name: z.literal('prepend'),
  arguments: z.strictObject({
    value: linkedListValueSchema,
  }),
  inputState: linkedListStateSchema,
});

const insertAlgorithmSchema = z.strictObject({
  name: z.literal('insert'),
  arguments: z.strictObject({
    value: linkedListValueSchema,
    index: nonNegativeIndexSchema,
  }),
  inputState: linkedListStateSchema,
});

const searchAlgorithmSchema = z.strictObject({
  name: z.literal('search'),
  arguments: z.strictObject({
    value: linkedListValueSchema,
  }),
  inputState: linkedListStateSchema,
});

const deleteAlgorithmSchema = z.strictObject({
  name: z.literal('delete'),
  arguments: z.strictObject({
    index: nonNegativeIndexSchema,
  }),
  inputState: linkedListStateSchema,
});

export const linkedListAlgorithmSchema = z.discriminatedUnion('name', [
  appendAlgorithmSchema,
  prependAlgorithmSchema,
  insertAlgorithmSchema,
  searchAlgorithmSchema,
  deleteAlgorithmSchema,
]);

export const linkedListStructureSchema = z.strictObject({
  type: z.literal('linked-list'),
  state: linkedListStateSchema,
});

// currently only support v1 schema.
export const snapshotV1Schema = z.strictObject({
  schemaVersion: z.literal(SNAPSHOT_SCHEMA_VERSION),

  rendererVersion: rendererVersionSchema,

  title: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .optional(),

  structure: linkedListStructureSchema,

  algorithm: linkedListAlgorithmSchema.optional(),
});

// for snapshots returned by the public API.
export const publicSnapshotV1Schema = z.strictObject({
  shareId: z.uuid(),

  ...snapshotV1Schema.shape,

  createdAt: z.iso.datetime(),

  expiresAt: z
    .iso
    .datetime()
    .nullable(),
});

export type LinkedListStateV1 = z.infer<
  typeof linkedListStateSchema
>;

export type LinkedListAlgorithmV1 = z.infer<
  typeof linkedListAlgorithmSchema
>;

export type LinkedListStructureV1 = z.infer<
  typeof linkedListStructureSchema
>;

export type SnapshotV1 = z.infer<typeof snapshotV1Schema>;

export type PublicSnapshotV1 = z.infer<
  typeof publicSnapshotV1Schema
>;