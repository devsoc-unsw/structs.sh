import { z } from 'zod';

export const snapshotValueSchema = z
  .number()
  .int()
  .min(0)
  .max(99);

export const snapshotValuesSchema = z
  .array(snapshotValueSchema)
  .max(100);

export const linkedListStateV1Schema = z
  .object({
    values: snapshotValuesSchema,
  })
  .strict();

const titleSchema = z
  .string()
  .trim()
  .min(1)
  .max(120);

const rendererVersionSchema = z
  .string()
  .min(1)
  .max(100);

const indexSchema = z
  .number()
  .int()
  .nonnegative();

const appendAlgorithmSchema = z
  .object({
    name: z.literal('append'),
    arguments: z
      .object({
        value: snapshotValueSchema,
      })
      .strict(),
    inputState: linkedListStateV1Schema,
  })
  .strict();

const prependAlgorithmSchema = z
  .object({
    name: z.literal('prepend'),
    arguments: z
      .object({
        value: snapshotValueSchema,
      })
      .strict(),
    inputState: linkedListStateV1Schema,
  })
  .strict();

const insertAlgorithmSchema = z
  .object({
    name: z.literal('insert'),
    arguments: z
      .object({
        value: snapshotValueSchema,
        index: indexSchema,
      })
      .strict(),
    inputState: linkedListStateV1Schema,
  })
  .strict();

const searchAlgorithmSchema = z
  .object({
    name: z.literal('search'),
    arguments: z
      .object({
        value: snapshotValueSchema,
      })
      .strict(),
    inputState: linkedListStateV1Schema,
  })
  .strict();

const deleteAlgorithmSchema = z
  .object({
    name: z.literal('delete'),
    arguments: z
      .object({
        index: indexSchema,
      })
      .strict(),
    inputState: linkedListStateV1Schema,
  })
  .strict();

export const linkedListAlgorithmV1Schema = z.discriminatedUnion(
  'name',
  [
    appendAlgorithmSchema,
    prependAlgorithmSchema,
    insertAlgorithmSchema,
    searchAlgorithmSchema,
    deleteAlgorithmSchema,
  ]
);

const linkedListStructureV1Schema = z
  .object({
    type: z.literal('linked-list'),
    state: linkedListStateV1Schema,
  })
  .strict();

export const snapshotV1Schema = z
  .object({
    schemaVersion: z.literal(1),
    rendererVersion: rendererVersionSchema,
    title: titleSchema.optional(),
    structure: linkedListStructureV1Schema,
    algorithm: linkedListAlgorithmV1Schema.optional(),
  })
  .strict();

export type LinkedListStateV1 = z.infer<
  typeof linkedListStateV1Schema
>;

export type LinkedListAlgorithmV1 = z.infer<
  typeof linkedListAlgorithmV1Schema
>;

export type SnapshotV1 = z.infer<typeof snapshotV1Schema>;