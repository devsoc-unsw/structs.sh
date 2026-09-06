import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
    process.env.DATABASE_URL = 'postgresql://unused:unused@localhost/unused';
    process.env.PUBLIC_APP_ORIGIN = 'https://structs.test';
});

const repository = vi.hoisted(() => ({
    insertSnapshot: vi.fn(),
    findPublicSnapshot: vi.fn(),
}));

vi.mock('../snapshotRepository', () => repository);

import { createApp } from '../../app';

const snapshot = {
    schemaVersion: 1,
    rendererVersion: 'preset-visualiser-v1',
    structure: { type: 'linked-list', state: { values: [8, 13, 21] } },
};
const algorithm = {
    name: 'search',
    arguments: { value: 13 },
    inputState: { values: [8, 13, 21] },
};

beforeEach(() => vi.clearAllMocks());

describe('snapshot validation through the real service and routes', () => {
    it.each([
        ['schema', { ...snapshot, schemaVersion: 2 }, 'UNSUPPORTED_SCHEMA_VERSION',
            'The snapshot schema version is not supported.'],
        ['renderer', { ...snapshot, rendererVersion: 'future' }, 'UNSUPPORTED_VISUALISATION',
            'The requested visualisation is not supported.'],
        ['structure', { ...snapshot, structure: { ...snapshot.structure, type: 'sorting' } },
            'UNSUPPORTED_VISUALISATION', 'The requested visualisation is not supported.'],
        ['operation', { ...snapshot, algorithm: { ...algorithm, name: 'reverse' } },
            'UNSUPPORTED_VISUALISATION', 'The requested visualisation is not supported.'],
    ])('returns 422 for unsupported %s', async (_name, body, code, message) => {
        const response = await request(createApp()).post('/api/v1/snapshots').send(body);
        expect(response.status).toBe(422);
        expect(response.body).toEqual({ error: { code, message } });
        expect(repository.insertSnapshot).not.toHaveBeenCalled();
    });

    it.each([
        ['missing version', { rendererVersion: snapshot.rendererVersion, structure: snapshot.structure }],
        ['string version', { ...snapshot, schemaVersion: '1' }],
        ['numeric renderer', { ...snapshot, rendererVersion: 123 }],
        ['numeric structure type', { ...snapshot, structure: { ...snapshot.structure, type: 123 } }],
        ['null structure', { ...snapshot, structure: null }],
        ['array structure', { ...snapshot, structure: [] }],
        ['numeric operation', { ...snapshot, algorithm: { ...algorithm, name: 123 } }],
        ['null algorithm', { ...snapshot, algorithm: null }],
        ['array algorithm', { ...snapshot, algorithm: [] }],
        ['missing arguments', { ...snapshot, algorithm: { ...algorithm, arguments: {} } }],
        ['extra arguments', { ...snapshot, algorithm: { ...algorithm, arguments: { value: 13, index: 0 } } }],
        ['invalid value', { ...snapshot, structure: { type: 'linked-list', state: { values: [100] } } }],
        ['oversized array', { ...snapshot, structure: { type: 'linked-list', state: { values: Array(101).fill(1) } } }],
        ['extra field', { ...snapshot, unexpected: true }],
        ['inconsistent result', { ...snapshot, algorithm: { ...algorithm, name: 'append' } }],
        ['array envelope', []],
    ])('keeps %s as 400', async (_name, body) => {
        const response = await request(createApp()).post('/api/v1/snapshots').send(body);
        expect(response.status).toBe(400);
        expect(response.body.error.code).toBe('INVALID_SNAPSHOT');
        expect(repository.insertSnapshot).not.toHaveBeenCalled();
    });
});
