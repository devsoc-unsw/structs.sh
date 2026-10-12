import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

type MigrationAction = 'up' | 'down' | 'typecheck';

// Keep the preflight and migration runner's file selection identical.
const ignoredFile = /^(?!.*\.(?:js|ts|sql)$).*|\.d\.ts$/;

export const runMigrationCommand = (
  action: MigrationAction,
  serverDirectory = path.resolve(__dirname, '../..')
): number => {
  const directory = path.join(serverDirectory, 'migrations');
  let files: string[];
  try {
    files = readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && !entry.name.startsWith('.') && !ignoredFile.test(entry.name))
      .map((entry) => path.join(directory, entry.name));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    files = [];
  }

  if (files.length === 0) {
    console.log('No migration files found; skipping migration ' + action + '.');
    return 0;
  }

  let args: string[];
  if (action === 'typecheck') {
    const typescriptFiles = files.filter((file) => file.endsWith('.ts'));
    if (typescriptFiles.length === 0) {
      console.log('No TypeScript migrations found; skipping migration type check.');
      return 0;
    }
    const config = path.join(directory, 'tsconfig.json');
    args = [path.join(serverDirectory, 'node_modules/typescript/bin/tsc'),
      ...(existsSync(config)
        ? ['--project', config, '--noEmit']
        : ['--noEmit', '--strict', '--skipLibCheck', '--target', 'ES2022',
          '--module', 'ESNext', '--moduleResolution', 'bundler', ...typescriptFiles]),
    ];
  } else {
    args = [path.join(serverDirectory, 'node_modules/node-pg-migrate/bin/node-pg-migrate.js'),
      action, '--migrations-dir', directory, '--ignore-pattern', ignoredFile.source,
    ];
  }

  const result = spawnSync(process.execPath, args, { cwd: serverDirectory, stdio: 'inherit' });
  if (result.error) throw result.error;
  return result.status ?? 1;
};

if (require.main === module) {
  const action = process.argv[2];
  if (action !== 'up' && action !== 'down' && action !== 'typecheck') {
    console.error('Expected migration command: up, down, or typecheck.');
    process.exitCode = 1;
  } else {
    try {
      process.exitCode = runMigrationCommand(action);
    } catch (error) {
      console.error('Migration command failed:', error instanceof Error ? error.message : 'Unknown error');
      process.exitCode = 1;
    }
  }
}
