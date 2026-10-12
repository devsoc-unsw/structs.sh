import { afterAll, describe, expect, it, vi } from 'vitest';

// The module validates process.env on import; use synthetic configuration only.
vi.hoisted(() => {
  vi.stubEnv('DATABASE_URL', 'postgres://localhost/snapshots');
  vi.stubEnv('PUBLIC_APP_ORIGIN', 'https://structs.example');
});
import { readEnvironment } from './env';
afterAll(() => vi.unstubAllEnvs());
const valid = {
  DATABASE_URL: 'postgres://localhost/snapshots',
  PUBLIC_APP_ORIGIN: 'https://structs.example',
};

describe('readEnvironment', () => {
  it('returns immutable defaults and normalizes the public origin', () => {
    const result = readEnvironment({ ...valid, PUBLIC_APP_ORIGIN: 'https://structs.example:443/' });
    expect(result).toEqual({
      databaseUrl: valid.DATABASE_URL,
      publicAppOrigin: valid.PUBLIC_APP_ORIGIN,
      databasePoolMax: 10,
      snapshotDefaultTtlDays: undefined,
      port: 8001,
      connectionTimeout: 5000,
      statementTimeout: 10000,
      queryTimeout: 15000,
    });
    expect(Object.isFrozen(result)).toBe(true);
  });

  it('coerces explicit numeric settings and supports the postgresql scheme', () => {
    expect(
      readEnvironment({
        ...valid,
        DATABASE_URL: 'postgresql://localhost/snapshots',
        PUBLIC_APP_ORIGIN: 'http://localhost:3000',
        DATABASE_POOL_MAX: '1',
        SNAPSHOT_DEFAULT_TTL_DAYS: '2',
        PORT: '65535',
        STATEMENTTIMEOUT: '2147483647',
        CONNECTIONTIMEOUT: '1',
        QUERYTIMEOUT: '20',
      })
    ).toMatchObject({
      databasePoolMax: 1,
      snapshotDefaultTtlDays: 2,
      port: 65535,
      statementTimeout: 2147483647,
      connectionTimeout: 1,
      queryTimeout: 20,
    });
  });

  it('treats blank optional settings as absent', () => {
    expect(
      readEnvironment({
        ...valid,
        DATABASE_POOL_MAX: '',
        SNAPSHOT_DEFAULT_TTL_DAYS: '',
        PORT: '',
        STATEMENTTIMEOUT: '',
        CONNECTIONTIMEOUT: '',
        QUERYTIMEOUT: '',
      })
    ).toEqual(readEnvironment(valid));
  });

  it.each([
    'not a URL',
    'https://localhost/db',
    'postgres:///db',
    'postgres://localhost',
    'postgres://localhost/',
  ])('rejects invalid database URL %j', (url) => {
    expect(() => readEnvironment({ ...valid, DATABASE_URL: url })).toThrow('DATABASE_URL');
  });

  it.each([
    'not a URL',
    'ftp://structs.example',
    'https://user:password@structs.example',
    'https://structs.example/path',
    'https://structs.example?q=1',
    'https://structs.example/#fragment',
  ])('rejects invalid public origin %j', (origin) => {
    expect(() => readEnvironment({ ...valid, PUBLIC_APP_ORIGIN: origin })).toThrow(
      'PUBLIC_APP_ORIGIN'
    );
  });

  it.each([
    ['DATABASE_POOL_MAX', '0'],
    ['SNAPSHOT_DEFAULT_TTL_DAYS', '-1'],
    ['SNAPSHOT_DEFAULT_TTL_DAYS', '1.5'],
    ['PORT', '0'],
    ['PORT', '65536'],
    ['PORT', 'abc'],
    ['STATEMENTTIMEOUT', '2147483648'],
    ['CONNECTIONTIMEOUT', '0'],
    ['QUERYTIMEOUT', '1.5'],
  ])('rejects %s=%s with the variable name', (key, value) => {
    expect(() => readEnvironment({ ...valid, [key]: value })).toThrow(key);
  });

  it('reports all missing required settings together', () => {
    expect(() => readEnvironment({})).toThrow(/DATABASE_URL[\s\S]*PUBLIC_APP_ORIGIN/);
  });
});
