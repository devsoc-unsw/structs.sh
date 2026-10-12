import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { existsSync, readdirSync, type Dirent } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { runMigrationCommand } from './migrationCommand';

vi.mock('node:fs', () => ({ existsSync: vi.fn(), readdirSync: vi.fn() }));
vi.mock('node:child_process', () => ({ spawnSync: vi.fn() }));
const files = (...names: string[]) =>
  vi
    .mocked(readdirSync)
    .mockReturnValue(
      names.map((name) => ({ name, isFile: () => true })) as unknown as Dirent<Buffer>[]
    );
beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.mocked(spawnSync).mockReturnValue({ status: 0 } as ReturnType<typeof spawnSync>);
});
afterEach(() => vi.restoreAllMocks());

it('skips a missing migrations directory', () => {
  vi.mocked(readdirSync).mockImplementation(() => {
    throw Object.assign(new Error('missing'), { code: 'ENOENT' });
  });
  expect(runMigrationCommand('up', '/server')).toBe(0);
  expect(spawnSync).not.toHaveBeenCalled();
});

it('propagates filesystem errors other than ENOENT', () => {
  const error = Object.assign(new Error('denied'), { code: 'EACCES' });
  vi.mocked(readdirSync).mockImplementation(() => {
    throw error;
  });
  expect(() => runMigrationCommand('up', '/server')).toThrow(error);
});

it('ignores hidden files, declarations, configs and directories', () => {
  // Supply directory entries directly to ensure a directory with a .ts suffix is ignored.
  vi.mocked(readdirSync).mockReturnValue([
    ...['.hidden.ts', 'types.d.ts', 'tsconfig.json', 'README.md'].map((name) => ({
      name,
      isFile: () => true,
    })),
    { name: 'directory.ts', isFile: () => false },
  ] as unknown as Dirent<Buffer>[]);
  expect(runMigrationCommand('up', '/server')).toBe(0);
  expect(spawnSync).not.toHaveBeenCalled();
});

it.each(['up', 'down'] as const)(
  'passes %s to the migration runner with matching file filters',
  (action) => {
    files('001_create.sql');
    expect(runMigrationCommand(action, '/server')).toBe(0);
    const call = vi.mocked(spawnSync).mock.calls[0];
    expect(call[0]).toBe(process.execPath);
    expect(call[1]).toEqual([
      '/server/node_modules/node-pg-migrate/bin/node-pg-migrate.js',
      action,
      '--migrations-dir',
      '/server/migrations',
      '--ignore-pattern',
      expect.any(String),
    ]);
    expect(call[2]).toEqual({ cwd: '/server', stdio: 'inherit' });
    const pattern = new RegExp(call[1]![5]);
    expect(pattern.test('001_create.sql')).toBe(false);
    expect(pattern.test('types.d.ts')).toBe(true);
    expect(pattern.test('tsconfig.json')).toBe(true);
  }
);

it('skips typechecking when migrations are only SQL or JavaScript', () => {
  files('001_create.sql', '002_update.js');
  expect(runMigrationCommand('typecheck', '/server')).toBe(0);
  expect(spawnSync).not.toHaveBeenCalled();
});

it('uses a migrations tsconfig when available', () => {
  files('001_create.ts');
  vi.mocked(existsSync).mockReturnValue(true);
  runMigrationCommand('typecheck', '/server');
  expect(spawnSync).toHaveBeenCalledWith(
    process.execPath,
    [
      '/server/node_modules/typescript/bin/tsc',
      '--project',
      '/server/migrations/tsconfig.json',
      '--noEmit',
    ],
    expect.any(Object)
  );
});

it('typechecks only TypeScript migrations when no config exists', () => {
  files('001_create.ts', '002_update.sql', '003_update.js', 'types.d.ts');
  runMigrationCommand('typecheck', '/server');
  expect(spawnSync).toHaveBeenCalledWith(
    process.execPath,
    [
      '/server/node_modules/typescript/bin/tsc',
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--target',
      'ES2022',
      '--module',
      'ESNext',
      '--moduleResolution',
      'bundler',
      '/server/migrations/001_create.ts',
    ],
    expect.any(Object)
  );
});

it.each([2, null])('reports child failure status %j', (status) => {
  files('001_create.ts');
  vi.mocked(spawnSync).mockReturnValue({ status } as ReturnType<typeof spawnSync>);
  expect(runMigrationCommand('up', '/server')).toBe(status ?? 1);
});

it('propagates spawn failures', () => {
  files('001_create.ts');
  const error = new Error('spawn failed');
  vi.mocked(spawnSync).mockReturnValue({ error } as ReturnType<typeof spawnSync>);
  expect(() => runMigrationCommand('up', '/server')).toThrow(error);
});
