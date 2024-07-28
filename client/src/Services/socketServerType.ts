export interface ClientToServerEvents {
  mainDebug: (debugInfo: string) => void;
  executeNext: () => void;
}
