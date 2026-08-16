import { describe, expect, it } from 'vitest';
import {
  SNAPSHOT_SCHEMA_VERSION,
  SUPPORTED_RENDERER_VERSION,
  snapshotV1Schema,
  publicSnapshotV1Schema,
} from './snapshotContract';

const createStaticSnapshot = () => ({
  schemaVersion: SNAPSHOT_SCHEMA_VERSION,
  rendererVersion: SUPPORTED_RENDERER_VERSION,
  structure: {
    type: 'linked-list',
    state: {
      values: [8, 13, 21],
    },
  },
});

describe('snapshotV1Schema', () => {
  it('accepts a valid static snapshot', () => {
    const result = snapshotV1Schema.safeParse(
      createStaticSnapshot()
    );

    expect(result.success).toBe(true);
  });

  it.each([
    {
      name: 'append',
      arguments: { value: 5 },
    },
    {
      name: 'prepend',
      arguments: { value: 5 },
    },
    {
      name: 'insert',
      arguments: { value: 5, index: 1 },
    },
    {
      name: 'search',
      arguments: { value: 5 },
    },
    {
      name: 'delete',
      arguments: { index: 1 },
    },
  ])('accepts the $name operation', ({ name, arguments: args }) => {
    const snapshot = {
      ...createStaticSnapshot(),
      algorithm: {
        name,
        arguments: args,
        inputState: {
          values: [8, 13, 21],
        },
      },
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(true);
  });

  it('rejects an unsupported renderer version', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      rendererVersion: 'preset-visualiser-v2',
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });

  it('rejects an unsupported schema version', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      schemaVersion: 2,
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });

  it.each([-1, 100, 1.5])(
    'rejects an invalid Linked List value: %s',
    (value) => {
      const snapshot = {
        ...createStaticSnapshot(),
        structure: {
          type: 'linked-list',
          state: {
            values: [value],
          },
        },
      };

      expect(
        snapshotV1Schema.safeParse(snapshot).success
      ).toBe(false);
    }
  );

  it('rejects more than 100 values', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      structure: {
        type: 'linked-list',
        state: {
          values: Array.from({ length: 101 }, () => 1),
        },
      },
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });

  it('rejects missing algorithm arguments', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      algorithm: {
        name: 'insert',
        arguments: {
          value: 5,
        },
        inputState: {
          values: [8, 13, 21],
        },
      },
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });

  it('rejects extra algorithm arguments', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      algorithm: {
        name: 'append',
        arguments: {
          value: 5,
          index: 1,
        },
        inputState: {
          values: [8, 13, 21],
        },
      },
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });

  it.each([-1, 1.5])(
    'rejects an invalid index: %s',
    (index) => {
      const snapshot = {
        ...createStaticSnapshot(),
        algorithm: {
          name: 'delete',
          arguments: {
            index,
          },
          inputState: {
            values: [8, 13, 21],
          },
        },
      };

      expect(
        snapshotV1Schema.safeParse(snapshot).success
      ).toBe(false);
    }
  );

  it('rejects unknown top-level fields', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      unexpected: true,
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });

  it('rejects playback during Phase 1', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      playback: {
        progress: 0.5,
        status: 'paused',
        speed: 1,
        stepMode: false,
      },
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });

  it('rejects algorithm state during Phase 1', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      algorithm: {
        name: 'search',
        arguments: {
          value: 13,
        },
        inputState: {
          values: [8, 13, 21],
        },
        state: {
          currentIndex: 1,
        },
      },
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });

  it('trims a valid title', () => {
    const result = snapshotV1Schema.safeParse({
      ...createStaticSnapshot(),
      title: '  Example snapshot  ',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.title).toBe('Example snapshot');
    }
  });

  it('rejects a whitespace-only title', () => {
    const snapshot = {
      ...createStaticSnapshot(),
      title: '   ',
    };

    expect(
      snapshotV1Schema.safeParse(snapshot).success
    ).toBe(false);
  });
});

it('accepts a valid public snapshot', () => {
  const result = publicSnapshotV1Schema.safeParse({
    shareId: '550e8400-e29b-41d4-a716-446655440000',
    ...createStaticSnapshot(),
    createdAt: '2026-08-16T03:10:00.000Z',
    expiresAt: null,
  });

  expect(result.success).toBe(true);
});

it('accepts a public snapshot with an expiry date', () => {
  const result = publicSnapshotV1Schema.safeParse({
    shareId: '550e8400-e29b-41d4-a716-446655440000',
    ...createStaticSnapshot(),
    createdAt: '2026-08-16T03:10:00.000Z',
    expiresAt: '2026-09-16T03:10:00.000Z',
  });

  expect(result.success).toBe(true);
});

it('rejects an invalid public snapshot ID', () => {
  const result = publicSnapshotV1Schema.safeParse({
    shareId: 'not-a-uuid',
    ...createStaticSnapshot(),
    createdAt: '2026-08-16T03:10:00.000Z',
    expiresAt: null,
  });

  expect(result.success).toBe(false);
});

it('rejects an invalid creation date', () => {
  const result = publicSnapshotV1Schema.safeParse({
    shareId: '550e8400-e29b-41d4-a716-446655440000',
    ...createStaticSnapshot(),
    createdAt: 'not-a-date',
    expiresAt: null,
  });

  expect(result.success).toBe(false);
});