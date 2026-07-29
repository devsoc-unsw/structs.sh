import { Router, type RequestHandler } from 'express';

export const unavailableLegacyMongoRouter = Router();

const unavailable: RequestHandler = (_request, response) => {
  response.status(503).json({
    error: {
      code: 'LEGACY_DATABASE_UNAVAILABLE',
      message:
        'This feature is unavailable in PostgreSQL-only local mode.',
    },
  });
};

const unavailablePaths = [
  '/api/getAll',
  '/api/getOwnedData',
  '/api/save',
  '/api/delete',
  '/api/deleteAll',
  '/api/deleteAllUsers',
  '/api/getAllUsers',
  '/auth/register',
  '/auth/login',
];

for (const path of unavailablePaths) {
  unavailableLegacyMongoRouter.all(path, unavailable);
}