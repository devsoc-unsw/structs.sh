import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
    process.env.DATABASE_URL = 'postgresql://unused:unused@localhost/unused';
    process.env.PUBLIC_APP_ORIGIN = 'https://structs.test';
});
const database = vi.hoisted(() => ({ checkDatabase: vi.fn(), pool: {} }));
const snapshots = vi.hoisted(() => ({ findPublicSnapshot: vi.fn(), insertSnapshot: vi.fn() }));
vi.mock('../db/pool', () => database);
vi.mock('../snapshots/snapshotRepository', () => snapshots);

import { createApp, JSON_BODY_LIMIT_BYTES } from '../app';

beforeEach(() => vi.resetAllMocks());

describe('health endpoints', () => {
    it('reports liveness without accessing PostgreSQL', async () => {
        const response = await request(createApp()).get('/health/live');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
        expect(response.headers['cache-control']).toBe('no-store');
        expect(database.checkDatabase).not.toHaveBeenCalled();
    });

    it('reports readiness after checking PostgreSQL', async () => {
        database.checkDatabase.mockResolvedValue(undefined);
        const response = await request(createApp()).get('/health/ready');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ready' });
        expect(database.checkDatabase).toHaveBeenCalledOnce();
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it('returns 503 without leaking database errors and recovers', async () => {
        database.checkDatabase.mockRejectedValueOnce(new Error('private connection details'));
        const app = createApp();
        const response = await request(app).get('/health/ready');
        expect(response.status).toBe(503);
        expect(response.body).toEqual({ status: 'not_ready' });
        expect(response.headers['cache-control']).toBe('no-store');
        database.checkDatabase.mockResolvedValue(undefined);
        expect((await request(app).get('/health/ready')).status).toBe(200);
    });
});

describe('snapshot response policies', () => {
    const shareId = '550e8400-e29b-41d4-a716-446655440000';
    it('does not cache a successful read', async () => {
        snapshots.findPublicSnapshot.mockResolvedValue({
            share_id: shareId, schema_version: 1, renderer_version: 'preset-visualiser-v1',
            title: null, structure_type: 'linked-list', structure_state: { values: [1] },
            algorithm_name: null, algorithm_arguments: null, algorithm_input_state: null,
            algorithm_state: null, playback_state: null,
            created_at: new Date('2026-09-06T00:00:00Z'), expires_at: null,
        });
        const response = await request(createApp()).get('/api/v1/snapshots/' + shareId);
        expect(response.status).toBe(200);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it.each([shareId, 'not-a-uuid'])('does not cache an unavailable read: %s', async (id) => {
        snapshots.findPublicSnapshot.mockResolvedValue(null);
        const response = await request(createApp()).get('/api/v1/snapshots/' + id);
        expect(response.status).toBe(404);
        expect(response.headers['cache-control']).toBe('no-store');
    });

    it.each([
        ['/api/v1/snapshots', 'SNAPSHOT_TOO_LARGE'],
        ['/api/v1/snapshots/?test=1', 'SNAPSHOT_TOO_LARGE'],
        ['/api/save', 'PAYLOAD_TOO_LARGE'],
        ['/api/v1/snapshots-other', 'PAYLOAD_TOO_LARGE'],
    ])('classifies oversized requests to %s', async (path, code) => {
        const response = await request(createApp()).post(path)
            .send({ padding: 'x'.repeat(JSON_BODY_LIMIT_BYTES + 1) });
        expect(response.status).toBe(413);
        expect(response.body.error.code).toBe(code);
        expect(snapshots.insertSnapshot).not.toHaveBeenCalled();
    });
});
