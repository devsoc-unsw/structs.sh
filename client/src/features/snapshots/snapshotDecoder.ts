import { z } from 'zod';

import { SNAPSHOT_SCHEMA_VERSION, SUPPORTED_RENDERER_VERSION } from './snapshotTypes';

import type { CreateSnapshotResponse, PublicSnapshotV1 } from './snapshotTypes';

export const createSnapshotResponseSchema = z.strictObject({
  shareId: z.uuid(),
  shareUrl: z.url(),
  createdAt: z.iso.datetime(),
  expiresAt: z.iso.datetime().nullable(),
});

export const decodeCreateSnapshotResponse = (value: unknown): CreateSnapshotResponse =>
  createSnapshotResponseSchema.parse(value);

const linkedListStateSchema = z.strictObject({
  values: z.array(z.number().int().min(0).max(99)).max(100),
});

const linkedListAlgorithmSchema = z.discriminatedUnion('name', [
  z.strictObject({
    name: z.literal('append'),
    arguments: z.strictObject({
      value: z.number().int().min(0).max(99),
    }),
    inputState: linkedListStateSchema,
  }),

  z.strictObject({
    name: z.literal('prepend'),
    arguments: z.strictObject({
      value: z.number().int().min(0).max(99),
    }),
    inputState: linkedListStateSchema,
  }),

  z.strictObject({
    name: z.literal('insert'),
    arguments: z.strictObject({
      value: z.number().int().min(0).max(99),
      index: z.number().int().nonnegative(),
    }),
    inputState: linkedListStateSchema,
  }),

  z.strictObject({
    name: z.literal('search'),
    arguments: z.strictObject({
      value: z.number().int().min(0).max(99),
    }),
    inputState: linkedListStateSchema,
  }),

  z.strictObject({
    name: z.literal('delete'),
    arguments: z.strictObject({
      index: z.number().int().nonnegative(),
    }),
    inputState: linkedListStateSchema,
  }),
]);

export const publicSnapshotV1Schema = z.strictObject({
  shareId: z.uuid(),
  schemaVersion: z.literal(SNAPSHOT_SCHEMA_VERSION),
  rendererVersion: z.literal(SUPPORTED_RENDERER_VERSION),
  title: z.string().trim().min(1).max(120).optional(),
  structure: z.strictObject({
    type: z.literal('linked-list'),
    state: linkedListStateSchema,
  }),
  algorithm: linkedListAlgorithmSchema.optional(),
  createdAt: z.iso.datetime(),
  expiresAt: z.iso.datetime().nullable(),
});

export const decodePublicSnapshot = (value: unknown): PublicSnapshotV1 =>
  publicSnapshotV1Schema.parse(value);
