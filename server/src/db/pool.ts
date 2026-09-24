import { Pool } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: env.databasePoolMax,
});

pool.on('error', (error) => {
  console.error(
    'Unexpected error from an idle PostgreSQL client:',
    error
  );
});

export const checkDatabase = async (): Promise<void> => {
  await pool.query('SELECT 1');
};

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
};