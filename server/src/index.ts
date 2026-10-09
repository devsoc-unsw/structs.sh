import type { Server } from 'node:http';
import { createApp } from './app';
import { env } from './config/env';
import { checkDatabase, closeDatabase } from './db/pool';

let server: Server | undefined;
let shuttingDown = false;

const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`Received ${signal}; shutting down.`);

  if (server) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  await closeDatabase();
};

const start = async (): Promise<void> => {
  await checkDatabase();

  server = createApp().listen(env.port, () => {
    console.log(`Server listening on port ${env.port}.`);
  });
};

const handleShutdown = (signal: NodeJS.Signals): void => {
  void shutdown(signal)
    .then(() => {
      process.exit(0);
    })
    .catch((error: unknown) => {
      console.error(
        'Graceful shutdown failed:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      process.exit(1);
    });
};

process.once('SIGINT', () => {
  handleShutdown('SIGINT');
});

process.once('SIGTERM', () => {
  handleShutdown('SIGTERM');
});

void start().catch((error: unknown) => {
  console.error(
    'Server startup failed:',
    error instanceof Error ? error.message : 'Unknown error'
  );

  void closeDatabase().finally(() => {
    process.exit(1);
  });
});