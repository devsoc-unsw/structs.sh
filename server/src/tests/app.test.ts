import request from 'supertest';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

/*
 * app.ts imports and validates env immediately.
 * Set valid test values before app.ts is imported.
 *
 * These tests never connect to this database.
 */
vi.hoisted(() => {
  process.env.DATABASE_URL =
    'postgresql://unused:unused@localhost/unused';

  process.env.PUBLIC_APP_ORIGIN =
    'http://localhost:3000';
});

import { createApp, JSON_BODY_LIMIT_BYTES } from '../app';

describe('application request handling', () => {
  it('returns 400 for malformed JSON', async () => {
    const response = await request(
      createApp()
    )
      .post('/api/v1/snapshots')
      .set(
        'Content-Type',
        'application/json'
      )
      .send('{"structure":');

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: {
        code: 'INVALID_JSON',
        message:
          'The request body must contain valid JSON.',
      },
    });
  });

  it('returns 413 for an oversized JSON body', async () => {
    const response = await request(
      createApp()
    )
      .post('/api/v1/snapshots')
      .send({
        padding: 'x'.repeat(
          JSON_BODY_LIMIT_BYTES + 1
        ),
      });

    expect(response.status).toBe(413);

    expect(response.body).toEqual({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message:
          'The request body exceeds the allowed size.',
      },
    });
  });

  it('returns 404 for an unknown route', async () => {
    const response = await request(
      createApp()
    ).get('/route-that-does-not-exist');

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: {
        code: 'NOT_FOUND',
        message:
          'The requested resource was not found.',
      },
    });
  });
});