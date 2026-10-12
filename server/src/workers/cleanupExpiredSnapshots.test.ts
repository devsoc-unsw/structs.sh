import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanupExpiredSnapshots, readCleanupOptions, runCleanup } from './cleanupExpiredSnapshots';
import { pool, closeDatabase } from '../db/pool';

vi.mock('../db/pool', () => ({ pool: { connect: vi.fn() }, closeDatabase: vi.fn() }));
const client = { query: vi.fn(), release: vi.fn() };
const options = { batchSize: 2, maxBatches: 3, graceHours: 24 };
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(pool.connect).mockResolvedValue(client as never);
});

describe('readCleanupOptions', () => {
  it('defaults missing and empty environment values', () => {
    expect(readCleanupOptions({})).toEqual({ batchSize: 500, maxBatches: 100, graceHours: 24 });
    expect(
      readCleanupOptions({
        SNAPSHOT_CLEANUP_BATCH_SIZE: '',
        SNAPSHOT_CLEANUP_MAX_BATCHES: '',
        SNAPSHOT_CLEANUP_GRACE_HOURS: '',
      })
    ).toEqual(readCleanupOptions({}));
  });

  it('accepts exact limits including zero grace', () => {
    expect(
      readCleanupOptions({
        SNAPSHOT_CLEANUP_BATCH_SIZE: '10000',
        SNAPSHOT_CLEANUP_MAX_BATCHES: '1000',
        SNAPSHOT_CLEANUP_GRACE_HOURS: '0',
      })
    ).toEqual({ batchSize: 10000, maxBatches: 1000, graceHours: 0 });
    expect(readCleanupOptions({ SNAPSHOT_CLEANUP_GRACE_HOURS: '87600' }).graceHours).toBe(87600);
  });

  it.each([
    ['SNAPSHOT_CLEANUP_BATCH_SIZE', '0'],
    ['SNAPSHOT_CLEANUP_BATCH_SIZE', '10001'],
    ['SNAPSHOT_CLEANUP_MAX_BATCHES', '0'],
    ['SNAPSHOT_CLEANUP_MAX_BATCHES', '1001'],
    ['SNAPSHOT_CLEANUP_GRACE_HOURS', '-1'],
    ['SNAPSHOT_CLEANUP_GRACE_HOURS', '87601'],
    ['SNAPSHOT_CLEANUP_BATCH_SIZE', '1.5'],
    ['SNAPSHOT_CLEANUP_BATCH_SIZE', 'invalid'],
  ])('rejects %s=%s', (key, value) => {
    expect(() => readCleanupOptions({ [key]: value })).toThrow();
  });
});

describe('cleanupExpiredSnapshots', () => {
  it('accumulates full batches and stops at a partial batch', async () => {
    client.query.mockResolvedValueOnce({ rowCount: 2 }).mockResolvedValueOnce({ rowCount: 1 });
    expect(await cleanupExpiredSnapshots(options)).toEqual({
      deleted: 3,
      batches: 2,
      batchLimitReached: false,
    });
    expect(client.query).toHaveBeenCalledTimes(2);
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining('FOR UPDATE SKIP LOCKED'),
      [24, 2]
    );
    expect(client.query).toHaveBeenCalledWith(
      expect.stringContaining(
        "expires_at <= statement_timestamp() - ($1::int * interval '1 hour')"
      ),
      [24, 2]
    );
    expect(client.release).toHaveBeenCalledOnce();
  });

  it.each([0, null])('stops immediately on rowCount %j', async (rowCount) => {
    client.query.mockResolvedValue({ rowCount });
    expect(await cleanupExpiredSnapshots(options)).toEqual({
      deleted: 0,
      batches: 1,
      batchLimitReached: false,
    });
    expect(client.query).toHaveBeenCalledOnce();
    expect(client.release).toHaveBeenCalledOnce();
  });

  it('never exceeds the batch limit', async () => {
    client.query.mockResolvedValue({ rowCount: 2 });
    expect(await cleanupExpiredSnapshots(options)).toEqual({
      deleted: 6,
      batches: 3,
      batchLimitReached: true,
    });
    expect(client.query).toHaveBeenCalledTimes(3);
    expect(client.release).toHaveBeenCalledOnce();
  });

  it('validates options before acquiring a connection', async () => {
    await expect(cleanupExpiredSnapshots({ ...options, batchSize: 0 })).rejects.toThrow();
    expect(pool.connect).not.toHaveBeenCalled();
  });

  it('releases its connection after a later batch fails', async () => {
    const error = new Error('delete failed');
    client.query.mockResolvedValueOnce({ rowCount: 2 }).mockRejectedValueOnce(error);
    await expect(cleanupExpiredSnapshots(options)).rejects.toBe(error);
    expect(client.release).toHaveBeenCalledOnce();
  });

  it('propagates connection failures without querying', async () => {
    const error = new Error('connect failed');
    vi.mocked(pool.connect).mockRejectedValue(error);
    await expect(cleanupExpiredSnapshots(options)).rejects.toBe(error);
    expect(client.query).not.toHaveBeenCalled();
    expect(client.release).not.toHaveBeenCalled();
  });
});

describe('runCleanup', () => {
  it('closes the pool after a successful job', async () => {
    client.query.mockResolvedValue({ rowCount: 0 });
    expect(await runCleanup()).toEqual({ deleted: 0, batches: 1, batchLimitReached: false });
    expect(closeDatabase).toHaveBeenCalledOnce();
  });

  it('closes the pool even if connecting fails', async () => {
    const error = new Error('connect failed');
    vi.mocked(pool.connect).mockRejectedValue(error);
    await expect(runCleanup()).rejects.toBe(error);
    expect(closeDatabase).toHaveBeenCalledOnce();
  });
});
