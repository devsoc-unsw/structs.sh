export const SNAPSHOT_SCHEMA_VERSION = 1 as const;

export const SUPPORTED_RENDERER_VERSION = 'preset-visualiser-v1' as const;

export interface LinkedListStateV1 {
  values: number[];
}

export type LinkedListAlgorithmV1 =
  | {
      name: 'append' | 'prepend' | 'search';
      arguments: {
        value: number;
      };
    }
  | {
      name: 'insert';
      arguments: {
        value: number;
        index: number;
      };
    }
  | {
      name: 'delete';
      arguments: {
        index: number;
      };
    };

export interface SnapshotV1 {
  schemaVersion: typeof SNAPSHOT_SCHEMA_VERSION;
  rendererVersion: typeof SUPPORTED_RENDERER_VERSION;
  title?: string;
  structure: {
    type: 'linked-list';
    state: LinkedListStateV1;
  };
  history: LinkedListHistoryV1;
}

export interface PublicSnapshotV1 extends SnapshotV1 {
  shareId: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface CreateSnapshotResponse {
  shareId: string;
  shareUrl: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface LinkedListHistoryV1 {
  initialState: LinkedListStateV1;
  operations: LinkedListAlgorithmV1[];
}
