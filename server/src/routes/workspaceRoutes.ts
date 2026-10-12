import { Router, type Request, type Response } from 'express';
import { promises as fs } from 'fs';
import path from 'path';

export const workspaceRouter = Router();

const userFilesRoot = path.resolve(process.cwd(), 'user-files');

const readQueryString = (
  request: Request,
  name: string
): string | null => {
  const value = request.query[name];

  return typeof value === 'string' ? value : null;
};

const isSafeSegment = (value: string): boolean =>
  /^[a-zA-Z0-9._-]+$/.test(value) &&
  value !== '.' &&
  value !== '..';

const resolveUserFilePath = (...segments: string[]): string => {
  if (segments.some((segment) => !isSafeSegment(segment))) {
    throw new Error('Invalid workspace path');
  }

  const resolvedPath = path.resolve(userFilesRoot, ...segments);
  const rootPrefix = `${userFilesRoot}${path.sep}`;

  if (
    resolvedPath !== userFilesRoot &&
    !resolvedPath.startsWith(rootPrefix)
  ) {
    throw new Error('Invalid workspace path');
  }

  return resolvedPath;
};

workspaceRouter.get(
  '/api/retrieveWorkspaces',
  async (request: Request, response: Response) => {
    const username = readQueryString(request, 'username');

    if (!username) {
      return response.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message: 'username is required',
        },
      });
    }

    try {
      const workspacePath = resolveUserFilePath(
        username,
        'workspaces'
      );

      const workspaces = await fs.readdir(workspacePath);

      return response.json({ workspaces });
    } catch {
      return response.status(404).json({
        error: {
          code: 'WORKSPACES_NOT_FOUND',
          message: 'No workspaces were found.',
        },
      });
    }
  }
);

workspaceRouter.get(
  '/api/retrieveFile',
  async (request: Request, response: Response) => {
    const username = readQueryString(request, 'username');
    const workspace = readQueryString(request, 'workspace');
    const filename = readQueryString(request, 'filename');

    if (!username || !workspace || !filename) {
      return response.status(400).json({
        error: {
          code: 'INVALID_REQUEST',
          message:
            'username, workspace, and filename are required',
        },
      });
    }

    try {
      const filePath = resolveUserFilePath(
        username,
        'workspaces',
        workspace,
        filename
      );

      const content = await fs.readFile(filePath, 'utf8');

      return response.json({ content });
    } catch {
      return response.status(404).json({
        error: {
          code: 'FILE_NOT_FOUND',
          message: 'The requested file was not found.',
        },
      });
    }
  }
);