import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { promises as fs } from 'fs';
import path from 'path';
import { createApp, JSON_BODY_LIMIT_BYTES } from './app';
import {
  createSnapshot,
  getPublicSnapshot,
  InvalidSnapshotError,
  InconsistentSnapshotError,
} from './snapshots/snapshotService';

vi.mock('./config/env', () => ({ env: { publicAppOrigin: 'https://structs.example' } }));
vi.mock('./snapshots/snapshotRepository', () => ({
  insertSnapshot: vi.fn(),
  findPublicSnapshot: vi.fn(),
}));
vi.mock('./snapshots/snapshotService', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./snapshots/snapshotService')>()),
  createSnapshot: vi.fn(),
  getPublicSnapshot: vi.fn(),
}));
vi.mock('fs', () => ({ promises: { readdir: vi.fn(), readFile: vi.fn() } }));
const shareId = 'c6bf4c83-7f25-4ae3-8826-f6bff0021173';
const app = createApp();
beforeEach(() => vi.resetAllMocks());
afterEach(() => vi.restoreAllMocks());

describe('snapshot HTTP contract', () => {
  it('returns creation metadata and a resource Location', async () => {
    const created = {
      shareId,
      shareUrl: `https://structs.example/s/${shareId}`,
      createdAt: '2026-01-01T00:00:00Z',
      expiresAt: null,
    };
    vi.mocked(createSnapshot).mockResolvedValue(created);
    const body = { schemaVersion: 1 };
    const response = await request(app).post('/api/v1/snapshots').send(body);
    expect(response.status).toBe(201);
    expect(response.headers.location).toBe(`/api/v1/snapshots/${shareId}`);
    expect(response.body).toEqual(created);
    expect(createSnapshot).toHaveBeenCalledExactlyOnceWith(body);
  });

  it('returns the public snapshot from the service', async () => {
    const snapshot = {
      shareId,
      schemaVersion: 1,
      rendererVersion: 'preset-visualiser-v1',
      structure: { type: 'linked-list', state: { values: [] } },
      history: { initialState: { values: [] }, operations: [] },
      createdAt: '2026-01-01T00:00:00Z',
      expiresAt: null,
    } as const;
    vi.mocked(getPublicSnapshot).mockResolvedValue({
      ...snapshot,
      structure: { type: 'linked-list', state: { values: [] } },
      history: { initialState: { values: [] }, operations: [] },
    });
    const response = await request(app).get(`/api/v1/snapshots/${shareId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(snapshot);
    expect(getPublicSnapshot).toHaveBeenCalledExactlyOnceWith(shareId);
  });

  it('uses the same unavailable response when no snapshot is returned', async () => {
    vi.mocked(getPublicSnapshot).mockResolvedValue(null);
    const response = await request(app).get(`/api/v1/snapshots/${shareId}`);
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('SNAPSHOT_NOT_FOUND');
  });

  it('exposes validation field paths for invalid snapshots', async () => {
    const fields = [{ path: 'history.operations', message: 'Too many operations' }];
    vi.mocked(createSnapshot).mockRejectedValue(new InvalidSnapshotError(fields));
    const response = await request(app).post('/api/v1/snapshots').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      code: 'INVALID_SNAPSHOT',
      message: 'The snapshot could not be created.',
      fields,
    });
  });

  it('returns a generic validation message for inconsistent history', async () => {
    vi.mocked(createSnapshot).mockRejectedValue(new InconsistentSnapshotError());
    const response = await request(app).post('/api/v1/snapshots').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toEqual({
      code: 'INVALID_SNAPSHOT',
      message: 'The snapshot could not be created.',
    });
  });

  it.each(['get', 'post'] as const)(
    'forwards unexpected %s failures without leaking internal details',
    async (method) => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const error = new Error('private database details');
      vi.mocked(createSnapshot).mockRejectedValue(error);
      vi.mocked(getPublicSnapshot).mockRejectedValue(error);
      const response =
        method === 'get'
          ? await request(app).get(`/api/v1/snapshots/${shareId}`)
          : await request(app).post('/api/v1/snapshots').send({});
      expect(response.status).toBe(500);
      expect(response.body.error).toEqual({
        code: 'INTERNAL_ERROR',
        message: 'An unexpected server error occurred.',
      });
    }
  );

  it('rejects malformed JSON before calling the service', async () => {
    const response = await request(app).post('/api/v1/snapshots').type('json').send('{');
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_JSON');
    expect(createSnapshot).not.toHaveBeenCalled();
  });

  it('rejects bodies over the configured byte limit before calling the service', async () => {
    const response = await request(app)
      .post('/api/v1/snapshots')
      .send({ title: 'x'.repeat(JSON_BODY_LIMIT_BYTES) });
    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe('PAYLOAD_TOO_LARGE');
    expect(createSnapshot).not.toHaveBeenCalled();
  });

  it('returns the configured CORS origin and handles preflight', async () => {
    const response = await request(app)
      .options('/api/v1/snapshots')
      .set('Origin', 'https://structs.example')
      .set('Access-Control-Request-Method', 'POST');
    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe('https://structs.example');
  });

  it('returns a structured 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown');
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});

describe('workspace routes', () => {
  it('lists a valid user workspace directory', async () => {
    vi.mocked(fs.readdir).mockResolvedValue(['example'] as never);
    const response = await request(app)
      .get('/api/retrieveWorkspaces')
      .query({ username: 'test-user' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ workspaces: ['example'] });
    expect(fs.readdir).toHaveBeenCalledWith(path.resolve('user-files/test-user/workspaces'));
  });

  it('reads a valid workspace file as UTF-8', async () => {
    vi.mocked(fs.readFile).mockResolvedValue('int main(void) {}');
    const response = await request(app)
      .get('/api/retrieveFile')
      .query({ username: 'test-user', workspace: 'example', filename: 'main.c' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ content: 'int main(void) {}' });
    expect(fs.readFile).toHaveBeenCalledWith(
      path.resolve('user-files/test-user/workspaces/example/main.c'),
      'utf8'
    );
  });

  it.each(['username', 'workspace', 'filename'])(
    'rejects a missing or non-scalar %s',
    async (field) => {
      for (const value of ['', ['one', 'two'], { nested: 'value' }]) {
        const response = await request(app)
          .get('/api/retrieveFile')
          .query({ username: 'user', workspace: 'example', filename: 'main.c', [field]: value });
        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('INVALID_REQUEST');
      }
      expect(fs.readFile).not.toHaveBeenCalled();
    }
  );

  it.each(['username', 'workspace', 'filename'])(
    'blocks traversal in %s before filesystem access',
    async (field) => {
      for (const value of [
        '.',
        '..',
        '../escape',
        '/etc/passwd',
        'nested/file',
        'nested\\file',
        '%2e%2e',
        'a\0b',
      ]) {
        const response = await request(app)
          .get('/api/retrieveFile')
          .query({ username: 'user', workspace: 'example', filename: 'main.c', [field]: value });
        expect(response.status).toBe(404);
        expect(response.body.error.code).toBe('FILE_NOT_FOUND');
      }
      expect(fs.readFile).not.toHaveBeenCalled();
    }
  );

  it('rejects missing usernames and traversal on workspace listing', async () => {
    expect((await request(app).get('/api/retrieveWorkspaces')).status).toBe(400);
    const response = await request(app).get('/api/retrieveWorkspaces').query({ username: '..' });
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe('WORKSPACES_NOT_FOUND');
    expect(fs.readdir).not.toHaveBeenCalled();
  });

  it('hides filesystem failures behind unavailable responses', async () => {
    vi.mocked(fs.readdir).mockRejectedValue(new Error('private path'));
    vi.mocked(fs.readFile).mockRejectedValue(new Error('private path'));
    const listing = await request(app).get('/api/retrieveWorkspaces').query({ username: 'user' });
    const file = await request(app)
      .get('/api/retrieveFile')
      .query({ username: 'user', workspace: 'example', filename: 'main.c' });
    expect(listing.status).toBe(404);
    expect(file.status).toBe(404);
    expect(JSON.stringify([listing.body, file.body])).not.toContain('private path');
  });
});

it.each([
  '/api/getAll',
  '/api/getOwnedData',
  '/api/save',
  '/api/delete',
  '/api/deleteAll',
  '/api/deleteAllUsers',
  '/api/getAllUsers',
  '/auth/register',
  '/auth/login',
])('reports unavailable legacy route %s for reads and writes', async (url) => {
  for (const method of ['get', 'post'] as const) {
    const response = await request(app)[method](url);
    expect(response.status).toBe(503);
    expect(response.body.error.code).toBe('LEGACY_DATABASE_UNAVAILABLE');
  }
});
