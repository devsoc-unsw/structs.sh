import { beforeEach, expect, it, vi } from 'vitest';
import axios from 'axios';
import { createSnapshot, getSnapshot } from '../snapshotApi';
import type { SnapshotV1 } from '../snapshotTypes';

vi.mock('axios', () => ({ default: { post: vi.fn(), get: vi.fn() } }));
vi.mock('@/utils/constants', () => ({ SERVER_URL: 'https://api.structs.example' }));
const draft: SnapshotV1 = {
  schemaVersion: 1,
  rendererVersion: 'preset-visualiser-v1',
  structure: { type: 'linked-list', state: { values: [] } },
  history: { initialState: { values: [] }, operations: [] },
};
const metadata = {
  shareId: 'c6bf4c83-7f25-4ae3-8826-f6bff0021173',
  createdAt: '2026-01-01T00:00:00Z',
  expiresAt: null,
};
beforeEach(() => vi.resetAllMocks());

it('posts the draft and decodes the creation response', async () => {
  const response = { ...metadata, shareUrl: `https://structs.example/s/${metadata.shareId}` };
  vi.mocked(axios.post).mockResolvedValue({ data: response });
  expect(await createSnapshot(draft)).toEqual(response);
  expect(axios.post).toHaveBeenCalledExactlyOnceWith(
    'https://api.structs.example/api/v1/snapshots',
    draft
  );
});

it('encodes the share ID as a single path segment and decodes the public response', async () => {
  const response = { ...draft, ...metadata };
  vi.mocked(axios.get).mockResolvedValue({ data: response });
  expect(await getSnapshot('id/with ?#%')).toEqual(response);
  expect(axios.get).toHaveBeenCalledExactlyOnceWith(
    'https://api.structs.example/api/v1/snapshots/id%2Fwith%20%3F%23%25'
  );
});

it('rejects malformed responses from both endpoints', async () => {
  vi.mocked(axios.post).mockResolvedValue({ data: { ...metadata, shareUrl: '/relative' } });
  vi.mocked(axios.get).mockResolvedValue({ data: { ...draft, ...metadata, schemaVersion: 2 } });
  await expect(createSnapshot(draft)).rejects.toThrow();
  await expect(getSnapshot(metadata.shareId)).rejects.toThrow();
});

it('preserves network errors for callers of both endpoints', async () => {
  const error = new Error('network unavailable');
  vi.mocked(axios.post).mockRejectedValue(error);
  vi.mocked(axios.get).mockRejectedValue(error);
  await expect(createSnapshot(draft)).rejects.toBe(error);
  await expect(getSnapshot(metadata.shareId)).rejects.toBe(error);
});
