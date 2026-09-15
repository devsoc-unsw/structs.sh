import { z } from 'zod';

const emptyStringToUndefined = (value: unknown): unknown =>
  value === '' ? undefined : value;

const optionalPositiveInteger = z.preprocess(
  emptyStringToUndefined,
  z.coerce.number().int().positive().optional()
);

const positiveIntegerWithDefault = (defaultValue: number) =>
  z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().default(defaultValue)
  );

const postgresUrlSchema = z.string().min(1).superRefine((value, context) => {
  try {
    const url = new URL(value);

    if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
      context.addIssue({
        code: 'custom',
        message: 'Must use the postgres:// or postgresql:// protocol',
      });
    }

    if (url.hostname === '') {
      context.addIssue({
        code: 'custom',
        message: 'Must include a database hostname',
      });
    }

    if (url.pathname === '' || url.pathname === '/') {
      context.addIssue({
        code: 'custom',
        message: 'Must include a database name',
      });
    }
  } catch {
    context.addIssue({
      code: 'custom',
      message: 'Must be a valid PostgreSQL connection URL',
    });
  }
});

const publicAppOriginSchema = z
  .string()
  .min(1)
  .superRefine((value, context) => {
    try {
      const url = new URL(value);

      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        context.addIssue({
          code: 'custom',
          message: 'Must use the http:// or https:// protocol',
        });
      }

      if (url.username || url.password) {
        context.addIssue({
          code: 'custom',
          message: 'Must not contain credentials',
        });
      }

      if (url.pathname !== '/' || url.search !== '' || url.hash !== '') {
        context.addIssue({
          code: 'custom',
          message: 'Must be an origin without a path, query, or fragment',
        });
      }
    } catch {
      context.addIssue({
        code: 'custom',
        message: 'Must be a valid absolute URL',
      });
    }
  })
  .transform((value) => new URL(value).origin);

const environmentSchema = z.object({
  DATABASE_URL: postgresUrlSchema,
  PUBLIC_APP_ORIGIN: publicAppOriginSchema,
  DATABASE_POOL_MAX: positiveIntegerWithDefault(10),
  SNAPSHOT_DEFAULT_TTL_DAYS: optionalPositiveInteger,
  PORT: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().min(1).max(65_535).default(8001)
  ),
});

export interface EnvironmentConfig {
  databaseUrl: string;
  publicAppOrigin: string;
  databasePoolMax: number;
  snapshotDefaultTtlDays?: number;
  port: number;
}

export const readEnvironment = (
  source: NodeJS.ProcessEnv = process.env
): Readonly<EnvironmentConfig> => {
  const result = environmentSchema.safeParse(source);

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => {
        const variableName = issue.path.join('.') || 'environment';
        return `- ${variableName}: ${issue.message}`;
      })
      .join('\n');

    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return Object.freeze({
    databaseUrl: result.data.DATABASE_URL,
    publicAppOrigin: result.data.PUBLIC_APP_ORIGIN,
    databasePoolMax: result.data.DATABASE_POOL_MAX,
    snapshotDefaultTtlDays: result.data.SNAPSHOT_DEFAULT_TTL_DAYS,
    port: result.data.PORT,
  });
};

// ES modules are evaluated once. Importing `env` from the server startup
// validates configuration once and reuses this immutable object everywhere.
export const env = readEnvironment();
