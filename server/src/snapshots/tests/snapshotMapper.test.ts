import { describe, expect, it } from 'vitest';
import {
  mapPublicSnapshotRow,
  type PublicSnapshotRow,
} from '../snapshotMapper';

const SHARE_ID =
  '550e8400-e29b-41d4-a716-446655440000';

const createStaticRow = (
  overrides: Partial<PublicSnapshotRow> = {}
): PublicSnapshotRow => ({
  share_id: SHARE_ID,
  schema_version: 1,
  renderer_version: 'preset-visualiser-v1',
  title: null,
  structure_type: 'linked-list',
  structure_state: {
    values: [8, 13, 21],
  },
  algorithm_name: null,
  algorithm_arguments: null,
  algorithm_input_state: null,
  algorithm_state: null,
  playback_state: null,
  created_at: new Date(
    '2026-08-19T03:10:00.000Z'
  ),
  expires_at: null,
  ...overrides,
});

describe('mapPublicSnapshotRow', () => {
  it('maps a static snapshot', () => {
    const result = mapPublicSnapshotRow(
      createStaticRow()
    );

    expect(result).toEqual({
      shareId: SHARE_ID,
      schemaVersion: 1,
      rendererVersion: 'preset-visualiser-v1',
      structure: {
        type: 'linked-list',
        state: {
          values: [8, 13, 21],
        },
      },
      createdAt: '2026-08-19T03:10:00.000Z',
      expiresAt: null,
    });
  });

  it('maps an operation snapshot', () => {
    const result = mapPublicSnapshotRow(
      createStaticRow({
        title: 'Insert at index 1',
        structure_state: {
          values: [8, 5, 13, 21],
        },
        algorithm_name: 'insert',
        algorithm_arguments: {
          value: 5,
          index: 1,
        },
        algorithm_input_state: {
          values: [8, 13, 21],
        },
      })
    );

    expect(result).toEqual({
      shareId: SHARE_ID,
      schemaVersion: 1,
      rendererVersion: 'preset-visualiser-v1',
      title: 'Insert at index 1',
      structure: {
        type: 'linked-list',
        state: {
          values: [8, 5, 13, 21],
        },
      },
      algorithm: {
        name: 'insert',
        arguments: {
          value: 5,
          index: 1,
        },
        inputState: {
          values: [8, 13, 21],
        },
      },
      createdAt: '2026-08-19T03:10:00.000Z',
      expiresAt: null,
    });
  });

  it('maps an expiry date', () => {
    const result = mapPublicSnapshotRow(
      createStaticRow({
        expires_at: new Date(
          '2026-09-19T03:10:00.000Z'
        ),
      })
    );

    expect(result.expiresAt).toBe(
      '2026-09-19T03:10:00.000Z'
    );
  });

  it('rejects an unsupported renderer version', () => {
    expect(() =>
      mapPublicSnapshotRow(
        createStaticRow({
          renderer_version:
            'preset-visualiser-v2',
        })
      )
    ).toThrow();
  });

  it('rejects an unsupported structure type', () => {
    expect(() =>
      mapPublicSnapshotRow(
        createStaticRow({
          structure_type:
            'binary-search-tree',
        })
      )
    ).toThrow();
  });

  it('rejects corrupt structure state', () => {
    expect(() =>
      mapPublicSnapshotRow(
        createStaticRow({
          structure_state: {
            values: [100],
          },
        })
      )
    ).toThrow();
  });

  it('rejects partially populated algorithm data', () => {
    expect(() =>
      mapPublicSnapshotRow(
        createStaticRow({
          algorithm_name: 'append',
          algorithm_arguments: {
            value: 5,
          },
          algorithm_input_state: null,
        })
      )
    ).toThrow();
  });

  it('rejects Phase 2 algorithm state', () => {
    expect(() =>
      mapPublicSnapshotRow(
        createStaticRow({
          algorithm_name: 'search',
          algorithm_arguments: {
            value: 13,
          },
          algorithm_input_state: {
            values: [8, 13, 21],
          },
          algorithm_state: {
            currentIndex: 1,
          },
        })
      )
    ).toThrow();
  });

  it('rejects Phase 2 playback state', () => {
    expect(() =>
      mapPublicSnapshotRow(
        createStaticRow({
          playback_state: {
            progress: 0.5,
            status: 'paused',
            speed: 1,
            stepMode: false,
          },
        })
      )
    ).toThrow();
  });

  it('rejects invalid PostgreSQL dates', () => {
    expect(() =>
      mapPublicSnapshotRow(
        createStaticRow({
          created_at: new Date('invalid'),
        })
      )
    ).toThrow(
      'Invalid PostgreSQL timestamp in created_at.'
    );
  });

  it('does not expose internal row fields', () => {
    const row = {
      ...createStaticRow(),
      id: 'internal-id',
      owner_subject: 'internal-owner',
      revoked_at: new Date(),
    };

    const result = mapPublicSnapshotRow(row);

    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty(
      'owner_subject'
    );
    expect(result).not.toHaveProperty(
      'revoked_at'
    );
  });
});