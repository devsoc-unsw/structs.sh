import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  check: vi.fn(),
  close: vi.fn(),
  listen: vi.fn(),
  serverClose: vi.fn(),
}));
vi.mock('./config/env', () => ({ env: { port: 8001 } }));
vi.mock('./db/pool', () => ({ checkDatabase: mocks.check, closeDatabase: mocks.close }));
vi.mock('./app', () => ({ createApp: () => ({ listen: mocks.listen }) }));
const handlers = new Map<string, () => void>();
beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  handlers.clear();
  mocks.check.mockResolvedValue(undefined);
  mocks.close.mockResolvedValue(undefined);
  // Capture signal callbacks without registering real listeners or exiting the test worker.
  vi.spyOn(process, 'once').mockImplementation((signal, listener) => {
    handlers.set(String(signal), listener);
    return process;
  });
  vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  mocks.listen.mockReturnValue({ close: mocks.serverClose });
  mocks.serverClose.mockImplementation((done: (error?: Error) => void) => done());
});
afterEach(() => vi.restoreAllMocks());

it('waits for database readiness before listening', async () => {
  let ready!: () => void;
  mocks.check.mockReturnValue(
    new Promise<void>((resolve) => {
      ready = resolve;
    })
  );
  await import('./index.js');
  expect(mocks.listen).not.toHaveBeenCalled();
  ready();
  await vi.waitFor(() =>
    expect(mocks.listen).toHaveBeenCalledExactlyOnceWith(8001, expect.any(Function))
  );
});

it('closes the database and exits unsuccessfully on startup failure', async () => {
  mocks.check.mockRejectedValue(new Error('database unavailable'));
  await import('./index.js');
  await vi.waitFor(() => expect(process.exit).toHaveBeenCalledWith(1));
  expect(mocks.listen).not.toHaveBeenCalled();
  expect(mocks.close).toHaveBeenCalledOnce();
});

it.each(['SIGINT', 'SIGTERM'])(
  'closes the HTTP server before the database on %s',
  async (signal) => {
    await import('./index.js');
    await vi.waitFor(() => expect(mocks.listen).toHaveBeenCalledOnce());
    let finishClose!: (error?: Error) => void;
    mocks.serverClose.mockImplementation((done) => {
      finishClose = done;
    });
    handlers.get(signal)!();
    expect(mocks.close).not.toHaveBeenCalled();
    finishClose();
    await vi.waitFor(() => expect(process.exit).toHaveBeenCalledWith(0));
    expect(mocks.serverClose).toHaveBeenCalledOnce();
    expect(mocks.close).toHaveBeenCalledOnce();
  }
);

it('does not close resources twice when both shutdown signals arrive', async () => {
  await import('./index.js');
  handlers.get('SIGINT')!();
  handlers.get('SIGTERM')!();
  await vi.waitFor(() => expect(mocks.close).toHaveBeenCalledOnce());
  expect(mocks.serverClose).toHaveBeenCalledOnce();
});

it('reports an unsuccessful exit when HTTP shutdown fails', async () => {
  mocks.serverClose.mockImplementation((done) => done(new Error('close failed')));
  await import('./index.js');
  handlers.get('SIGTERM')!();
  await vi.waitFor(() => expect(process.exit).toHaveBeenCalledWith(1));
  expect(console.error).toHaveBeenCalledWith('Graceful shutdown failed:', 'close failed');
});
