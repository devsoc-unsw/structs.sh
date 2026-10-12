import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ query: vi.fn(), end: vi.fn(), on: vi.fn(), construct: vi.fn() }));
vi.mock('pg', () => ({
  Pool: class {
    query = mocks.query;
    end = mocks.end;
    on = mocks.on;
    constructor(options: unknown) {
      mocks.construct(options);
    }
  },
}));
vi.mock('../config/env', () => ({
  env: {
    databaseUrl: 'postgres://localhost/snapshots',
    databasePoolMax: 3,
    connectionTimeout: 100,
    statementTimeout: 200,
    queryTimeout: 300,
  },
}));
beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
});
afterEach(() => vi.restoreAllMocks());

it('configures pool sizing and all timeouts from validated settings', async () => {
  await import('./pool.js');
  expect(mocks.construct).toHaveBeenCalledExactlyOnceWith({
    connectionString: 'postgres://localhost/snapshots',
    max: 3,
    connectionTimeoutMillis: 100,
    statement_timeout: 200,
    query_timeout: 300,
  });
});

it('checks connectivity and closes the pool', async () => {
  const { checkDatabase, closeDatabase } = await import('./pool.js');
  await checkDatabase();
  expect(mocks.query).toHaveBeenCalledExactlyOnceWith('SELECT 1');
  await closeDatabase();
  expect(mocks.end).toHaveBeenCalledOnce();
});

it('propagates connection check and close failures', async () => {
  const { checkDatabase, closeDatabase } = await import('./pool.js');
  const error = new Error('database unavailable');
  mocks.query.mockRejectedValue(error);
  mocks.end.mockRejectedValue(error);
  await expect(checkDatabase()).rejects.toBe(error);
  await expect(closeDatabase()).rejects.toBe(error);
});

it('handles idle client errors without throwing', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  await import('./pool.js');
  expect(mocks.on).toHaveBeenCalledWith('error', expect.any(Function));
  const error = new Error('idle client disconnected');
  mocks.on.mock.calls[0][1](error);
  expect(log).toHaveBeenCalledWith('Unexpected error from an idle PostgreSQL client:', error);
});
