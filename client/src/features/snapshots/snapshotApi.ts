import axios from 'axios';

import { SERVER_URL } from '@/utils/constants';

import { decodeCreateSnapshotResponse, decodePublicSnapshot } from './snapshotDecoder';
import type { CreateSnapshotResponse, PublicSnapshotV1, SnapshotV1 } from './snapshotTypes';

export const createSnapshot = async (snapshot: SnapshotV1): Promise<CreateSnapshotResponse> => {
  const response = await axios.post<unknown>(`${SERVER_URL}/api/v1/snapshots`, snapshot);

  return decodeCreateSnapshotResponse(response.data);
};

export const getSnapshot = async (shareId: string): Promise<PublicSnapshotV1> => {
  const response = await axios.get<unknown>(
    `${SERVER_URL}/api/v1/snapshots/${encodeURIComponent(shareId)}`
  );

  return decodePublicSnapshot(response.data);
};
